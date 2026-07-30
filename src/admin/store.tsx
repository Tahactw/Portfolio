/**
 * Admin state: the signed-in GitHub client plus a cache of each content
 * file's current items and blob sha. All reads come from the GitHub API on
 * the main branch — never from the deployed site — so the panel is never
 * stale after its own saves.
 */
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { GitHubClient, GitHubError, blobToBase64, utf8ToBase64 } from './github';
import type { CollectionSpec } from './schema';
import { PROFILE_FILE } from './schema';

export type Item = Record<string, unknown>;

export interface FileState {
  items: Item[];
  sha: string;
}

export interface ProfileState {
  data: Item;
  sha: string;
}

interface StoreValue {
  client: GitHubClient;
  signOut: () => void;
  files: Record<string, FileState | undefined>;
  profile: ProfileState | undefined;
  loadCollection: (spec: CollectionSpec) => Promise<FileState>;
  saveCollection: (spec: CollectionSpec, items: Item[], message: string) => Promise<void>;
  /** Refetch from GitHub, then write `items` over it (used after a 409). */
  forceSaveCollection: (spec: CollectionSpec, items: Item[], message: string) => Promise<void>;
  loadProfile: () => Promise<ProfileState>;
  saveProfile: (data: Item, message: string) => Promise<void>;
  uploadMedia: (dir: string, filename: string, blob: Blob) => Promise<string>;
  deleteMedia: (path: string, sha: string) => Promise<void>;
}

const Ctx = createContext<StoreValue | null>(null);

export function useStore(): StoreValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('useStore outside provider');
  return v;
}

export { GitHubError };

export function StoreProvider({
  client,
  signOut,
  children,
}: {
  client: GitHubClient;
  signOut: () => void;
  children: ReactNode;
}) {
  const [files, setFiles] = useState<Record<string, FileState | undefined>>({});
  const [profile, setProfile] = useState<ProfileState | undefined>();
  // serialise writes so two quick saves can't race each other's sha
  const writeLock = useRef<Promise<unknown>>(Promise.resolve());

  const locked = useCallback(<T,>(fn: () => Promise<T>): Promise<T> => {
    const next = writeLock.current.then(fn, fn);
    writeLock.current = next.catch(() => undefined);
    return next;
  }, []);

  const loadCollection = useCallback(
    async (spec: CollectionSpec): Promise<FileState> => {
      const file = await client.getFile(spec.file);
      if (!file) {
        const state: FileState = { items: [], sha: '' };
        setFiles((f) => ({ ...f, [spec.name]: state }));
        return state;
      }
      let items: Item[];
      try {
        const parsed = JSON.parse(file.text) as unknown;
        items = Array.isArray(parsed) ? (parsed as Item[]) : [];
      } catch {
        throw new Error(
          `${spec.file} in the repository is not valid JSON. Restore it from GitHub's file history before editing here.`,
        );
      }
      const state: FileState = { items, sha: file.sha };
      setFiles((f) => ({ ...f, [spec.name]: state }));
      return state;
    },
    [client],
  );

  const writeCollection = useCallback(
    async (spec: CollectionSpec, items: Item[], message: string, sha: string) => {
      const body = utf8ToBase64(`${JSON.stringify(items, null, 2)}\n`);
      const res = await client.putFile(spec.file, body, message, sha || undefined);
      setFiles((f) => ({ ...f, [spec.name]: { items, sha: res.sha } }));
    },
    [client],
  );

  const saveCollection = useCallback(
    (spec: CollectionSpec, items: Item[], message: string) =>
      locked(async () => {
        const cur = files[spec.name] ?? (await loadCollection(spec));
        await writeCollection(spec, items, message, cur.sha);
      }),
    [files, loadCollection, writeCollection, locked],
  );

  const forceSaveCollection = useCallback(
    (spec: CollectionSpec, items: Item[], message: string) =>
      locked(async () => {
        const fresh = await loadCollection(spec);
        await writeCollection(spec, items, message, fresh.sha);
      }),
    [loadCollection, writeCollection, locked],
  );

  const loadProfile = useCallback(async (): Promise<ProfileState> => {
    const file = await client.getFile(PROFILE_FILE);
    if (!file) throw new Error('profile.json is missing from the repository.');
    const state: ProfileState = { data: JSON.parse(file.text) as Item, sha: file.sha };
    setProfile(state);
    return state;
  }, [client]);

  const saveProfile = useCallback(
    (data: Item, message: string) =>
      locked(async () => {
        const cur = profile ?? (await loadProfile());
        const body = utf8ToBase64(`${JSON.stringify(data, null, 2)}\n`);
        const res = await client.putFile(PROFILE_FILE, body, message, cur.sha);
        setProfile({ data, sha: res.sha });
      }),
    [client, profile, loadProfile, locked],
  );

  const uploadMedia = useCallback(
    (dir: string, filename: string, blob: Blob) =>
      locked(async () => {
        const path = `public/media/${dir}/${filename}`;
        const b64 = await blobToBase64(blob);
        await client.putFile(path, b64, `Upload media: ${filename}`);
        return `/media/${dir}/${filename}`;
      }),
    [client, locked],
  );

  const deleteMedia = useCallback(
    (path: string, sha: string) =>
      locked(async () => {
        await client.deleteFile(path, sha, `Delete media: ${path.split('/').pop()}`);
      }),
    [client, locked],
  );

  const value = useMemo(
    () => ({
      client,
      signOut,
      files,
      profile,
      loadCollection,
      saveCollection,
      forceSaveCollection,
      loadProfile,
      saveProfile,
      uploadMedia,
      deleteMedia,
    }),
    [
      client,
      signOut,
      files,
      profile,
      loadCollection,
      saveCollection,
      forceSaveCollection,
      loadProfile,
      saveProfile,
      uploadMedia,
      deleteMedia,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
