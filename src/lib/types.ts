/**
 * The content model. Every field the admin panel writes is declared here;
 * the admin editors are generated from field specs that mirror these shapes
 * (src/admin/schema.ts), and the build validates every JSON file against
 * them (src/lib/validate.ts) so a bad file fails the build, not the visitor.
 */

export type ISODate = string; // "2026-03-14"
export type MediaRef = string; // "/media/projects/arm-hero.webp" (base-relative)

export interface ProjectModel {
  src: MediaRef; // .glb
  label: string;
  poster?: MediaRef;
}

export interface ProjectVideo {
  provider: 'youtube' | 'vimeo';
  id: string;
  label: string;
}

export interface ProjectLink {
  label: string;
  url: string;
  kind: 'repo' | 'demo' | 'paper' | 'other';
}

export interface Metric {
  label: string;
  value: string;
}

export interface Project {
  id: string; // url-safe slug, unique
  title: string;
  tagline: string; // one line, card-level
  summary: string; // 2–3 sentences, list level
  body: string; // Markdown case study
  role: string;
  teamSize?: number;
  startDate: ISODate;
  endDate?: ISODate; // absent = ongoing
  status: 'completed' | 'in-progress' | 'planned' | 'archived';
  category: string; // from profile.categories
  tags: string[];
  stack: string[];
  cover: MediaRef;
  gallery: MediaRef[];
  models: ProjectModel[];
  videos: ProjectVideo[];
  links: ProjectLink[];
  metrics: Metric[];
  highlights: string[]; // the recruiter skim layer
  featured: boolean;
  confidential: boolean; // suppresses links, shows NDA notice
  order: number; // manual sort; ties broken by startDate desc
  published: boolean;
  sample?: boolean; // seed content flag — admin shows a banner, site ignores
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issueDate: ISODate;
  expiryDate?: ISODate;
  credentialId?: string;
  image: MediaRef;
  skills: string[];
  featured: boolean;
  published: boolean;
  sample?: boolean;
}

export interface ExperienceItem {
  id: string;
  role: string;
  organisation: string;
  location?: string;
  startDate: ISODate;
  endDate?: ISODate;
  description: string;
  highlights: string[];
  published: boolean;
  sample?: boolean;
}

export interface EducationItem {
  id: string;
  qualification: string;
  institution: string;
  location?: string;
  startDate: ISODate;
  endDate?: ISODate;
  description?: string;
  coursework: string[];
  published: boolean;
  sample?: boolean;
}

export interface SkillGroup {
  id: string;
  label: string;
  skills: string[]; // plain tags — never proficiency bars
  order: number;
  sample?: boolean;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  title: string;
  organisation?: string;
  link?: string;
  published: boolean;
  sample?: boolean;
}

export interface Profile {
  name: string;
  headline: string;
  location: string;
  availability: string;
  shortBio: string; // hero paragraph
  longBio: string; // Markdown, About page
  photo?: MediaRef;
  resumeFile?: MediaRef; // pdf
  email: string;
  socials: { github?: string; linkedin?: string; x?: string };
  categories: string[]; // project category vocabulary
  formspreeEndpoint?: string;
}

export type CollectionName =
  | 'projects'
  | 'certificates'
  | 'experience'
  | 'education'
  | 'skills'
  | 'testimonials';

export interface CollectionMap {
  projects: Project;
  certificates: Certificate;
  experience: ExperienceItem;
  education: EducationItem;
  skills: SkillGroup;
  testimonials: Testimonial;
}
