/**
 * Admin panel root. Handles the token gate, top-level navigation between
 * dashboard / collection / editor / profile / media views, and toasts.
 * Loaded only on /admin as its own chunk.
 */
import { useCallback, useEffect, useState } from 'react';
import { GitHubClient } from './github';
import { REPO_BRANCH, REPO_NAME, REPO_OWNER } from '../config';
import { StoreProvider } from './store';
import Login from './Login';
import Dashboard from './Dashboard';
import CollectionView from './CollectionView';
import ItemEditor from './ItemEditor';
import ProfileEditor from './ProfileEditor';
import MediaLibrary from './MediaLibrary';
import { collections } from './schema';
import type { CollectionSpec } from './schema';
import { ToastProvider } from './Toast';

const TOKEN_KEY = 'portfolio-admin-token';

export type View =
  | { name: 'dashboard' }
  | { name: 'collection'; spec: CollectionSpec }
  | { name: 'edit'; spec: CollectionSpec; itemId: string | null }
  | { name: 'profile' }
  | { name: 'media' };

function readToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_KEY) ?? localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export default function AdminApp() {
  const [token, setToken] = useState<string | null>(readToken);
  const [view, setView] = useState<View>({ name: 'dashboard' });

  const signIn = useCallback((t: string, remember: boolean) => {
    try {
      if (remember) localStorage.setItem(TOKEN_KEY, t);
      else sessionStorage.setItem(TOKEN_KEY, t);
    } catch {
      /* storage unavailable: the session just won't persist */
    }
    setToken(t);
  }, []);

  const signOut = useCallback(() => {
    try {
      sessionStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* ignore */
    }
    setToken(null);
    setView({ name: 'dashboard' });
  }, []);

  // scroll to top on view change — matters on long forms on phones
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  if (!token) {
    return (
      <ToastProvider>
        <Login onSignedIn={signIn} />
      </ToastProvider>
    );
  }

  const client = new GitHubClient(token, {
    owner: REPO_OWNER,
    repo: REPO_NAME,
    branch: REPO_BRANCH,
  });

  return (
    <ToastProvider>
      <StoreProvider client={client} signOut={signOut}>
        <div className="min-h-screen bg-ink text-text">
          <header className="border-b hairline sticky top-0 bg-ink z-20">
            <div className="wrap flex items-center justify-between gap-4 py-3">
              <button
                type="button"
                onClick={() => setView({ name: 'dashboard' })}
                className="mono text-[0.8rem] font-medium tracking-widest hover:text-accent-text transition-colors min-h-[44px]"
              >
                ADMIN<span className="text-accent">·</span>PANEL
              </button>
              <nav className="flex items-center gap-1">
                <a
                  href={import.meta.env.BASE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mono text-[0.75rem] text-muted hover:text-text px-3 py-2.5 min-h-[44px] inline-flex items-center"
                >
                  View site ↗
                </a>
                <button
                  type="button"
                  onClick={signOut}
                  className="mono text-[0.75rem] text-muted hover:text-text px-3 py-2.5 min-h-[44px]"
                >
                  Sign out
                </button>
              </nav>
            </div>
          </header>

          <main className="wrap py-6 sm:py-10 pb-28">
            {view.name === 'dashboard' && (
              <Dashboard
                onOpenCollection={(spec) => setView({ name: 'collection', spec })}
                onOpenProfile={() => setView({ name: 'profile' })}
                onOpenMedia={() => setView({ name: 'media' })}
              />
            )}
            {view.name === 'collection' && (
              <CollectionView
                spec={view.spec}
                onBack={() => setView({ name: 'dashboard' })}
                onEdit={(itemId) => setView({ name: 'edit', spec: view.spec, itemId })}
              />
            )}
            {view.name === 'edit' && (
              <ItemEditor
                spec={view.spec}
                itemId={view.itemId}
                onDone={() => setView({ name: 'collection', spec: view.spec })}
              />
            )}
            {view.name === 'profile' && (
              <ProfileEditor onDone={() => setView({ name: 'dashboard' })} />
            )}
            {view.name === 'media' && <MediaLibrary onBack={() => setView({ name: 'dashboard' })} />}
          </main>
        </div>
      </StoreProvider>
    </ToastProvider>
  );
}

export { collections };
