import { useCallback, useEffect, useState } from 'react';
import { profileFields } from './schema';
import type { MediaKind } from './schema';
import { useStore, GitHubError } from './store';
import type { Item } from './store';
import { useToast } from './Toast';
import { Field } from './fields';
import MediaPicker from './MediaPicker';

interface PickerState {
  kind: MediaKind;
  dir: string;
  onPick: (path: string) => void;
}

export default function ProfileEditor({ onDone }: { onDone: () => void }) {
  const store = useStore();
  const { toast } = useToast();
  const [value, setValue] = useState<Item | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [picker, setPicker] = useState<PickerState | null>(null);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    store
      .loadProfile()
      .then((p) => {
        if (!cancelled) setValue(p.data);
      })
      .catch((e) => {
        if (!cancelled)
          setLoadError(e instanceof Error ? e.message : 'Could not load your profile.');
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openPicker = useCallback<(kind: MediaKind, dir: string, onPick: (p: string) => void) => void>(
    (kind, dir, onPick) => setPicker({ kind, dir, onPick }),
    [],
  );

  async function save() {
    if (!value) return;
    const errs: Record<string, string> = {};
    for (const f of profileFields) {
      const v = value[f.key];
      if (f.required && (v === undefined || v === null || v === '')) {
        errs[f.key] = f.requiredMessage ?? `${f.label} is required.`;
      }
    }
    const email = String(value['email'] ?? '');
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs['email'] = 'That email address does not look complete — check it.';
    }
    const endpoint = String(value['formspreeEndpoint'] ?? '');
    if (endpoint && !/^https?:\/\//.test(endpoint)) {
      errs['formspreeEndpoint'] = 'The Formspree address must start with https://';
    }
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      toast({ kind: 'error', text: 'Not saved yet — a few fields need attention below.' });
      return;
    }
    setSaving(true);
    try {
      await store.saveProfile(value, 'Update profile');
      toast({
        kind: 'ok',
        text: 'Saved. Your site updates in about a minute.',
        linkHref: store.client.actionsUrl(),
        linkLabel: 'Watch the update',
      });
      onDone();
    } catch (e) {
      if (e instanceof GitHubError && e.status === 409) {
        toast({
          kind: 'error',
          text: 'The profile changed on GitHub since you loaded it. Reload this page and re-apply your edits.',
        });
      } else {
        toast({ kind: 'error', text: e instanceof Error ? e.message : 'Save failed.' });
      }
    } finally {
      setSaving(false);
    }
  }

  if (loadError) {
    return (
      <div role="alert" className="border border-accent rounded p-4 text-[0.9rem]">
        {loadError}
      </div>
    );
  }
  if (!value) return <p className="mono text-[0.8rem] text-muted">Loading from GitHub…</p>;

  return (
    <div>
      <button
        type="button"
        onClick={onDone}
        className="mono text-[0.8rem] text-muted hover:text-text min-h-[44px] transition-colors"
      >
        ← Dashboard
      </button>
      <h1 className="h2 mt-2">Profile &amp; site settings</h1>
      <p className="text-muted text-[0.95rem] mt-2 max-w-xl">
        Everything here appears somewhere on the public site — the hero, the About page, the
        footer, the contact page.
      </p>

      <form
        className="mt-8 space-y-7 max-w-2xl"
        onSubmit={(e) => {
          e.preventDefault();
          void save();
        }}
        noValidate
      >
        {profileFields.map((f) => (
          <Field
            key={f.key}
            spec={f}
            value={value[f.key]}
            onChange={(v) => setValue({ ...value, [f.key]: v })}
            error={errors[f.key]}
            openPicker={openPicker}
          />
        ))}

        <fieldset>
          <legend className="mono text-[0.8rem] text-text mb-2">Social links</legend>
          {(['github', 'linkedin', 'x'] as const).map((k) => {
            const socials = (value['socials'] as Record<string, string>) ?? {};
            return (
              <div key={k} className="mb-3">
                <label htmlFor={`social-${k}`} className="mono text-[0.72rem] text-muted block mb-1.5 uppercase">
                  {k === 'x' ? 'X (Twitter)' : k}
                </label>
                <input
                  id={`social-${k}`}
                  type="url"
                  placeholder={`https://${k === 'x' ? 'x' : k}.com/…`}
                  value={socials[k] ?? ''}
                  onChange={(e) =>
                    setValue({
                      ...value,
                      socials: { ...socials, [k]: e.target.value || undefined },
                    })
                  }
                  className="w-full bg-panel border border-line-strong rounded px-3.5 py-3 text-text text-[0.95rem]"
                />
              </div>
            );
          })}
          <p className="mono text-[0.72rem] text-muted">Empty links simply don't appear on the site.</p>
        </fieldset>
      </form>

      <div className="fixed bottom-0 left-0 right-0 border-t hairline bg-ink z-30">
        <div className="wrap flex items-center justify-end gap-3 py-3">
          <button
            type="button"
            onClick={onDone}
            className="mono text-[0.8rem] text-muted hover:text-text px-3 py-2.5 min-h-[44px] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void save()}
            disabled={saving}
            className="mono text-[0.85rem] bg-accent text-accent-ink rounded px-6 py-3 min-h-[44px] disabled:opacity-60 hover:opacity-90 transition-opacity"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      {picker && (
        <MediaPicker
          kind={picker.kind}
          dir={picker.dir}
          onPick={picker.onPick}
          onClose={() => setPicker(null)}
        />
      )}
    </div>
  );
}
