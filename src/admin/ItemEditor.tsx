import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CollectionSpec, FieldSpec, MediaKind } from './schema';
import { slugify, uniqueSlug, validateItem } from './schema';
import { useStore, GitHubError } from './store';
import type { Item } from './store';
import { useToast } from './Toast';
import { Field } from './fields';
import MediaPicker from './MediaPicker';
import Preview from './Preview';

interface PickerState {
  kind: MediaKind;
  dir: string;
  onPick: (path: string) => void;
}

const DRAFT_PREFIX = 'portfolio-admin-draft:';

export default function ItemEditor({
  spec,
  itemId,
  onDone,
}: {
  spec: CollectionSpec;
  itemId: string | null;
  onDone: () => void;
}) {
  const store = useStore();
  const { toast } = useToast();
  const [items, setItems] = useState<Item[] | null>(null);
  const [value, setValue] = useState<Item | null>(null);
  const [baseline, setBaseline] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tab, setTab] = useState<'edit' | 'preview'>('edit');
  const [picker, setPicker] = useState<PickerState | null>(null);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [draftOffer, setDraftOffer] = useState<Item | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const slugTouched = useRef(false);
  const draftKey = `${DRAFT_PREFIX}${spec.name}:${itemId ?? 'new'}`;

  /* ------------------------------------------------------------- load */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const state = await store.loadCollection(spec);
        if (cancelled) return;
        setItems(state.items);
        const base = itemId
          ? (state.items.find((i) => String(i['id']) === itemId) ?? null)
          : (spec.newItem() as Item);
        if (itemId && !base) {
          setLoadError(`No ${spec.itemNoun} with the id "${itemId}" exists any more.`);
          return;
        }
        setValue(base);
        setBaseline(JSON.stringify(base));
        if (itemId) slugTouched.current = true;
        // profile categories feed the category dropdown
        if (spec.fields.some((f) => f.key === 'category')) {
          const prof = store.profile ?? (await store.loadProfile());
          if (!cancelled) setCategories((prof.data['categories'] as string[]) ?? []);
        }
        // offer an unsaved draft if one exists and differs
        try {
          const raw = localStorage.getItem(draftKey);
          if (raw) {
            const parsed = JSON.parse(raw) as { value: Item };
            if (JSON.stringify(parsed.value) !== JSON.stringify(base)) {
              setDraftOffer(parsed.value);
            } else {
              localStorage.removeItem(draftKey);
            }
          }
        } catch {
          /* corrupt draft: ignore */
        }
      } catch (e) {
        if (!cancelled)
          setLoadError(e instanceof Error ? e.message : 'Could not load from GitHub.');
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spec.name, itemId]);

  /* -------------------------------------------------- autosave drafts */
  useEffect(() => {
    if (!value || JSON.stringify(value) === baseline) return;
    try {
      localStorage.setItem(draftKey, JSON.stringify({ value, at: Date.now() }));
    } catch {
      /* storage full/unavailable — autosave silently off */
    }
  }, [value, baseline, draftKey]);

  /* ------------------------------------------------------ field logic */
  const specWithOptions = useMemo(() => {
    return {
      ...spec,
      fields: spec.fields.map((f) =>
        f.key === 'category'
          ? { ...f, options: categories.map((c) => ({ value: c, label: c })) }
          : f,
      ),
    };
  }, [spec, categories]);

  const suggestions = useMemo(() => {
    const pools: Record<string, string[]> = {};
    if (!items) return pools;
    for (const f of spec.fields) {
      if (!f.suggestFrom) continue;
      const seen = new Set<string>();
      for (const it of items) {
        const v = it[f.suggestFrom];
        if (Array.isArray(v)) for (const s of v) typeof s === 'string' && seen.add(s);
        else if (typeof v === 'string' && v) seen.add(v);
      }
      pools[f.key] = [...seen].sort();
    }
    return pools;
  }, [items, spec.fields]);

  const setField = useCallback(
    (key: string, v: unknown) => {
      setValue((cur) => {
        if (!cur) return cur;
        const next = { ...cur, [key]: v };
        // keep the slug tracking the title until the owner edits the slug
        if (key === spec.titleKey && !slugTouched.current) {
          next['id'] = slugify(String(v ?? ''));
        }
        return next;
      });
    },
    [spec.titleKey],
  );

  const openPicker = useCallback<(kind: MediaKind, dir: string, onPick: (p: string) => void) => void>(
    (kind, dir, onPick) => setPicker({ kind, dir, onPick }),
    [],
  );

  /* -------------------------------------------------------------- save */
  async function save() {
    if (!value || !items) return;
    const otherIds = new Set(
      items.filter((i) => String(i['id']) !== itemId).map((i) => String(i['id'])),
    );
    // auto-resolve an empty slug before validating
    let candidate = value;
    if (!candidate['id']) {
      candidate = {
        ...candidate,
        id: uniqueSlug(slugify(String(candidate[spec.titleKey] ?? '')), otherIds),
      };
    }
    const errs = validateItem(specWithOptions, candidate, otherIds);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      setTab('edit');
      toast({ kind: 'error', text: 'Not saved yet — a few fields need attention. They are marked below.' });
      // move focus to the error summary for keyboard/screen-reader users
      document.getElementById('editor-errors')?.focus();
      return;
    }

    const title = String(candidate[spec.titleKey] ?? candidate['id']);
    // editing strips the sample flag: it is your item now
    delete candidate['sample'];
    let nextItems: Item[];
    if (itemId) {
      nextItems = items.map((i) => (String(i['id']) === itemId ? candidate : i));
    } else {
      if (spec.orderable) {
        const maxOrder = Math.max(0, ...items.map((i) => Number(i['order'] ?? 0)));
        candidate = { ...candidate, order: maxOrder + 1 };
      }
      nextItems = [...items, candidate];
    }
    const message = `${itemId ? 'Update' : 'Add'} ${spec.itemNoun}: ${title}`;

    setSaving(true);
    try {
      await store.saveCollection(spec, nextItems, message);
      afterSave();
    } catch (e) {
      if (e instanceof GitHubError && e.status === 409) {
        const retry = window.confirm(
          `${e.message}\n\nLoad the newest version and apply your change on top of it?`,
        );
        if (retry) {
          try {
            const fresh = await store.loadCollection(spec);
            const freshNext = itemId
              ? fresh.items.map((i) => (String(i['id']) === itemId ? candidate : i))
              : [...fresh.items.filter((i) => String(i['id']) !== String(candidate['id'])), candidate];
            await store.saveCollection(spec, freshNext, message);
            afterSave();
          } catch (e2) {
            toast({ kind: 'error', text: e2 instanceof Error ? e2.message : 'Save failed.' });
          }
        }
      } else {
        toast({ kind: 'error', text: e instanceof Error ? e.message : 'Save failed.' });
      }
    } finally {
      setSaving(false);
    }
  }

  function afterSave() {
    try {
      localStorage.removeItem(draftKey);
    } catch {
      /* ignore */
    }
    toast({
      kind: 'ok',
      text: 'Saved. Your site updates in about a minute.',
      linkHref: store.client.actionsUrl(),
      linkLabel: 'Watch the update',
    });
    onDone();
  }

  function cancel() {
    const dirty = value && JSON.stringify(value) !== baseline;
    if (dirty && !window.confirm('Leave without saving? Your edits stay as a local draft on this device.')) {
      return;
    }
    onDone();
  }

  /* ------------------------------------------------------------ render */
  if (loadError) {
    return (
      <div>
        <div role="alert" className="border border-accent rounded p-4 text-[0.9rem]">
          {loadError}
        </div>
        <button
          type="button"
          onClick={onDone}
          className="mono text-[0.8rem] text-muted hover:text-text mt-4 min-h-[44px]"
        >
          ← Back to {spec.label}
        </button>
      </div>
    );
  }
  if (!value) {
    return <p className="mono text-[0.8rem] text-muted">Loading from GitHub…</p>;
  }

  const errorCount = Object.keys(errors).length;
  const isSample = value['sample'] === true;

  return (
    <div>
      <button
        type="button"
        onClick={cancel}
        className="mono text-[0.8rem] text-muted hover:text-text min-h-[44px] transition-colors"
      >
        ← {spec.label}
      </button>

      <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
        <h1 className="h2">
          {itemId ? `Edit ${spec.itemNoun}` : `New ${spec.itemNoun}`}
        </h1>
        {spec.name === 'projects' && (
          <div className="flex gap-1" role="tablist" aria-label="Editor view">
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'edit'}
              onClick={() => setTab('edit')}
              className={`mono text-[0.8rem] px-3 py-2.5 min-h-[44px] transition-colors ${tab === 'edit' ? 'text-accent-text' : 'text-muted hover:text-text'}`}
            >
              Edit
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'preview'}
              onClick={() => setTab('preview')}
              className={`mono text-[0.8rem] px-3 py-2.5 min-h-[44px] transition-colors ${tab === 'preview' ? 'text-accent-text' : 'text-muted hover:text-text'}`}
            >
              Preview
            </button>
          </div>
        )}
      </div>

      {isSample && (
        <div className="border border-accent rounded p-4 mt-4 text-[0.9rem]">
          This is sample content — it exists so the site looks finished on day one. Saving your
          edits makes it yours; or delete it from the list view.
        </div>
      )}

      {draftOffer && (
        <div className="border border-accent rounded p-4 mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[0.9rem]">
            You have unsaved edits from an earlier session on this device.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setValue(draftOffer);
                slugTouched.current = true;
                setDraftOffer(null);
              }}
              className="mono text-[0.75rem] bg-accent text-accent-ink rounded px-3 py-2.5 min-h-[44px] hover:opacity-90 transition-opacity"
            >
              Restore them
            </button>
            <button
              type="button"
              onClick={() => {
                try {
                  localStorage.removeItem(draftKey);
                } catch {
                  /* ignore */
                }
                setDraftOffer(null);
              }}
              className="mono text-[0.75rem] border border-line-strong text-muted hover:text-text rounded px-3 py-2.5 min-h-[44px] transition-colors"
            >
              Discard them
            </button>
          </div>
        </div>
      )}

      {errorCount > 0 && (
        <div
          id="editor-errors"
          tabIndex={-1}
          role="alert"
          className="border border-accent rounded p-4 mt-4 text-[0.9rem] outline-none"
        >
          {errorCount === 1 ? 'One field needs attention' : `${errorCount} fields need attention`} —
          each is marked below in the form.
        </div>
      )}

      {tab === 'preview' ? (
        <div className="mt-6 border hairline rounded p-4 sm:p-8 bg-ink">
          <p className="mono text-[0.72rem] text-muted uppercase tracking-widest mb-6">
            Preview — exactly how the live page renders this
          </p>
          <Preview spec={spec} value={value} />
        </div>
      ) : (
        <form
          className="mt-8 space-y-7 max-w-2xl"
          onSubmit={(e) => {
            e.preventDefault();
            void save();
          }}
          noValidate
        >
          {specWithOptions.fields.map((f: FieldSpec) => (
            <Field
              key={f.key}
              spec={f}
              value={value[f.key]}
              onChange={(v) => setField(f.key, v)}
              error={errors[f.key]}
              errorsByPath={errors}
              suggestions={suggestions[f.key] ?? []}
              openPicker={openPicker}
            />
          ))}

          {/* slug, editable but auto-maintained */}
          <div>
            <label htmlFor="item-slug" className="mono text-[0.8rem] text-text block mb-2">
              Web address (slug)
            </label>
            <input
              id="item-slug"
              type="text"
              value={String(value['id'] ?? '')}
              onChange={(e) => {
                slugTouched.current = true;
                setField('id', e.target.value);
              }}
              className="w-full bg-panel border border-line-strong rounded px-3.5 py-3 text-text mono text-[0.85rem]"
              aria-invalid={errors['id'] ? true : undefined}
              aria-describedby={errors['id'] ? 'item-slug-err' : 'item-slug-help'}
            />
            {errors['id'] && (
              <p id="item-slug-err" className="text-[0.85rem] text-accent-text mt-1.5">
                {errors['id']}
              </p>
            )}
            <p id="item-slug-help" className="mono text-[0.72rem] text-muted mt-1.5">
              Fills in from the title on its own. Changing it after publishing breaks old links to
              this page.
            </p>
          </div>
        </form>
      )}

      {/* sticky save bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t hairline bg-ink z-30">
        <div className="wrap flex items-center justify-between gap-3 py-3">
          <button
            type="button"
            onClick={cancel}
            className="mono text-[0.8rem] text-muted hover:text-text px-3 py-2.5 min-h-[44px] transition-colors"
          >
            Cancel
          </button>
          <div className="flex items-center gap-4">
            {spec.publishable && (
              <label className="flex items-center gap-2 cursor-pointer min-h-[44px]">
                <input
                  type="checkbox"
                  checked={value['published'] === true}
                  onChange={(e) => setField('published', e.target.checked)}
                  className="w-4 h-4 accent-[var(--c-accent)]"
                />
                <span className="mono text-[0.8rem]">Published</span>
              </label>
            )}
            <button
              type="button"
              onClick={() => void save()}
              disabled={saving}
              className="mono text-[0.85rem] bg-accent text-accent-ink rounded px-6 py-3 min-h-[44px] disabled:opacity-60 hover:opacity-90 transition-opacity"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      {picker && (
        <MediaPicker
          kind={picker.kind}
          dir={picker.dir}
          onPick={picker.onPick}
          onClose={() => setPicker(null)}
        />
      )}
    </div>
  );
}

