import { useState } from 'react';
import { GitHubClient } from './github';
import { REPO_BRANCH, REPO_NAME, REPO_OWNER } from '../config';

export default function Login({
  onSignedIn,
}: {
  onSignedIn: (token: string, remember: boolean) => void;
}) {
  const [token, setToken] = useState('');
  const [remember, setRemember] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    const t = token.trim();
    if (!t) {
      setError('Paste your access token first — SETUP.md explains how to create one.');
      return;
    }
    setBusy(true);
    setError(null);
    const client = new GitHubClient(t, {
      owner: REPO_OWNER,
      repo: REPO_NAME,
      branch: REPO_BRANCH,
    });
    const problem = await client.validate();
    setBusy(false);
    if (problem) {
      setError(problem);
      return;
    }
    onSignedIn(t, remember);
  }

  return (
    <div className="min-h-screen bg-ink text-text flex items-center justify-center p-5">
      <div className="w-full max-w-md">
        <p className="eyebrow">Portfolio admin</p>
        <h1 className="h2 mt-2">Sign in</h1>
        <p className="text-muted text-[0.95rem] mt-3">
          Paste your GitHub access token. It stays on this device and is only ever sent to
          GitHub itself — nowhere else.
        </p>

        <form onSubmit={submit} className="mt-8 space-y-5" noValidate>
          <div>
            <label htmlFor="token" className="mono text-[0.8rem] block mb-2">
              Access token
            </label>
            <input
              id="token"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              autoComplete="off"
              spellCheck={false}
              className="w-full bg-panel border border-line-strong rounded px-3.5 py-3 text-text mono text-[0.85rem]"
              aria-describedby={error ? 'token-error' : 'token-help'}
              aria-invalid={error ? true : undefined}
            />
            <p id="token-help" className="mono text-[0.72rem] text-muted mt-2">
              It starts with github_pat_ — see SETUP.md in the repository if you need to make
              one.
            </p>
            {error && (
              <p
                id="token-error"
                role="alert"
                className="text-[0.85rem] text-accent-text border border-accent rounded p-3 mt-3"
              >
                {error}
              </p>
            )}
          </div>

          <label className="flex items-start gap-3 cursor-pointer min-h-[44px]">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="mt-1 w-4 h-4 accent-[var(--c-accent)]"
            />
            <span className="text-[0.9rem]">
              Stay signed in on this device
              <span className="block text-muted text-[0.8rem] mt-0.5">
                Only tick this on your own computer or phone.
              </span>
            </span>
          </label>

          <button
            type="submit"
            disabled={busy}
            className="mono text-[0.85rem] bg-accent text-accent-ink rounded px-6 py-3 min-h-[44px] w-full sm:w-auto disabled:opacity-60 hover:opacity-90 transition-opacity"
          >
            {busy ? 'Checking with GitHub…' : 'Sign in'}
          </button>
        </form>

        <p className="mono text-[0.72rem] text-muted mt-10 leading-relaxed">
          Editing {REPO_OWNER}/{REPO_NAME} on branch {REPO_BRANCH}.
        </p>
      </div>
    </div>
  );
}
