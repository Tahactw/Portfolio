import { useEffect, useState } from 'react';
import type { CollectionSpec } from './schema';
import { useStore, GitHubError } from './store';
import type { Item } from './store';
import { useToast } from './Toast';
import { uniqueSlug } from './schema';

export default function CollectionView({
  spec,
  onBack,
  onEdit,
}: {
  spec: CollectionSpec;
  onBack: () => void;
  onEdit: (itemId: string | null) => void;
}) {
  const store = useStore();
  const { toast } = useToast();
  const [items, setItems] = useState<Item[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    store
      .loadCollection(spec)
      .then((s) => {
        if (!cancelled) setItems(sortForList(spec, s.items));
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Could not load this collection.');
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spec.name]);

  async function persist(next: Item[], message: string) {
    setBusy(true);
    try {
      await store.saveCollection(spec, next, message);
      setItems(next);
      toast({
        kind: 'ok',
        text: 'Saved. Your site updates in about a minute.',
        linkHref: store.client.actionsUrl(),
        linkLabel: 'Watch the update',
      });
    } catch (e) {
      if (e instanceof GitHubError && e.status === 409) {
        const retry = window.confirm(
          `${e.message}\n\nLoad the newest version and apply your change on top of it?`,
        );
        if (retry) {
          try {
            await store.forceSaveCollection(spec, next, message);
            setItems(next);
            toast({ kind: 'ok', text: 'Saved over the newer version. Your site updates in about a minute.' });
          } catch (e2) {
            toast({ kind: 'error', text: e2 instanceof Error ? e2.message : 'Save failed.' });
          }
        }
      } else {
        toast({ kind: 'error', text: e instanceof Error ? e.message : 'Save failed.' });
      }
    } finally {
      setBusy(false);
    }
  }

  function move(idx: number, dir: -1 | 1) {
    if (!items) return;
    const next = [...items];
    const j = idx + dir;
    if (j < 0 || j >= next.length) return;
    const a = next[idx]!;
    next[idx] = next[j]!;
    next[j] = a;
    // renumber the manual order field
    next.forEach((it, i) => {
      it['order'] = i + 1;
    });
    void persist(next, `Reorder ${spec.label.toLowerCase()}`);
  }

  function togglePublished(idx: number) {
    if (!items) return;
    const next = items.map((it, i) =>
      i === idx ? { ...it, published: !(it['published'] as boolean) } : it,
    );
    const it = next[idx]!;
    void persist(
      next,
      `${it['published'] ? 'Publish' : 'Unpublish'} ${spec.itemNoun}: ${String(it[spec.titleKey] ?? it['id'])}`,
    );
  }

  function duplicate(idx: number) {
    if (!items) return;
    const src = items[idx]!;
    const taken = new Set(items.map((i) => String(i['id'])));
    const copy: Item = JSON.parse(JSON.stringify(src)) as Item;
    copy['id'] = uniqueSlug(`${String(src['id'])}-copy`, taken);
    copy[spec.titleKey] = `${String(src[spec.titleKey] ?? '')} (copy)`;
    if (spec.publishable) copy['published'] = false;
    delete copy['sample'];
    const next = [...items.slice(0, idx + 1), copy, ...items.slice(idx + 1)];
    void persist(next, `Add ${spec.itemNoun}: ${String(copy[spec.titleKey])}`);
  }

  function remove(idx: number) {
    if (!items) return;
    const it = items[idx]!;
    if (
      !window.confirm(
        `Delete "${String(it[spec.titleKey] ?? it['id'])}"? It disappears from the site on the next update. This cannot be undone from here.`,
      )
    )
      return;
    const next = items.filter((_, i) => i !== idx);
    void persist(next, `Delete ${spec.itemNoun}: ${String(it[spec.titleKey] ?? it['id'])}`);
  }

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
        <h1 className="h2">{spec.label}</h1>
        <button
          type="button"
          onClick={() => onEdit(null)}
          className="mono text-[0.8rem] bg-accent text-accent-ink rounded px-4 py-2.5 min-h-[44px] hover:opacity-90 transition-opacity"
        >
          Add {spec.itemNoun}
        </button>
      </div>

      {error && (
        <div role="alert" className="border border-accent rounded p-4 mt-6 text-[0.9rem]">
          {error}
        </div>
      )}

      {items === null && !error && (
        <p className="mono text-[0.8rem] text-muted mt-8">Loading from GitHub…</p>
      )}

      {items !== null && items.length === 0 && (
        <div className="border border-dashed border-line rounded p-10 text-center mt-8">
          <p className="text-muted">
            Nothing here yet. “Add {spec.itemNoun}” starts the first one.
          </p>
        </div>
      )}

      {items !== null && items.length > 0 && (
        <ol className="mt-8 space-y-3">
          {items.map((it, idx) => {
            const title = String(it[spec.titleKey] ?? it['id'] ?? '');
            const subtitle = spec.subtitleKey ? String(it[spec.subtitleKey] ?? '') : '';
            const draft = spec.publishable && it['published'] === false;
            const sample = it['sample'] === true;
            return (
              <li
                key={String(it['id'] ?? idx)}
                className="border hairline rounded bg-panel p-4 flex flex-wrap items-center gap-3"
              >
                {spec.orderable && (
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      aria-label={`Move ${title} up`}
                      onClick={() => move(idx, -1)}
                      disabled={busy || idx === 0}
                      className="mono text-muted hover:text-text border hairline rounded w-9 h-9 disabled:opacity-30 transition-colors"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      aria-label={`Move ${title} down`}
                      onClick={() => move(idx, 1)}
                      disabled={busy || idx === items.length - 1}
                      className="mono text-muted hover:text-text border hairline rounded w-9 h-9 disabled:opacity-30 transition-colors"
                    >
                      ↓
                    </button>
                  </div>
                )}
                <div className="flex-1 min-w-[10rem]">
                  <p className="font-semibold leading-snug">{title}</p>
                  <p className="mono text-[0.72rem] text-muted mt-1">
                    {[subtitle || null, draft ? 'DRAFT' : null, sample ? 'SAMPLE — replace with your own' : null]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {spec.publishable && (
                    <button
                      type="button"
                      onClick={() => togglePublished(idx)}
                      disabled={busy}
                      className={`mono text-[0.72rem] border rounded px-3 py-2.5 min-h-[44px] transition-colors ${
                        draft
                          ? 'border-line-strong text-muted hover:text-text'
                          : 'border-accent text-accent-text'
                      }`}
                    >
                      {draft ? 'Draft' : 'Published'}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onEdit(String(it['id']))}
                    className="mono text-[0.72rem] bg-accent text-accent-ink rounded px-3 py-2.5 min-h-[44px] hover:opacity-90 transition-opacity"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => duplicate(idx)}
                    disabled={busy}
                    className="mono text-[0.72rem] border border-line-strong text-muted hover:text-text rounded px-3 py-2.5 min-h-[44px] transition-colors"
                  >
                    Duplicate
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(idx)}
                    disabled={busy}
                    className="mono text-[0.72rem] border border-line-strong text-muted hover:text-accent-text hover:border-accent rounded px-3 py-2.5 min-h-[44px] transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

/** Presentation order: manual `order` where the collection has it, else date. */
function sortForList(spec: CollectionSpec, items: Item[]): Item[] {
  const copy = [...items];
  if (spec.orderable) {
    copy.sort((a, b) => Number(a['order'] ?? 0) - Number(b['order'] ?? 0));
  } else if (copy.some((i) => typeof i['startDate'] === 'string')) {
    copy.sort((a, b) => String(b['startDate'] ?? '').localeCompare(String(a['startDate'] ?? '')));
  } else if (copy.some((i) => typeof i['issueDate'] === 'string')) {
    copy.sort((a, b) => String(b['issueDate'] ?? '').localeCompare(String(a['issueDate'] ?? '')));
  }
  return copy;
}

