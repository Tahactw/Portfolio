/**
 * Build-time content access. The JSON files in src/content are imported
 * here (so they are part of the build graph — a change rebuilds the site),
 * validated once, and exposed through accessors that already apply the
 * rules every page needs: published-only, sorted, featured-first.
 *
 * The admin panel never touches this module; it reads and writes the same
 * files through the GitHub API, which triggers the rebuild that re-runs this.
 */
import certificatesRaw from '../content/certificates.json';
import educationRaw from '../content/education.json';
import experienceRaw from '../content/experience.json';
import profileRaw from '../content/profile.json';
import projectsRaw from '../content/projects.json';
import skillsRaw from '../content/skills.json';
import testimonialsRaw from '../content/testimonials.json';
import type {
  Certificate,
  EducationItem,
  ExperienceItem,
  Profile,
  Project,
  SkillGroup,
  Testimonial,
} from './types';
import {
  validateCertificates,
  validateEducation,
  validateExperience,
  validateProfile,
  validateProjects,
  validateSkills,
  validateTestimonials,
} from './validate';

export const profile: Profile = validateProfile(profileRaw);

const allProjects: Project[] = validateProjects(projectsRaw);
const allCertificates: Certificate[] = validateCertificates(certificatesRaw);
const allExperience: ExperienceItem[] = validateExperience(experienceRaw);
const allEducation: EducationItem[] = validateEducation(educationRaw);
const allSkills: SkillGroup[] = validateSkills(skillsRaw);
const allTestimonials: Testimonial[] = validateTestimonials(testimonialsRaw);

/* Manual order first; ties broken by startDate, newest first. */
function byOrderThenDate(a: Project, b: Project): number {
  if (a.order !== b.order) return a.order - b.order;
  return (b.startDate ?? '').localeCompare(a.startDate ?? '');
}

function byStartDesc(a: { startDate: string }, b: { startDate: string }): number {
  return b.startDate.localeCompare(a.startDate);
}

export const projects: Project[] = allProjects.filter((p) => p.published).sort(byOrderThenDate);

export const featuredProjects: Project[] = projects.filter((p) => p.featured);

export function projectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

export const certificates: Certificate[] = allCertificates
  .filter((c) => c.published)
  .sort((a, b) => b.issueDate.localeCompare(a.issueDate));

export const featuredCertificates: Certificate[] = certificates.filter((c) => c.featured);

export const experience: ExperienceItem[] = allExperience
  .filter((e) => e.published)
  .sort(byStartDesc);

export const education: EducationItem[] = allEducation.filter((e) => e.published).sort(byStartDesc);

export const skillGroups: SkillGroup[] = [...allSkills].sort((a, b) => a.order - b.order);

export const testimonials: Testimonial[] = allTestimonials.filter((t) => t.published);

/** Every tag in use across published projects, for the filter facets. */
export const allProjectTags: string[] = [...new Set(projects.flatMap((p) => p.tags))].sort();

/** Categories that actually contain published projects. */
export const activeCategories: string[] = profile.categories.filter((c) =>
  projects.some((p) => p.category === c),
);

/** Every skill referenced by published certificates, for the filter chips. */
export const certificateSkills: string[] = [...new Set(certificates.flatMap((c) => c.skills))].sort();
