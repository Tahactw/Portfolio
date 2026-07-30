/**
 * Media picker modal: upload something new (with client-side resize to WebP
 * for images) or reuse anything already in the library.
 *
 * Upload happens immediately on confirm — the file is committed before the
 * item that references it can be saved, so a saved item can never point at
 * media that does not exist.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import type { MediaKind } from './schema';
import { useStore } from './store';
import { formatBytes, mediaFilename, processImage, MAX_IMAGE_BYTES } from './image';
import type { ProcessedImage } from './image';
import type { TreeEntry } from './github';

const GLB_MAX = 15 * 1024 * 1024;
const GLB_WARN = 8 * 1024 * 1024;
const PDF_MAX = 10 * 1024 * 1024;

const KIND_EXT: Record<MediaKind, RegExp> = {
  image: /\.(webp|jpe?g|png|gif|avif)$/i,
  model: /\.glb$/i,
  doc: /\.pdf$/i,
};

export default function MediaPicker({
  kind,
  dir,
  onPick,
  onClose,
}: {
  kind: MediaKind;
  dir: string;
  onPick: (path: string) => void;
  onClose: () => void;
}) {
  const store = useStore();
  const [tab, setTab] = useState<'upload' | 'library'>('upload');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [pendingImage, setPendingImage] = useState<(ProcessedImage & { name: string }) | null>(null);
  const [pendingFile, setPendingFile] = useState<{ file: File; warn?: string } | null>(null);
  const [library, setLibrary] = useState<TreeEntry[] | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const cameraInput = useRef<HTMLInputElement>(null);

  // focus the dialog on open; Escape closes; focus is kept inside
  useEffect(() => {
    const el = dialogRef.current;
    el?.focus();
    function onKey(ev: KeyboardEvent) {
      if (ev.key === 'Escape') onClose();
      if (ev.key === 'Tab' && el) {
        const focusables = el.querySelectorAll<HTMLElement>(
          'button, input, [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0]!;
        const last = focusables[focusables.length - 1]!;
        if (ev.shiftKey && document.activeElement === first) {
          ev.preventDefault();
          last.focus();
        } else if (!ev.shiftKey && document.activeElement === last) {
          ev.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    if (tab !== 'library' || library !== null) return;
    store.client
      .listTree('public/media/')
      .then((entries) => setLibrary(entries.filter((e) => KIND_EXT[kind].test(e.path))))
      .catch(() => setError('Could not list the media library. Check your connection and try again.'));
  }, [tab, library, store.client, kind]);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      setPendingImage(null);
      setPendingFile(null);

      if (kind === 'image') {
        if (!/^image\//.test(file.type) && !KIND_EXT.image.test(file.name)) {
          setError('That file is not an image. Use a photo or a PNG/JPG/WebP file.');
          return;
        }
        setBusy(true);
        try {
          const processed = await processImage(file);
          if (processed.finalBytes > MAX_IMAGE_BYTES) {
            setError(
              `Even after compression this image is ${formatBytes(processed.finalBytes)} — the limit is 5 MB. Crop it or use a smaller original.`,
            );
            return;
          }
          setPendingImage({ ...processed, name: file.name });
        } catch (e) {
          setError(e instanceof Error ? e.message : 'Could not process that image.');
        } finally {
          setBusy(false);
        }
        return;
      }

      if (kind === 'model') {
        if (!/\.glb$/i.test(file.name)) {
          setError(
            'Only .glb files work here — it is the 3D format browsers understand. Export or convert STEP/STL/SLDPRT to GLB first (free converters: the "CAD Exchanger" or "gltf.report" websites, or Blender).',
          );
          return;
        }
        // check the GLB magic bytes so a renamed file can't sneak through
        const head = new Uint8Array(await file.slice(0, 4).arrayBuffer());
        const magicOk =
          head[0] === 0x67 && head[1] === 0x6c && head[2] === 0x54 && head[3] === 0x46; // "glTF"
        if (!magicOk) {
          setError('That file is named .glb but is not actually a GLB model. Re-export it from your CAD tool.');
          return;
        }
        if (file.size > GLB_MAX) {
          setError(
            `This model is ${formatBytes(file.size)} — the limit is 15 MB. Reduce the mesh detail when exporting.`,
          );
          return;
        }
        setPendingFile({
          file,
          warn:
            file.size > GLB_WARN
              ? `Heads up: at ${formatBytes(file.size)} this model will load slowly on phones. Under 8 MB is smoother.`
              : undefined,
        });
        return;
      }

      // doc (pdf)
      if (!/\.pdf$/i.test(file.name)) {
        setError('The résumé must be a PDF file.');
        return;
      }
      const head = new TextDecoder().decode(new Uint8Array(await file.slice(0, 5).arrayBuffer()));
      if (!head.startsWith('%PDF-')) {
        setError('That file is named .pdf but does not look like a real PDF. Re-export it.');
        return;
      }
      if (file.size > PDF_MAX) {
        setError(`This PDF is ${formatBytes(file.size)} — the limit is 10 MB. Export it at a lower quality.`);
        return;
      }
      setPendingFile({ file });
    },
    [kind],
  );

  async function confirmUpload() {
    setBusy(true);
    setError(null);
    try {
      let path: string;
      if (pendingImage) {
        const name = mediaFilename(pendingImage.name, pendingImage.ext);
        path = await store.uploadMedia(dir, name, pendingImage.blob);
      } else if (pendingFile) {
        const ext = kind === 'model' ? 'glb' : 'pdf';
        const name = mediaFilename(pendingFile.file.name, ext);
        path = await store.uploadMedia(dir, name, pendingFile.file);
      } else {
        return;
      }
      onPick(path);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  }

  const acceptAttr = kind === 'image' ? 'image/*' : kind === 'model' ? '.glb' : 'application/pdf';

  return (
    <div
      className="fixed inset-0 z-40 bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Choose ${kind === 'image' ? 'an image' : kind === 'model' ? 'a 3D model' : 'a document'}`}
        tabIndex={-1}
        className="bg-ink border hairline sm:rounded w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto outline-none"
      >
        <div className="sticky top-0 bg-ink border-b hairline flex items-center justify-between px-5 py-3 z-10">
          <div className="flex gap-1" role="tablist" aria-label="Source">
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'upload'}
              onClick={() => setTab('upload')}
              className={`mono text-[0.8rem] px-3 py-2.5 min-h-[44px] rounded transition-colors ${tab === 'upload' ? 'text-accent-text' : 'text-muted hover:text-text'}`}
            >
              Upload new
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'library'}
              onClick={() => setTab('library')}
              className={`mono text-[0.8rem] px-3 py-2.5 min-h-[44px] rounded transition-colors ${tab === 'library' ? 'text-accent-text' : 'text-muted hover:text-text'}`}
            >
              Library
            </button>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="mono text-muted hover:text-text w-11 h-11 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-5">
          {error && (
            <p role="alert" className="text-[0.9rem] text-accent-text border border-accent rounded p-3 mb-4">
              {error}
            </p>
          )}

          {tab === 'upload' && (
            <div>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  const f = e.dataTransfer.files[0];
                  if (f) void handleFile(f);
                }}
                className={`border-2 border-dashed rounded p-8 text-center transition-colors ${dragOver ? 'border-accent' : 'border-line'}`}
              >
                <p className="text-muted text-[0.95rem]">
                  Drag a file here, or
                </p>
                <div className="flex flex-wrap justify-center gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => fileInput.current?.click()}
                    className="mono text-[0.8rem] bg-accent text-accent-ink rounded px-4 py-2.5 min-h-[44px] hover:opacity-90 transition-opacity"
                  >
                    Choose a file
                  </button>
                  {kind === 'image' && (
                    <button
                      type="button"
                      onClick={() => cameraInput.current?.click()}
                      className="mono text-[0.8rem] border border-line-strong text-text rounded px-4 py-2.5 min-h-[44px] hover:border-accent transition-colors"
                    >
                      Take a photo
                    </button>
                  )}
                </div>
                <p className="mono text-[0.72rem] text-muted mt-4">
                  {kind === 'image' && 'Photos are resized and compressed automatically before upload.'}
                  {kind === 'model' && '.glb up to 15 MB. STEP/STL must be converted to GLB first.'}
                  {kind === 'doc' && 'PDF up to 10 MB.'}
                </p>
                <input
                  ref={fileInput}
                  type="file"
                  accept={acceptAttr}
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void handleFile(f);
                    e.target.value = '';
                  }}
                />
                {kind === 'image' && (
                  <input
                    ref={cameraInput}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) void handleFile(f);
                      e.target.value = '';
                    }}
                  />
                )}
              </div>

              {busy && !pendingImage && !pendingFile && (
                <p className="mono text-[0.8rem] text-muted mt-4">Processing…</p>
              )}

              {pendingImage && (
                <div className="border hairline rounded p-4 mt-4">
                  <img
                    src={URL.createObjectURL(pendingImage.blob)}
                    alt="Preview of the processed upload"
                    className="max-h-56 mx-auto border hairline rounded"
                  />
                  <p className="mono text-[0.75rem] text-muted text-center mt-3">
                    {formatBytes(pendingImage.originalBytes)} → {formatBytes(pendingImage.finalBytes)} ·{' '}
                    {pendingImage.width}×{pendingImage.height} · {pendingImage.ext}
                  </p>
                  <div className="flex justify-center mt-4">
                    <button
                      type="button"
                      onClick={confirmUpload}
                      disabled={busy}
                      className="mono text-[0.8rem] bg-accent text-accent-ink rounded px-5 py-2.5 min-h-[44px] disabled:opacity-60 hover:opacity-90 transition-opacity"
                    >
                      {busy ? 'Uploading…' : 'Use this image'}
                    </button>
                  </div>
                </div>
              )}

              {pendingFile && (
                <div className="border hairline rounded p-4 mt-4 text-center">
                  <p className="mono text-[0.8rem]">{pendingFile.file.name}</p>
                  <p className="mono text-[0.72rem] text-muted mt-1">{formatBytes(pendingFile.file.size)}</p>
                  {pendingFile.warn && (
                    <p className="text-[0.85rem] text-accent-text mt-2">{pendingFile.warn}</p>
                  )}
                  <button
                    type="button"
                    onClick={confirmUpload}
                    disabled={busy}
                    className="mono text-[0.8rem] bg-accent text-accent-ink rounded px-5 py-2.5 min-h-[44px] mt-4 disabled:opacity-60 hover:opacity-90 transition-opacity"
                  >
                    {busy ? 'Uploading…' : 'Upload this file'}
                  </button>
                </div>
              )}
            </div>
          )}

          {tab === 'library' && (
            <div>
              {library === null && <p className="mono text-[0.8rem] text-muted">Loading library…</p>}
              {library !== null && library.length === 0 && (
                <p className="text-muted text-[0.95rem]">
                  Nothing of this type has been uploaded yet — the Upload tab is the place to start.
                </p>
              )}
              {library !== null && library.length > 0 && (
                <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {library.map((entry) => {
                    const sitePath = entry.path.replace(/^public/, '');
                    const isImage = KIND_EXT.image.test(entry.path);
                    return (
                      <li key={entry.path}>
                        <button
                          type="button"
                          onClick={() => {
                            onPick(sitePath);
                            onClose();
                          }}
                          className="w-full border hairline rounded overflow-hidden hover:border-accent transition-colors text-left"
                        >
                          {isImage ? (
                            <img
                              src={store.client.rawUrl(entry.path)}
                              alt=""
                              loading="lazy"
                              className="w-full h-24 object-cover"
                            />
                          ) : (
                            <div className="h-24 flex items-center justify-center mono text-[0.7rem] text-muted">
                              {entry.path.split('.').pop()?.toUpperCase()}
                            </div>
                          )}
                          <p className="mono text-[0.65rem] text-muted p-2 break-all">
                            {entry.path.split('/').pop()} · {formatBytes(entry.size)}
                          </p>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
