/**
 * Build-time validation for the content JSON. Deliberately hand-rolled and
 * dependency-free: it runs only at build (and in the admin before save),
 * and a failure message must name the collection, the item and the field
 * in plain language.
 */
import type {
  Certificate,
  EducationItem,
  ExperienceItem,
  Profile,
  Project,
  SkillGroup,
  Testimonial,
} from './types';

export class ContentError extends Error {}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function fail(where: string, msg: string): never {
  throw new ContentError(`${where}: ${msg}`);
}

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function str(o: Record<string, unknown>, key: string, where: string, required = true): string {
  const v = o[key];
  if (v === undefined || v === null || v === '') {
    if (required) fail(where, `"${key}" is required`);
    return '';
  }
  if (typeof v !== 'string') fail(where, `"${key}" must be text`);
  return v;
}

function bool(o: Record<string, unknown>, key: string, where: string): boolean {
  const v = o[key];
  if (typeof v !== 'boolean') fail(where, `"${key}" must be true or false`);
  return v;
}

function num(o: Record<string, unknown>, key: string, where: string, required = true): number {
  const v = o[key];
  if (v === undefined || v === null) {
    if (required) fail(where, `"${key}" is required`);
    return 0;
  }
  if (typeof v !== 'number' || Number.isNaN(v)) fail(where, `"${key}" must be a number`);
  return v;
}

function strArr(o: Record<string, unknown>, key: string, where: string): string[] {
  const v = o[key];
  if (v === undefined) fail(where, `"${key}" is missing (use [] when empty)`);
  if (!Array.isArray(v) || v.some((x) => typeof x !== 'string'))
    fail(where, `"${key}" must be a list of text values`);
  return v as string[];
}

function date(o: Record<string, unknown>, key: string, where: string, required = true): void {
  const v = o[key];
  if (v === undefined || v === null || v === '') {
    if (required) fail(where, `"${key}" is required`);
    return;
  }
  if (typeof v !== 'string' || !ISO_DATE.test(v))
    fail(where, `"${key}" must be a date like 2026-03-14 (got ${JSON.stringify(v)})`);
}

function dateOrder(o: Record<string, unknown>, where: string): void {
  const s = o['startDate'];
  const e = o['endDate'];
  if (typeof s === 'string' && typeof e === 'string' && e !== '' && e < s)
    fail(where, `end date (${e}) is before start date (${s})`);
}

function slug(o: Record<string, unknown>, where: string): string {
  const id = str(o, 'id', where);
  if (!SLUG.test(id))
    fail(where, `"id" must be lowercase letters, numbers and hyphens (got "${id}")`);
  return id;
}

function uniqueIds(items: { id: string }[], where: string): void {
  const seen = new Set<string>();
  for (const it of items) {
    if (seen.has(it.id)) fail(where, `two items share the id "${it.id}" — ids must be unique`);
    seen.add(it.id);
  }
}

function asArray(data: unknown, where: string): Record<string, unknown>[] {
  if (!Array.isArray(data)) fail(where, 'file must contain a list of items');
  return data.map((d, i) => {
    if (!isObj(d)) fail(where, `item ${i + 1} is not an object`);
    return d;
  });
}

/* ------------------------------------------------------------ collections */

export function validateProjects(data: unknown): Project[] {
  const items = asArray(data, 'projects.json');
  for (const o of items) {
    const where = `projects.json › "${o['title'] ?? o['id'] ?? '?'}"`;
    slug(o, where);
    str(o, 'title', where);
    str(o, 'tagline', where);
    str(o, 'summary', where);
    str(o, 'body', where);
    str(o, 'role', where);
    date(o, 'startDate', where);
    date(o, 'endDate', where, false);
    dateOrder(o, where);
    const status = str(o, 'status', where);
    if (!['completed', 'in-progress', 'planned', 'archived'].includes(status))
      fail(where, `"status" must be completed, in-progress, planned or archived`);
    str(o, 'category', where);
    strArr(o, 'tags', where);
    strArr(o, 'stack', where);
    str(o, 'cover', where);
    strArr(o, 'gallery', where);
    strArr(o, 'highlights', where);
    bool(o, 'featured', where);
    bool(o, 'confidential', where);
    bool(o, 'published', where);
    num(o, 'order', where);
    for (const k of ['models', 'videos', 'links', 'metrics'] as const) {
      if (!Array.isArray(o[k])) fail(where, `"${k}" must be a list (use [] when empty)`);
    }
    for (const m of o['models'] as Record<string, unknown>[]) {
      str(m, 'src', `${where} › model`);
      str(m, 'label', `${where} › model`);
    }
    for (const v of o['videos'] as Record<string, unknown>[]) {
      const p = str(v, 'provider', `${where} › video`);
      if (p !== 'youtube' && p !== 'vimeo') fail(where, 'video provider must be youtube or vimeo');
      str(v, 'id', `${where} › video`);
      str(v, 'label', `${where} › video`);
    }
    for (const l of o['links'] as Record<string, unknown>[]) {
      str(l, 'label', `${where} › link`);
      const url = str(l, 'url', `${where} › link`);
      if (!/^https?:\/\//.test(url)) fail(where, `link "${url}" must start with http:// or https://`);
    }
    for (const m of o['metrics'] as Record<string, unknown>[]) {
      str(m, 'label', `${where} › metric`);
      str(m, 'value', `${where} › metric`);
    }
  }
  uniqueIds(items as unknown as { id: string }[], 'projects.json');
  return items as unknown as Project[];
}

export function validateCertificates(data: unknown): Certificate[] {
  const items = asArray(data, 'certificates.json');
  for (const o of items) {
    const where = `certificates.json › "${o['title'] ?? o['id'] ?? '?'}"`;
    slug(o, where);
    str(o, 'title', where);
    str(o, 'issuer', where);
    date(o, 'issueDate', where);
    date(o, 'expiryDate', where, false);
    str(o, 'image', where);
    strArr(o, 'skills', where);
    bool(o, 'featured', where);
    bool(o, 'published', where);
  }
  uniqueIds(items as unknown as { id: string }[], 'certificates.json');
  return items as unknown as Certificate[];
}

export function validateExperience(data: unknown): ExperienceItem[] {
  const items = asArray(data, 'experience.json');
  for (const o of items) {
    const where = `experience.json › "${o['role'] ?? o['id'] ?? '?'}"`;
    slug(o, where);
    str(o, 'role', where);
    str(o, 'organisation', where);
    date(o, 'startDate', where);
    date(o, 'endDate', where, false);
    dateOrder(o, where);
    str(o, 'description', where);
    strArr(o, 'highlights', where);
    bool(o, 'published', where);
  }
  uniqueIds(items as unknown as { id: string }[], 'experience.json');
  return items as unknown as ExperienceItem[];
}

export function validateEducation(data: unknown): EducationItem[] {
  const items = asArray(data, 'education.json');
  for (const o of items) {
    const where = `education.json › "${o['qualification'] ?? o['id'] ?? '?'}"`;
    slug(o, where);
    str(o, 'qualification', where);
    str(o, 'institution', where);
    date(o, 'startDate', where);
    date(o, 'endDate', where, false);
    dateOrder(o, where);
    strArr(o, 'coursework', where);
    bool(o, 'published', where);
  }
  uniqueIds(items as unknown as { id: string }[], 'education.json');
  return items as unknown as EducationItem[];
}

export function validateSkills(data: unknown): SkillGroup[] {
  const items = asArray(data, 'skills.json');
  for (const o of items) {
    const where = `skills.json › "${o['label'] ?? o['id'] ?? '?'}"`;
    slug(o, where);
    str(o, 'label', where);
    strArr(o, 'skills', where);
    num(o, 'order', where);
  }
  uniqueIds(items as unknown as { id: string }[], 'skills.json');
  return items as unknown as SkillGroup[];
}

export function validateTestimonials(data: unknown): Testimonial[] {
  const items = asArray(data, 'testimonials.json');
  for (const o of items) {
    const where = `testimonials.json › "${o['author'] ?? o['id'] ?? '?'}"`;
    slug(o, where);
    str(o, 'quote', where);
    str(o, 'author', where);
    str(o, 'title', where);
    bool(o, 'published', where);
  }
  uniqueIds(items as unknown as { id: string }[], 'testimonials.json');
  return items as unknown as Testimonial[];
}

export function validateProfile(data: unknown): Profile {
  if (!isObj(data)) fail('profile.json', 'file must contain a profile object');
  const where = 'profile.json';
  str(data, 'name', where);
  str(data, 'headline', where);
  str(data, 'location', where);
  str(data, 'availability', where);
  str(data, 'shortBio', where);
  str(data, 'longBio', where);
  const email = str(data, 'email', where);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail(where, `"${email}" is not a valid email`);
  if (!isObj(data['socials'])) fail(where, '"socials" must be an object');
  strArr(data, 'categories', where);
  return data as unknown as Profile;
}
