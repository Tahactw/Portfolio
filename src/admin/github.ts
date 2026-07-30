/**
 * GitHub Contents API client for the admin panel.
 *
 * Invariants that matter:
 * - The token goes ONLY into the Authorization header of requests to
 *   https://api.github.com — never into URLs, logs, or error messages.
 * - Binary files are base64-encoded via FileReader (never btoa on a string,
 *   which corrupts anything non-ASCII).
 * - Text (JSON) is UTF-8 encoded before base64, and decoded the same way.
 */

const API = 'https://api.github.com';

export interface RepoRef {
  owner: string;
  repo: string;
  branch: string;
}

export class GitHubError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

export interface FileResult {
  text: string;
  sha: string;
}

export interface TreeEntry {
  path: string;
  size: number;
  sha: string;
}

/* ---------------------------------------------------------- encoding */

export function utf8ToBase64(s: string): string {
  const bytes = new TextEncoder().encode(s);
  let bin = '';
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    bin += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return btoa(bin);
}

export function base64ToUtf8(b64: string): string {
  const bin = atob(b64.replace(/\s/g, ''));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

/** Binary-safe base64 for uploads: FileReader gives us clean base64 directly. */
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onerror = () => reject(new Error('Could not read the file.'));
    r.onload = () => {
      const url = r.result as string; // data:<mime>;base64,<data>
      resolve(url.slice(url.indexOf(',') + 1));
    };
    r.readAsDataURL(blob);
  });
}

/* ------------------------------------------------------------ client */

export class GitHubClient {
  constructor(
    private token: string,
    public ref: RepoRef,
  ) {}

  private headers(): HeadersInit {
    return {
      Authorization: `Bearer ${this.token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    };
  }

  private async request(path: string, init?: RequestInit): Promise<Response> {
    return fetch(`${API}${path}`, { ...init, headers: { ...this.headers(), ...init?.headers } });
  }

  /**
   * Validates the token against the repo and confirms write access.
   * Returns null when everything is fine, otherwise a message written for
   * the owner, matched to what actually went wrong.
   */
  async validate(): Promise<string | null> {
    const { owner, repo } = this.ref;
    let res: Response;
    try {
      res = await this.request(`/repos/${owner}/${repo}`);
    } catch {
      return 'Could not reach GitHub. Check your internet connection and try again.';
    }
    if (res.status === 401) {
      return 'GitHub did not accept that token. It may be mistyped or expired — check SETUP.md for how to create a fresh one.';
    }
    if (res.status === 403) {
      return 'GitHub refused the request. The token may be blocked or rate-limited — wait a minute and try again, or create a new token following SETUP.md.';
    }
    if (res.status === 404) {
      return `The token cannot see the ${owner}/${repo} repository. When creating it, under "Repository access" you must pick "Only select repositories" and choose ${repo}. See SETUP.md, step 5.`;
    }
    if (!res.ok) {
      return `GitHub returned an unexpected error (${res.status}). Try again in a minute.`;
    }
    const data = (await res.json()) as { permissions?: { push?: boolean } };
    if (!data.permissions?.push) {
      return 'This token can read the repository but not write to it. When creating it, set "Contents" permission to "Read and write". See SETUP.md, step 6.';
    }
    return null;
  }

  /** Reads a file from the branch. Returns null when it does not exist. */
  async getFile(path: string): Promise<FileResult | null> {
    const { owner, repo, branch } = this.ref;
    const res = await this.request(
      `/repos/${owner}/${repo}/contents/${encodePath(path)}?ref=${encodeURIComponent(branch)}`,
    );
    if (res.status === 404) return null;
    if (!res.ok) throw new GitHubError(await friendly(res, 'reading', path), res.status);
    const data = (await res.json()) as { content?: string; sha: string; encoding?: string };
    return { text: data.content ? base64ToUtf8(data.content) : '', sha: data.sha };
  }

  /** Latest commit touching a path — used for "last edited" on the dashboard. */
  async lastCommitDate(path: string): Promise<string | null> {
    const { owner, repo, branch } = this.ref;
    const res = await this.request(
      `/repos/${owner}/${repo}/commits?path=${encodeURIComponent(path)}&sha=${encodeURIComponent(branch)}&per_page=1`,
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { commit?: { committer?: { date?: string } } }[];
    return data[0]?.commit?.committer?.date ?? null;
  }

  /**
   * Writes a file. `sha` must be the current blob sha when updating an
   * existing file. Throws GitHubError with status 409 on a conflict so the
   * caller can offer a reload-and-retry.
   */
  async putFile(
    path: string,
    contentBase64: string,
    message: string,
    sha?: string,
  ): Promise<{ sha: string }> {
    const { owner, repo, branch } = this.ref;
    const res = await this.request(`/repos/${owner}/${repo}/contents/${encodePath(path)}`, {
      method: 'PUT',
      body: JSON.stringify({ message, content: contentBase64, branch, ...(sha ? { sha } : {}) }),
    });
    if (res.status === 409 || res.status === 422) {
      // 422 with sha mismatch text is how the API reports some conflicts
      const body = await res.text();
      if (res.status === 409 || /sha/i.test(body)) {
        throw new GitHubError(
          'This file changed on GitHub after you loaded it (another tab or device?).',
          409,
        );
      }
      throw new GitHubError(`GitHub rejected the save (${res.status}).`, res.status);
    }
    if (!res.ok) throw new GitHubError(await friendly(res, 'saving', path), res.status);
    const data = (await res.json()) as { content: { sha: string } };
    return { sha: data.content.sha };
  }

  async deleteFile(path: string, sha: string, message: string): Promise<void> {
    const { owner, repo, branch } = this.ref;
    const res = await this.request(`/repos/${owner}/${repo}/contents/${encodePath(path)}`, {
      method: 'DELETE',
      body: JSON.stringify({ message, sha, branch }),
    });
    if (!res.ok) throw new GitHubError(await friendly(res, 'deleting', path), res.status);
  }

  /** Full recursive tree of the branch, filtered to a prefix. */
  async listTree(prefix: string): Promise<TreeEntry[]> {
    const { owner, repo, branch } = this.ref;
    const res = await this.request(
      `/repos/${owner}/${repo}/git/trees/${encodeURIComponent(branch)}?recursive=1`,
    );
    if (!res.ok) throw new GitHubError(await friendly(res, 'listing files in', prefix), res.status);
    const data = (await res.json()) as {
      tree: { path: string; type: string; size?: number; sha: string }[];
    };
    return data.tree
      .filter((t) => t.type === 'blob' && t.path.startsWith(prefix))
      .map((t) => ({ path: t.path, size: t.size ?? 0, sha: t.sha }));
  }

  /** Public raw URL for displaying repo files (repo is public — Pages needs that). */
  rawUrl(path: string): string {
    const { owner, repo, branch } = this.ref;
    return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
  }

  actionsUrl(): string {
    const { owner, repo } = this.ref;
    return `https://github.com/${owner}/${repo}/actions`;
  }
}

function encodePath(path: string): string {
  return path.split('/').map(encodeURIComponent).join('/');
}

async function friendly(res: Response, verb: string, path: string): Promise<string> {
  const name = path.split('/').pop();
  if (res.status === 401) return `GitHub signed you out (token expired?). Sign in again with a fresh token.`;
  if (res.status === 403) return `GitHub refused while ${verb} ${name} — you may be rate-limited. Wait a minute and retry.`;
  if (res.status === 404) return `${name} was not found in the repository.`;
  return `GitHub returned error ${res.status} while ${verb} ${name}. Try again in a minute.`;
}
