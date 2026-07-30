/**
 * The preview tab. For projects it renders the real ProjectArticle — the
 * same component the build renders statically — with the same markdown
 * pipeline, inside the site's global styles. Other collections get a
 * faithful reproduction of their public markup.
 */
import { useEffect, useMemo, useRef } from 'react';
import type { CollectionSpec } from './schema';
import type { Item } from './store';
import type { Project } from '../lib/types';
import ProjectArticle from '../components/react/ProjectArticle';
import { renderMarkdown } from '../lib/markdown';
import { wireProjectMedia } from '../lib/media-wire';

export default function Preview({ spec, value }: { spec: CollectionSpec; value: Item }) {
  const ref = useRef<HTMLDivElement>(null);

  const project = useMemo(() => {
    if (spec.name !== 'projects') return null;
    // fill the gaps a half-finished form leaves so preview never crashes
    return {
      id: String(value['id'] ?? 'preview'),
      title: String(value['title'] ?? '') || 'Untitled project',
      tagline: String(value['tagline'] ?? ''),
      summary: String(value['summary'] ?? ''),
      body: String(value['body'] ?? ''),
      role: String(value['role'] ?? ''),
      teamSize: typeof value['teamSize'] === 'number' ? (value['teamSize'] as number) : undefined,
      startDate: String(value['startDate'] ?? '') || new Date().toISOString().slice(0, 10),
      endDate: value['endDate'] ? String(value['endDate']) : undefined,
      status: (value['status'] as Project['status']) ?? 'in-progress',
      category: String(value['category'] ?? ''),
      tags: (value['tags'] as string[]) ?? [],
      stack: (value['stack'] as string[]) ?? [],
      cover: String(value['cover'] ?? ''),
      gallery: (value['gallery'] as string[]) ?? [],
      models: (value['models'] as Project['models']) ?? [],
      videos: (value['videos'] as Project['videos']) ?? [],
      links: (value['links'] as Project['links']) ?? [],
      metrics: (value['metrics'] as Project['metrics']) ?? [],
      highlights: (value['highlights'] as string[]) ?? [],
      featured: value['featured'] === true,
      confidential: value['confidential'] === true,
      order: Number(value['order'] ?? 0),
      published: value['published'] === true,
    } satisfies Project;
  }, [spec.name, value]);

  const bodyHtml = useMemo(
    () => (project ? renderMarkdown(project.body) : ''),
    [project],
  );

  useEffect(() => {
    if (ref.current) wireProjectMedia(ref.current);
  });

  if (project) {
    return (
      <div ref={ref}>
        {!project.cover && (
          <p className="mono text-[0.75rem] text-accent-text mb-6">
            No cover image yet — the live page requires one before this can be saved.
          </p>
        )}
        <ProjectArticle project={project} bodyHtml={bodyHtml} />
      </div>
    );
  }

  // Non-project collections: reproduce the public rendering compactly.
  return (
    <div className="max-w-2xl">
      {spec.name === 'testimonials' ? (
        <figure className="border-l-2 border-accent pl-5 py-1">
          <blockquote className="text-[0.98rem] leading-relaxed">
            “{String(value['quote'] ?? '')}”
          </blockquote>
          <figcaption className="mono text-[0.75rem] text-muted mt-4">
            {String(value['author'] ?? '')} — {String(value['title'] ?? '')}
            {value['organisation'] ? `, ${String(value['organisation'])}` : ''}
          </figcaption>
        </figure>
      ) : (
        <div>
          <p className="mono text-[0.72rem] text-muted uppercase tracking-widest mono-nums">
            {String(value['startDate'] ?? value['issueDate'] ?? '')}
            {value['endDate'] ? ` — ${String(value['endDate'])}` : ''}
          </p>
          <h3 className="font-semibold text-[1.05rem] mt-1.5">
            {String(value[spec.titleKey] ?? '')}
            {spec.subtitleKey && value[spec.subtitleKey]
              ? ` — ${String(value[spec.subtitleKey])}`
              : ''}
          </h3>
          {typeof value['description'] === 'string' && value['description'] && (
            <p className="text-muted text-[0.95rem] mt-2">{value['description']}</p>
          )}
          {Array.isArray(value['highlights']) && (value['highlights'] as string[]).length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {(value['highlights'] as string[]).map((h) => (
                <li key={h} className="flex gap-3 text-[0.95rem]">
                  <span className="text-accent-text mono select-none" aria-hidden="true">
                    —
                  </span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          )}
          {Array.isArray(value['skills']) && (value['skills'] as string[]).length > 0 && (
            <ul className="flex flex-wrap gap-1.5 mt-3">
              {(value['skills'] as string[]).map((s) => (
                <li key={s} className="mono text-[0.72rem] text-muted border hairline rounded px-2 py-0.5">
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
