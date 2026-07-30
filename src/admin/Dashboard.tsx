import { useEffect, useState } from 'react';
import { collections } from './schema';
import type { CollectionSpec } from './schema';
import { useStore } from './store';
import { useToast } from './Toast';

interface Row {
  spec: CollectionSpec;
  count: number | null;
  drafts: number;
  samples: number;
  lastEdited: string | null;
}

export default function Dashboard({
  onOpenCollection,
  onOpenProfile,
  onOpenMedia,
}: {
  onOpenCollection: (spec: CollectionSpec) => void;
  onOpenProfile: () => void;
  onOpenMedia: () => void;
}) {
  const store = useStore();
  const { toast } = useToast();
  const [rows, setRows] = useState<Row[]>(
    collections.map((spec) => ({ spec, count: null, drafts: 0, samples: 0, lastEdited: null })),
  );
  const [loadError, setLoadError] = useState<string | null>(null);
  const [removingSamples, setRemovingSamples] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      for (const spec of collections) {
        try {
          const state = await store.loadCollection(spec);
          const date = await store.client.lastCommitDate(spec.file);
          if (cancelled) return;
          setRows((rs) =>
            rs.map((r) =>
              r.spec.name === spec.name
                ? {
                    ...r,
                    count: state.items.length,
                    drafts: state.items.filter((i) => i['published'] === false).length,
                    samples: state.items.filter((i) => i['sample'] === true).length,
                    lastEdited: date,
                  }
                : r,
            ),
          );
        } catch (e) {
          if (cancelled) return;
          setLoadError(e instanceof Error ? e.message : 'Could not load content from GitHub.');
          return;
        }
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalSamples = rows.reduce((n, r) => n + r.samples, 0);

  async function removeAllSamples() {
    if (
      !window.confirm(
        'Remove every sample item from all collections? Your own items are kept. This cannot be undone from here.',
      )
    )
      return;
    setRemovingSamples(true);
    try {
      for (const row of rows) {
        if (row.samples === 0) continue;
        const state = await store.loadCollection(row.spec);
        const kept = state.items.filter((i) => i['sample'] !== true);
        await store.saveCollection(row.spec, kept, `Remove sample ${row.spec.label.toLowerCase()}`);
      }
      setRows((rs) =>
        rs.map((r) => ({
          ...r,
          count: r.count === null ? null : r.count - r.samples,
          samples: 0,
        })),
      );
      toast({
        kind: 'ok',
        text: 'All sample content removed. Your site updates in about a minute.',
        linkHref: store.client.actionsUrl(),
        linkLabel: 'Watch the update',
      });
    } catch (e) {
      toast({
        kind: 'error',
        text: e instanceof Error ? e.message : 'Removing samples failed part-way — reload and check each collection.',
      });
    } finally {
      setRemovingSamples(false);
    }
  }

  return (
    <div>
      <p className="eyebrow">Dashboard</p>
      <h1 className="h2 mt-2">Your content</h1>

      {loadError && (
        <div role="alert" className="border border-accent rounded p-4 mt-6 text-[0.9rem]">
          {loadError}
        </div>
      )}

      {totalSamples > 0 && (
        <div className="border border-accent rounded p-4 sm:p-5 mt-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[0.95rem] font-semibold">
              This site is showing {totalSamples} sample item{totalSamples === 1 ? '' : 's'}.
            </p>
            <p className="text-muted text-[0.85rem] mt-1">
              They exist so the site looks finished on day one. Replace them with your own work,
              then remove them here in one go.
            </p>
          </div>
          <button
            type="button"
            onClick={removeAllSamples}
            disabled={removingSamples}
            className="mono text-[0.8rem] border border-accent text-accent-text rounded px-4 py-2.5 min-h-[44px] hover:bg-accent hover:text-accent-ink transition-colors disabled:opacity-60"
          >
            {removingSamples ? 'Removing…' : 'Remove all samples'}
          </button>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {rows.map((r) => (
          <button
            key={r.spec.name}
            type="button"
            onClick={() => onOpenCollection(r.spec)}
            className="text-left border hairline rounded bg-panel p-5 hover:border-line-strong transition-colors min-h-[44px]"
          >
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="font-semibold">{r.spec.label}</h2>
              <span className="mono-nums text-[1.3rem] text-accent-text">
                {r.count === null ? '…' : r.count}
              </span>
            </div>
            <p className="mono text-[0.72rem] text-muted mt-2">
              {r.count === null
                ? 'Loading from GitHub…'
                : [
                    r.drafts > 0 ? `${r.drafts} draft${r.drafts === 1 ? '' : 's'}` : null,
                    r.samples > 0 ? `${r.samples} sample${r.samples === 1 ? '' : 's'}` : null,
                    r.lastEdited
                      ? `edited ${new Date(r.lastEdited).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
                      : null,
                  ]
                    .filter(Boolean)
                    .join(' · ') || 'up to date'}
            </p>
          </button>
        ))}

        <button
          type="button"
          onClick={onOpenProfile}
          className="text-left border hairline rounded bg-panel p-5 hover:border-line-strong transition-colors min-h-[44px]"
        >
          <h2 className="font-semibold">Profile & site settings</h2>
          <p className="mono text-[0.72rem] text-muted mt-2">
            Name, bio, photo, résumé, email, categories, contact form
          </p>
        </button>

        <button
          type="button"
          onClick={onOpenMedia}
          className="text-left border hairline rounded bg-panel p-5 hover:border-line-strong transition-colors min-h-[44px]"
        >
          <h2 className="font-semibold">Media library</h2>
          <p className="mono text-[0.72rem] text-muted mt-2">
            Every uploaded image, model and document — reuse or clean up
          </p>
        </button>
      </div>

      <p className="mono text-[0.72rem] text-muted mt-10 leading-relaxed max-w-xl">
        Saves commit to GitHub and the public site rebuilds itself — changes appear in about a
        minute. Drafts (unpublished items) never appear on the public site.
      </p>
    </div>
  );
}
