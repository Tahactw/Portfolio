/**
 * The media library: everything under public/media/, with usage detection
 * across all content files so orphans are visible and safe to delete.
 */
import { useEffect, useState } from 'react';
import { collections } from './schema';
import { useStore } from './store';
import { useToast } from './Toast';
import { formatBytes } from './image';
import type { TreeEntry } from './github';

interface MediaRow extends TreeEntry {
  sitePath: string;
  usedBy: string[];
}

export default function MediaLibrary({ onBack }: { onBack: () => void }) {
  const store = useStore();
  const { toast } = useToast();
  const [rows, setRows] = useState<MediaRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unused'>('all');
  const [busyPath, setBusyPath] = useState<string | null>(null);

  async function load() {
    setError(null);
    try {
      const entries = await store.client.listTree('public/media/');
      // gather every media reference in every content file
      const referenced = new Map<string, string[]>();
      const note = (path: string, source: string) => {
        const list = referenced.get(path) ?? [];
        if (!list.includes(source)) list.push(source);
        referenced.set(path, list);
      };
      const scan = (v: unknown, source: string) => {
        if (typeof v === 'string' && v.startsWith('/media/')) note(v, source);
        else if (Array.isArray(v)) for (const x of v) scan(x, source);
        else if (v && typeof v === 'object')
          for (const x of Object.values(v as Record<string, unknown>)) scan(x, source);
      };
      for (const spec of collections) {
        const state = await store.loadCollection(spec);
        for (const item of state.items) scan(item, spec.label);
      }
      const prof = await store.loadProfile();
      scan(prof.data, 'Profile');

      setRows(
        entries.map((e) => ({
          ...e,
          sitePath: e.path.replace(/^public/, ''),
          usedBy: referenced.get(e.path.replace(/^public/, '')) ?? [],
        })),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load the media library.');
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function remove(row: MediaRow) {
    if (row.usedBy.length > 0) return;
    if (
      !window.confirm(
        `Delete ${row.path.split('/').pop()}? Nothing on the site uses it, so this is safe — but it cannot be undone from here.`,
      )
    )
      return;
    setBusyPath(row.path);
    try {
      await store.deleteMedia(row.path, row.sha);
      setRows((rs) => (rs ? rs.filter((r) => r.path !== row.path) : rs));
      toast({ kind: 'ok', text: 'File deleted.' });
    } catch (e) {
      toast({ kind: 'error', text: e instanceof Error ? e.message : 'Delete failed.' });
    } finally {
      setBusyPath(null);
    }
  }

  const shown = rows?.filter((r) => (filter === 'unused' ? r.usedBy.length === 0 : true)) ?? null;
  const unusedCount = rows?.filter((r) => r.usedBy.length === 0).length ?? 0;

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="mono text-[0.8rem] text-muted hover:text-text min-h-[44px] transition-colors"
      >
        ← Dashboard
      </button>
      <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
        <h1 className="h2">Media library</h1>
        <div className="flex gap-1" role="tablist" aria-label="Filter">
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'all'}
            onClick={() => setFilter('all')}
            className={`mono text-[0.8rem] px-3 py-2.5 min-h-[44px] transition-colors ${filter === 'all' ? 'text-accent-text' : 'text-muted hover:text-text'}`}
          >
            All {rows ? `(${rows.length})` : ''}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'unused'}
            onClick={() => setFilter('unused')}
            className={`mono text-[0.8rem] px-3 py-2.5 min-h-[44px] transition-colors ${filter === 'unused' ? 'text-accent-text' : 'text-muted hover:text-text'}`}
          >
            Unused {rows ? `(${unusedCount})` : ''}
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" className="border border-accent rounded p-4 mt-6 text-[0.9rem]">
          {error}
        </div>
      )}
      {shown === null && !error && (
        <p className="mono text-[0.8rem] text-muted mt-8">Reading the repository…</p>
      )}
      {shown !== null && shown.length === 0 && (
        <div className="border border-dashed border-line rounded p-10 text-center mt-8">
          <p className="text-muted">
            {filter === 'unused'
              ? 'No orphaned files — everything uploaded is in use somewhere.'
              : 'No media yet. Files appear here as you add them to projects and certificates.'}
          </p>
        </div>
      )}

      {shown !== null && shown.length > 0 && (
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
          {shown.map((row) => {
            const isImage = /\.(webp|jpe?g|png|gif|avif)$/i.test(row.path);
            return (
              <li key={row.path} className="border hairline rounded overflow-hidden bg-panel">
                {isImage ? (
                  <img
                    src={store.client.rawUrl(row.path)}
                    alt=""
                    loading="lazy"
                    className="w-full h-28 object-cover border-b hairline"
                  />
                ) : (
                  <div className="h-28 flex items-center justify-center mono text-[0.75rem] text-muted border-b hairline">
                    {row.path.split('.').pop()?.toUpperCase()}
                  </div>
                )}
                <div className="p-3">
                  <p className="mono text-[0.65rem] break-all">{row.path.split('/').pop()}</p>
                  <p className="mono text-[0.65rem] text-muted mt-1">
                    {formatBytes(row.size)} ·{' '}
                    {row.usedBy.length > 0 ? `used in ${row.usedBy.join(', ')}` : 'not used anywhere'}
                  </p>
                  {row.usedBy.length === 0 && (
                    <button
                      type="button"
                      onClick={() => void remove(row)}
                      disabled={busyPath === row.path}
                      className="mono text-[0.7rem] border border-line-strong text-muted hover:text-accent-text hover:border-accent rounded px-2.5 py-2 min-h-[36px] mt-2 transition-colors disabled:opacity-50"
                    >
                      {busyPath === row.path ? 'Deleting…' : 'Delete'}
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
