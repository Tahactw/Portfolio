/**
 * Editor definitions. Every form in the admin panel is generated from these
 * specs, which mirror src/lib/types.ts field for field — add a field there,
 * describe it here, and the editor, validation and preview all follow.
 */
import type { CollectionName } from '../lib/types';

export type FieldType =
  | 'text'
  | 'textarea'
  | 'markdown'
  | 'date'
  | 'tags'
  | 'stringlist'
  | 'boolean'
  | 'select'
  | 'number'
  | 'media'
  | 'medialist'
  | 'repeat';

export type MediaKind = 'image' | 'model' | 'doc';

export interface FieldSpec {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  /** Plain-language error when required and missing. */
  requiredMessage?: string;
  help?: string;
  placeholder?: string;
  maxLength?: number;
  options?: { value: string; label: string }[];
  mediaKind?: MediaKind;
  /** Subfolder of public/media/ that uploads land in. */
  mediaDir?: string;
  /** Sub-fields for repeat groups. */
  fields?: FieldSpec[];
  /** Noun for one entry of a repeat/list: "link", "metric". */
  itemNoun?: string;
  /** Autocomplete pool: collect existing values of this key across items. */
  suggestFrom?: string;
}

export interface CollectionSpec {
  name: CollectionName;
  /** Repo path of the JSON file. */
  file: string;
  label: string;
  itemNoun: string;
  titleKey: string;
  subtitleKey?: string;
  /** Items carry a manual `order` field, maintained by list reordering. */
  orderable?: boolean;
  /** Items have `published` and can be drafted. */
  publishable?: boolean;
  fields: FieldSpec[];
  newItem: () => Record<string, unknown>;
}

const CONTENT_DIR = 'src/content';

export const PROJECT_STATUS_OPTIONS = [
  { value: 'completed', label: 'Completed' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'planned', label: 'Planned' },
  { value: 'archived', label: 'Archived' },
];

export const collections: CollectionSpec[] = [
  {
    name: 'projects',
    file: `${CONTENT_DIR}/projects.json`,
    label: 'Projects',
    itemNoun: 'project',
    titleKey: 'title',
    subtitleKey: 'tagline',
    orderable: true,
    publishable: true,
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true, requiredMessage: 'Give the project a title — it names the page.' },
      { key: 'tagline', label: 'Tagline', type: 'text', required: true, maxLength: 90, requiredMessage: 'Add a one-line tagline — it shows on the project card.', help: 'One line, under 90 characters. Shows on the card.' },
      { key: 'summary', label: 'Summary', type: 'textarea', required: true, requiredMessage: 'Write 2–3 sentences — this is what search engines and list views show.' },
      { key: 'body', label: 'Case study', type: 'markdown', required: true, requiredMessage: 'Write the case study — the problem, the approach, what broke, what was measured.', help: 'Markdown. Headings with ##, lists with -, bold with **text**.' },
      { key: 'role', label: 'Your role', type: 'text', required: true, requiredMessage: 'Say what you did — e.g. "Lead — mechanical design & firmware".', placeholder: 'Lead — mechanical design & firmware' },
      { key: 'teamSize', label: 'Team size', type: 'number', help: 'Leave empty for solo work.' },
      { key: 'startDate', label: 'Start date', type: 'date', required: true, requiredMessage: 'Pick a start date — projects are sorted by it.' },
      { key: 'endDate', label: 'End date', type: 'date', help: 'Leave empty while the project is ongoing.' },
      { key: 'status', label: 'Status', type: 'select', required: true, options: PROJECT_STATUS_OPTIONS },
      { key: 'category', label: 'Category', type: 'select', required: true, options: [], requiredMessage: 'Pick a category — the project grid filters by it.' },
      { key: 'tags', label: 'Tags', type: 'tags', suggestFrom: 'tags', help: 'Free-form. These drive the filters on the projects page.' },
      { key: 'stack', label: 'Tools & stack', type: 'tags', suggestFrom: 'stack', help: 'e.g. SolidWorks, STM32, ROS 2, Python' },
      { key: 'cover', label: 'Cover image', type: 'media', mediaKind: 'image', mediaDir: 'projects', required: true, requiredMessage: "Add a cover image — it's what shows on the project card." },
      { key: 'gallery', label: 'Figures / gallery', type: 'medialist', mediaKind: 'image', mediaDir: 'projects', help: 'Photos, plots, drawings. They appear under the case study, in this order.' },
      {
        key: 'models', label: '3D models', type: 'repeat', itemNoun: '3D model',
        fields: [
          { key: 'src', label: 'GLB file', type: 'media', mediaKind: 'model', mediaDir: 'models', required: true, requiredMessage: 'Choose the .glb file for this model.' },
          { key: 'label', label: 'Label', type: 'text', required: true, requiredMessage: 'Name the model — e.g. "Gearbox assembly".' },
          { key: 'poster', label: 'Poster image', type: 'media', mediaKind: 'image', mediaDir: 'projects', help: 'Shown before the viewer loads.' },
        ],
      },
      {
        key: 'videos', label: 'Videos', type: 'repeat', itemNoun: 'video',
        fields: [
          { key: 'provider', label: 'Provider', type: 'select', required: true, options: [ { value: 'youtube', label: 'YouTube' }, { value: 'vimeo', label: 'Vimeo' } ] },
          { key: 'id', label: 'Video ID', type: 'text', required: true, requiredMessage: 'Paste the video ID — the part after v= in a YouTube URL.', help: 'For youtube.com/watch?v=abc123 the ID is abc123.' },
          { key: 'label', label: 'Label', type: 'text', required: true, requiredMessage: 'Name the video — e.g. "Full run, regional final".' },
        ],
      },
      {
        key: 'links', label: 'Links', type: 'repeat', itemNoun: 'link',
        fields: [
          { key: 'label', label: 'Label', type: 'text', required: true, requiredMessage: 'Name the link — e.g. "Firmware repository".' },
          { key: 'url', label: 'URL', type: 'text', required: true, requiredMessage: 'Paste the full address, starting with https://' },
          { key: 'kind', label: 'Type', type: 'select', required: true, options: [ { value: 'repo', label: 'Code' }, { value: 'demo', label: 'Demo' }, { value: 'paper', label: 'Paper' }, { value: 'other', label: 'Other' } ] },
        ],
      },
      {
        key: 'metrics', label: 'Metrics', type: 'repeat', itemNoun: 'metric',
        fields: [
          { key: 'label', label: 'Label', type: 'text', required: true, requiredMessage: 'Name the measurement — e.g. "Payload".', placeholder: 'Payload' },
          { key: 'value', label: 'Value', type: 'text', required: true, requiredMessage: 'Give the measured value — e.g. "4.2 kg".', placeholder: '4.2 kg' },
        ],
        help: 'The measured numbers. They get a table of their own at the top of the page.',
      },
      { key: 'highlights', label: 'Highlights', type: 'stringlist', itemNoun: 'highlight', help: '3–5 bullets. This is what a recruiter reads in 20 seconds.' },
      { key: 'featured', label: 'Featured on the home page', type: 'boolean' },
      { key: 'confidential', label: 'Confidential (NDA)', type: 'boolean', help: 'Shows a "Details under NDA" notice and hides all links.' },
    ],
    newItem: () => ({
      id: '', title: '', tagline: '', summary: '', body: '', role: '',
      startDate: new Date().toISOString().slice(0, 10), status: 'in-progress',
      category: '', tags: [], stack: [], cover: '', gallery: [], models: [],
      videos: [], links: [], metrics: [], highlights: [], featured: false,
      confidential: false, order: 0, published: false,
    }),
  },
  {
    name: 'certificates',
    file: `${CONTENT_DIR}/certificates.json`,
    label: 'Certificates',
    itemNoun: 'certificate',
    titleKey: 'title',
    subtitleKey: 'issuer',
    publishable: true,
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true, requiredMessage: 'Name the certificate as it appears on the document.' },
      { key: 'issuer', label: 'Issuer', type: 'text', required: true, requiredMessage: 'Who issued it? Certificates are grouped by issuer.', suggestFrom: 'issuer' },
      { key: 'issueDate', label: 'Issue date', type: 'date', required: true, requiredMessage: 'When was it issued? Certificates sort by this.' },
      { key: 'expiryDate', label: 'Expiry date', type: 'date', help: 'Leave empty if it does not expire.' },
      { key: 'credentialId', label: 'Credential ID', type: 'text', help: 'The verification code, if the issuer provides one.' },
      { key: 'image', label: 'Certificate image', type: 'media', mediaKind: 'image', mediaDir: 'certificates', required: true, requiredMessage: 'Add a photo or scan of the certificate itself.' },
      { key: 'skills', label: 'Skills it covers', type: 'tags', suggestFrom: 'skills', help: 'Used for the skill filter on the certificates page.' },
      { key: 'featured', label: 'Featured on the home page', type: 'boolean' },
    ],
    newItem: () => ({
      id: '', title: '', issuer: '', issueDate: new Date().toISOString().slice(0, 10),
      image: '', skills: [], featured: false, published: false,
    }),
  },
  {
    name: 'experience',
    file: `${CONTENT_DIR}/experience.json`,
    label: 'Experience',
    itemNoun: 'experience entry',
    titleKey: 'role',
    subtitleKey: 'organisation',
    publishable: true,
    fields: [
      { key: 'role', label: 'Role', type: 'text', required: true, requiredMessage: 'What was the role called?' },
      { key: 'organisation', label: 'Organisation', type: 'text', required: true, requiredMessage: 'Where was it?' },
      { key: 'location', label: 'Location', type: 'text' },
      { key: 'startDate', label: 'Start date', type: 'date', required: true, requiredMessage: 'When did it start?' },
      { key: 'endDate', label: 'End date', type: 'date', help: 'Leave empty if you are still there.' },
      { key: 'description', label: 'Description', type: 'textarea', required: true, requiredMessage: 'One or two sentences on what the work was.' },
      { key: 'highlights', label: 'Highlights', type: 'stringlist', itemNoun: 'highlight', help: 'Concrete things you did or changed, one per line.' },
    ],
    newItem: () => ({
      id: '', role: '', organisation: '', startDate: new Date().toISOString().slice(0, 10),
      description: '', highlights: [], published: false,
    }),
  },
  {
    name: 'education',
    file: `${CONTENT_DIR}/education.json`,
    label: 'Education',
    itemNoun: 'education entry',
    titleKey: 'qualification',
    subtitleKey: 'institution',
    publishable: true,
    fields: [
      { key: 'qualification', label: 'Qualification', type: 'text', required: true, requiredMessage: 'e.g. "B.Sc. Mechatronics Engineering".' },
      { key: 'institution', label: 'Institution', type: 'text', required: true, requiredMessage: 'Which school or university?' },
      { key: 'location', label: 'Location', type: 'text' },
      { key: 'startDate', label: 'Start date', type: 'date', required: true, requiredMessage: 'When did it start?' },
      { key: 'endDate', label: 'End date', type: 'date', help: 'Leave empty until you graduate.' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'coursework', label: 'Key coursework', type: 'stringlist', itemNoun: 'course' },
    ],
    newItem: () => ({
      id: '', qualification: '', institution: '', startDate: new Date().toISOString().slice(0, 10),
      coursework: [], published: false,
    }),
  },
  {
    name: 'skills',
    file: `${CONTENT_DIR}/skills.json`,
    label: 'Skills',
    itemNoun: 'skill group',
    titleKey: 'label',
    orderable: true,
    fields: [
      { key: 'label', label: 'Group name', type: 'text', required: true, requiredMessage: 'Name the group — e.g. "Mechanical design".' },
      { key: 'skills', label: 'Skills', type: 'tags', help: 'Plain tags. They are shown exactly as written — no bars, no percentages.' },
    ],
    newItem: () => ({ id: '', label: '', skills: [], order: 0 }),
  },
  {
    name: 'testimonials',
    file: `${CONTENT_DIR}/testimonials.json`,
    label: 'Testimonials',
    itemNoun: 'testimonial',
    titleKey: 'author',
    subtitleKey: 'title',
    publishable: true,
    fields: [
      { key: 'quote', label: 'Quote', type: 'textarea', required: true, requiredMessage: 'The quote itself, in their words.' },
      { key: 'author', label: 'Who said it', type: 'text', required: true, requiredMessage: 'Their name.' },
      { key: 'title', label: 'Their title', type: 'text', required: true, requiredMessage: 'Their role — e.g. "Capstone supervisor".' },
      { key: 'organisation', label: 'Organisation', type: 'text' },
      { key: 'link', label: 'Link', type: 'text', help: 'Optional — their LinkedIn or website.' },
    ],
    newItem: () => ({ id: '', quote: '', author: '', title: '', published: false }),
  },
];

export const PROFILE_FILE = `${CONTENT_DIR}/profile.json`;

export const profileFields: FieldSpec[] = [
  { key: 'name', label: 'Name', type: 'text', required: true, requiredMessage: 'Your name appears in the header, footer and page titles.' },
  { key: 'headline', label: 'Headline', type: 'text', required: true, requiredMessage: 'One line under your name — e.g. "Mechatronics engineer — robotics, control, embedded".' },
  { key: 'location', label: 'Location', type: 'text', required: true, requiredMessage: 'City and country.' },
  { key: 'availability', label: 'Availability', type: 'text', required: true, requiredMessage: 'e.g. "Open to remote and relocation · graduating 2027".' },
  { key: 'shortBio', label: 'Short bio', type: 'textarea', required: true, requiredMessage: 'Two sentences for the home page hero.' },
  { key: 'longBio', label: 'Long bio', type: 'markdown', required: true, requiredMessage: 'The About page text. Markdown works here.' },
  { key: 'photo', label: 'Photo', type: 'media', mediaKind: 'image', mediaDir: 'profile', help: 'Optional. Shown on the About page.' },
  { key: 'resumeFile', label: 'Résumé (PDF)', type: 'media', mediaKind: 'doc', mediaDir: 'profile', help: 'Optional. Adds a download button to the home and About pages.' },
  { key: 'email', label: 'Email', type: 'text', required: true, requiredMessage: 'Where contact messages should go.' },
  { key: 'categories', label: 'Project categories', type: 'tags', help: 'The category list projects choose from.' },
  { key: 'formspreeEndpoint', label: 'Formspree endpoint', type: 'text', help: 'Optional. Paste your form URL from formspree.io to enable the contact form; leave empty to show an email button instead.' },
];

/* ------------------------------------------------------------ validation */

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

export function uniqueSlug(base: string, taken: Set<string>): string {
  let s = base || 'item';
  let n = 2;
  while (taken.has(s)) s = `${base}-${n++}`;
  return s;
}

export type FieldErrors = Record<string, string>;

export function validateItem(
  spec: { fields: FieldSpec[] },
  item: Record<string, unknown>,
  otherIds: Set<string>,
): FieldErrors {
  const errors: FieldErrors = {};

  const id = item['id'];
  if (typeof id !== 'string' || !SLUG_RE.test(id)) {
    errors['id'] = 'The URL slug can only contain lowercase letters, numbers and hyphens.';
  } else if (otherIds.has(id)) {
    errors['id'] = `Another item already uses the slug "${id}" — change one of them.`;
  }

  for (const f of spec.fields) {
    const v = item[f.key];
    const empty =
      v === undefined ||
      v === null ||
      v === '' ||
      (Array.isArray(v) && v.length === 0 && f.required);
    if (f.required && empty) {
      errors[f.key] = f.requiredMessage ?? `${f.label} is required.`;
      continue;
    }
    if (f.maxLength && typeof v === 'string' && v.length > f.maxLength) {
      errors[f.key] = `${f.label} is ${v.length} characters — keep it under ${f.maxLength}.`;
    }
    if (f.type === 'date' && typeof v === 'string' && v && !/^\d{4}-\d{2}-\d{2}$/.test(v)) {
      errors[f.key] = 'Use the date picker — the date must look like 2026-03-14.';
    }
    if (f.key === 'url' || (f.type === 'text' && typeof v === 'string' && f.key.toLowerCase().includes('endpoint') && v)) {
      if (typeof v === 'string' && v && !/^https?:\/\//.test(v)) {
        errors[f.key] = 'The address must start with https://';
      }
    }
    if (f.type === 'repeat' && Array.isArray(v) && f.fields) {
      v.forEach((entry, i) => {
        for (const sub of f.fields!) {
          const sv = (entry as Record<string, unknown>)[sub.key];
          if (sub.required && (sv === undefined || sv === null || sv === '')) {
            errors[`${f.key}.${i}.${sub.key}`] =
              sub.requiredMessage ?? `${sub.label} is required.`;
          }
          if (sub.key === 'url' && typeof sv === 'string' && sv && !/^https?:\/\//.test(sv)) {
            errors[`${f.key}.${i}.${sub.key}`] = 'The address must start with https://';
          }
        }
      });
    }
  }

  // date sanity across fields
  const s = item['startDate'];
  const e = item['endDate'];
  if (typeof s === 'string' && typeof e === 'string' && s && e && e < s) {
    errors['endDate'] = 'The end date is before the start date — swap them.';
  }
  const iss = item['issueDate'];
  const exp = item['expiryDate'];
  if (typeof iss === 'string' && typeof exp === 'string' && iss && exp && exp < iss) {
    errors['expiryDate'] = 'The expiry date is before the issue date — check both.';
  }

  return errors;
}
