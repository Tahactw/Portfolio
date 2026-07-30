/**
 * The complete rendering of a project case study. The public page
 * (src/pages/projects/[id].astro) renders this statically at build time;
 * the admin preview renders the identical component in the browser —
 * so "preview matches live" is true by construction, not by imitation.
 */
import type { Project } from '../../lib/types';
import { withBase, dateSpan } from '../../lib/paths';

const STATUS_LABEL: Record<Project['status'], string> = {
  completed: 'Completed',
  'in-progress': 'In progress',
  planned: 'Planned',
  archived: 'Archived',
};

const LINK_KIND_LABEL: Record<string, string> = {
  repo: 'Code',
  demo: 'Demo',
  paper: 'Paper',
  other: 'Link',
};

export interface ProjectArticleProps {
  project: Project;
  /** Markdown body pre-rendered by src/lib/markdown.ts (raw HTML escaped). */
  bodyHtml: string;
}

export default function ProjectArticle({ project: p, bodyHtml }: ProjectArticleProps) {
  return (
    <article>
      {/* header */}
      <header className="max-w-3xl">
        <p className="mono text-[0.72rem] text-muted uppercase tracking-widest">
          {p.category} · <span className="mono-nums normal-case">{dateSpan(p.startDate, p.endDate)}</span> ·{' '}
          {STATUS_LABEL[p.status]}
        </p>
        <h1
          className="display text-text mt-3"
          style={{ fontSize: 'var(--fs-display)', viewTransitionName: `ptitle-${p.id}` }}
        >
          {p.title}
        </h1>
        <p className="text-muted text-lg mt-4">{p.tagline}</p>
        <p className="mono text-[0.8rem] text-muted mt-4">
          {p.role}
          {p.teamSize && p.teamSize > 1 ? ` · team of ${p.teamSize}` : ''}
        </p>
      </header>

      {/* metrics: the measured layer, drawing-table style */}
      {p.metrics.length > 0 && (
        <div className="border hairline rounded mt-10 overflow-hidden">
          {/* each cell draws right+bottom hairlines; -1px margins collapse them into the frame */}
          <dl className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 -mr-px -mb-px">
            {p.metrics.map((m) => (
              <div key={m.label} className="p-4 border-r border-b hairline flex flex-col">
                <dt className="mono text-[0.68rem] text-muted uppercase tracking-widest">
                  {m.label}
                </dt>
                <dd className="mono-nums text-text text-[1.05rem] mt-auto pt-1">{m.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {/* highlights: the 20-second recruiter layer */}
      {p.highlights.length > 0 && (
        <aside className="border-l-2 border-accent pl-5 mt-10 max-w-3xl" aria-label="Project highlights">
          <h2 className="eyebrow">At a glance</h2>
          <ul className="mt-3 space-y-2">
            {p.highlights.map((h) => (
              <li key={h} className="flex gap-3 text-[0.98rem]">
                <span className="text-accent-text mono select-none" aria-hidden="true">
                  —
                </span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </aside>
      )}

      {/* cover */}
      <figure className="mt-10 border hairline rounded overflow-hidden">
        <img
          src={withBase(p.cover)}
          alt={`Cover image for ${p.title}`}
          width={1200}
          height={800}
          className="w-full h-auto block"
          style={{ viewTransitionName: `cover-${p.id}` }}
        />
      </figure>

      {/* the case study */}
      <div className="prose mt-12" dangerouslySetInnerHTML={{ __html: bodyHtml }} />

      {/* stack */}
      {p.stack.length > 0 && (
        <section className="mt-12 max-w-3xl">
          <h2 className="eyebrow">Tools &amp; stack</h2>
          <ul className="flex flex-wrap gap-1.5 mt-3">
            {p.stack.map((s) => (
              <li
                key={s}
                className="mono text-[0.72rem] text-muted border hairline rounded px-2 py-0.5"
              >
                {s}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* figures */}
      {p.gallery.length > 0 && (
        <section className="mt-12">
          <h2 className="eyebrow">Figures</h2>
          <div className="grid sm:grid-cols-2 gap-5 mt-4">
            {p.gallery.map((g, i) => (
              <figure key={g} className="border hairline rounded overflow-hidden">
                <img
                  src={withBase(g)}
                  alt={`${p.title} — figure ${i + 2}`}
                  width={1200}
                  height={800}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto block"
                />
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* 3D models: load on request only */}
      {p.models.length > 0 && (
        <section className="mt-12">
          <h2 className="eyebrow">3D model</h2>
          <div className="grid gap-5 mt-4">
            {p.models.map((m) => (
              <div
                key={m.src}
                className="model-host border hairline rounded overflow-hidden relative"
                data-model-host
                data-src={withBase(m.src)}
                data-poster={m.poster ? withBase(m.poster) : undefined}
                data-alt={m.label}
              >
                {m.poster && (
                  <img
                    src={withBase(m.poster)}
                    alt=""
                    width={1200}
                    height={800}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover absolute inset-0 opacity-40"
                  />
                )}
                <div className="relative flex flex-col items-center justify-center gap-3 min-h-[280px] p-6 text-center">
                  <p className="mono text-[0.8rem] text-text">{m.label}</p>
                  <button
                    type="button"
                    data-load-model
                    className="mono text-[0.8rem] bg-accent text-accent-ink rounded px-4 py-2.5 hover:opacity-90 transition-opacity duration-150"
                  >
                    Power it on
                  </button>
                  <p className="mono text-[0.68rem] text-muted">powers on when you tap · orbit with drag or arrow keys</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* video */}
      {p.videos.length > 0 && (
        <section className="mt-12">
          <h2 className="eyebrow">Video</h2>
          <div className="grid gap-5 mt-4">
            {p.videos.map((v) => (
              <div
                key={`${v.provider}-${v.id}`}
                className="video-host border hairline rounded overflow-hidden relative aspect-video bg-panel"
                data-video-host
                data-provider={v.provider}
                data-vid={v.id}
                data-label={v.label}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
                  <p className="mono text-[0.8rem] text-text">{v.label}</p>
                  <button
                    type="button"
                    data-load-video
                    className="mono text-[0.8rem] bg-accent text-accent-ink rounded px-4 py-2.5 hover:opacity-90 transition-opacity duration-150"
                  >
                    Play video
                  </button>
                  <p className="mono text-[0.68rem] text-muted">
                    plays from {v.provider === 'vimeo' ? 'Vimeo' : 'YouTube'} on tap
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* links, or the NDA notice */}
      {p.confidential ? (
        <aside className="border border-dashed border-line rounded p-5 mt-12 max-w-3xl">
          <p className="mono text-[0.8rem] text-text uppercase tracking-widest">Details under NDA</p>
          <p className="text-muted text-[0.95rem] mt-2">
            Source, drawings and identifying material for this project are withheld under a
            confidentiality agreement. I'm happy to discuss the approach in conversation.
          </p>
        </aside>
      ) : (
        p.links.length > 0 && (
          <section className="mt-12 max-w-3xl">
            <h2 className="eyebrow">Links</h2>
            <ul className="mt-3 space-y-2">
              {p.links.map((l) => (
                <li key={l.url}>
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mono text-[0.85rem] text-accent-text hover:underline underline-offset-4"
                  >
                    [{LINK_KIND_LABEL[l.kind] ?? 'Link'}] {l.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )
      )}
    </article>
  );
}
