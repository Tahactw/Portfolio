/**
 * One Markdown pipeline for the whole system: the build (case studies,
 * bios) and the admin's live preview both call renderMarkdown, so what the
 * author previews is what the site ships.
 *
 * Raw HTML inside Markdown is escaped, not passed through — the rendered
 * output can contain only elements Markdown itself produces, so authored
 * content can never inject script.
 */
import { Marked } from 'marked';

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const marked = new Marked({ gfm: true, breaks: false });

marked.use({
  renderer: {
    html({ text }: { text: string }) {
      return escapeHtml(text);
    },
  },
});

export function renderMarkdown(md: string): string {
  if (!md) return '';
  return marked.parse(md, { async: false });
}
