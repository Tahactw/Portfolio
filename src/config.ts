/**
 * The only configuration in the codebase, and the owner should never need
 * to touch it: when the site builds in GitHub Actions, the repository
 * owner/name are taken from the PUBLIC_GH_REPO environment variable that
 * the workflow sets automatically. These values are only the fallback for
 * local development.
 */
const fromEnv = (import.meta.env.PUBLIC_GH_REPO as string | undefined) ?? '';

const [envOwner, envRepo] = fromEnv.includes('/') ? fromEnv.split('/') : ['', ''];

export const REPO_OWNER = envOwner || 'Tahactw';
export const REPO_NAME = envRepo || 'Portfolio';

/** Branch the admin panel reads from and commits to. */
export const REPO_BRANCH = 'main';
