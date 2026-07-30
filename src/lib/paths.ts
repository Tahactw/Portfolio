/**
 * Media references are stored base-relative in the content files
 * ("/media/projects/x.webp") so the same JSON works whether the site is
 * served from / or /RepoName/. Everything that renders a MediaRef goes
 * through withBase().
 */
export function withBase(p: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  if (!p) return p;
  return `${base}${p.startsWith('/') ? p : `/${p}`}`;
}

/** YYYY-MM-DD -> "Mar 2026". Bad input comes back unchanged. */
export function formatDate(iso: string | undefined): string {
  if (!iso) return '';
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' });
}

/** Date span in the drawing-annotation voice: "Mar 2025 — present". */
export function dateSpan(start: string, end?: string): string {
  return `${formatDate(start)} — ${end ? formatDate(end) : 'present'}`;
}
