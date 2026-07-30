/**
 * One renderer per field type in the schema. All controlled; all usable at
 * 390px with touch targets ≥44px; every error is tied to its input with
 * aria-describedby.
 */
import { useId, useState } from 'react';
import type { FieldSpec, MediaKind } from './schema';
import { renderMarkdown } from '../lib/markdown';
import { useStore } from './store';

export type OpenPicker = (kind: MediaKind, dir: string, onPick: (path: string) => void) => void;

interface FieldProps {
  spec: FieldSpec;
  value: unknown;
  onChange: (v: unknown) => void;
  error?: string;
  errorsByPath?: Record<string, string>;
  pathPrefix?: string;
  suggestions?: string[];
  openPicker: OpenPicker;
}

const inputCls =
  'w-full bg-panel border border-line-strong rounded px-3.5 py-3 text-text text-[0.95rem]';
const labelCls = 'mono text-[0.8rem] text-text block mb-2';
const helpCls = 'mono text-[0.72rem] text-muted mt-1.5';
const errCls = 'text-[0.85rem] text-accent-text mt-1.5';

function Help({ id, spec, error }: { id: string; spec: FieldSpec; error?: string }) {
  return (
    <>
      {error && (
        <p id={`${id}-err`} className={errCls}>
          {error}
        </p>
      )}
      {spec.help && (
        <p id={`${id}-help`} className={helpCls}>
          {spec.help}
        </p>
      )}
    </>
  );
}

function describedBy(id: string, spec: FieldSpec, error?: string): string | undefined {
  const ids = [error ? `${id}-err` : null, spec.help ? `${id}-help` : null].filter(Boolean);
  return ids.length ? ids.join(' ') : undefined;
}

export function Field(props: FieldProps) {
  const { spec } = props;
  switch (spec.type) {
    case 'text':
      return <TextField {...props} />;
    case 'textarea':
      return <TextAreaField {...props} />;
    case 'markdown':
      return <MarkdownField {...props} />;
    case 'date':
      return <DateField {...props} />;
    case 'number':
      return <NumberField {...props} />;
    case 'boolean':
      return <BooleanField {...props} />;
    case 'select':
      return <SelectField {...props} />;
    case 'tags':
      return <TagsField {...props} />;
    case 'stringlist':
      return <StringListField {...props} />;
    case 'media':
      return <MediaField {...props} />;
    case 'medialist':
      return <MediaListField {...props} />;
    case 'repeat':
      return <RepeatField {...props} />;
    default:
      return null;
  }
}

function TextField({ spec, value, onChange, error }: FieldProps) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className={labelCls}>
        {spec.label}
        {spec.required && <span className="text-accent-text"> *</span>}
      </label>
      <input
        id={id}
        type="text"
        value={String(value ?? '')}
        placeholder={spec.placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={inputCls}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, spec, error)}
      />
      {spec.maxLength && (
        <p className={helpCls}>
          {String(value ?? '').length}/{spec.maxLength}
        </p>
      )}
      <Help id={id} spec={spec} error={error} />
    </div>
  );
}

function TextAreaField({ spec, value, onChange, error }: FieldProps) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className={labelCls}>
        {spec.label}
        {spec.required && <span className="text-accent-text"> *</span>}
      </label>
      <textarea
        id={id}
        rows={4}
        value={String(value ?? '')}
        onChange={(e) => onChange(e.target.value)}
        className={inputCls}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, spec, error)}
      />
      <Help id={id} spec={spec} error={error} />
    </div>
  );
}

function MarkdownField({ spec, value, onChange, error }: FieldProps) {
  const id = useId();
  const [showPreview, setShowPreview] = useState(false);
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label htmlFor={id} className="mono text-[0.8rem] text-text">
          {spec.label}
          {spec.required && <span className="text-accent-text"> *</span>}
        </label>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="mono text-[0.72rem] text-muted hover:text-text px-2 py-2 min-h-[44px] transition-colors"
          aria-pressed={showPreview}
        >
          {showPreview ? 'Back to writing' : 'Preview text'}
        </button>
      </div>
      {showPreview ? (
        <div
          className="prose border hairline rounded p-4 min-h-[12rem] max-w-none"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(String(value ?? '')) }}
        />
      ) : (
        <textarea
          id={id}
          rows={14}
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputCls} font-mono text-[0.85rem] leading-relaxed`}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, spec, error)}
        />
      )}
      <Help id={id} spec={spec} error={error} />
    </div>
  );
}

function DateField({ spec, value, onChange, error }: FieldProps) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className={labelCls}>
        {spec.label}
        {spec.required && <span className="text-accent-text"> *</span>}
      </label>
      <input
        id={id}
        type="date"
        value={String(value ?? '')}
        onChange={(e) => onChange(e.target.value || undefined)}
        className={inputCls}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, spec, error)}
      />
      <Help id={id} spec={spec} error={error} />
    </div>
  );
}

function NumberField({ spec, value, onChange, error }: FieldProps) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className={labelCls}>
        {spec.label}
      </label>
      <input
        id={id}
        type="number"
        min={1}
        value={value === undefined || value === null ? '' : String(value)}
        onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
        className={inputCls}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, spec, error)}
      />
      <Help id={id} spec={spec} error={error} />
    </div>
  );
}

function BooleanField({ spec, value, onChange }: FieldProps) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="flex items-start gap-3 cursor-pointer min-h-[44px] py-2">
        <input
          id={id}
          type="checkbox"
          checked={value === true}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-1 w-4 h-4 accent-[var(--c-accent)]"
        />
        <span>
          <span className="text-[0.95rem]">{spec.label}</span>
          {spec.help && <span className="block mono text-[0.72rem] text-muted mt-0.5">{spec.help}</span>}
        </span>
      </label>
    </div>
  );
}

function SelectField({ spec, value, onChange, error }: FieldProps) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className={labelCls}>
        {spec.label}
        {spec.required && <span className="text-accent-text"> *</span>}
      </label>
      <select
        id={id}
        value={String(value ?? '')}
        onChange={(e) => onChange(e.target.value)}
        className={inputCls}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, spec, error)}
      >
        <option value="" disabled>
          Choose…
        </option>
        {(spec.options ?? []).map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <Help id={id} spec={spec} error={error} />
    </div>
  );
}

function TagsField({ spec, value, onChange, error, suggestions = [] }: FieldProps) {
  const id = useId();
  const listId = useId();
  const [draft, setDraft] = useState('');
  const tags = Array.isArray(value) ? (value as string[]) : [];

  function add(raw: string) {
    const t = raw.trim();
    if (!t) return;
    if (!tags.includes(t)) onChange([...tags, t]);
    setDraft('');
  }

  return (
    <div>
      <label htmlFor={id} className={labelCls}>
        {spec.label}
        {spec.required && <span className="text-accent-text"> *</span>}
      </label>
      {tags.length > 0 && (
        <ul className="flex flex-wrap gap-2 mb-2">
          {tags.map((t) => (
            <li
              key={t}
              className="mono text-[0.75rem] border hairline rounded pl-2.5 flex items-center gap-1"
            >
              {t}
              <button
                type="button"
                aria-label={`Remove ${t}`}
                onClick={() => onChange(tags.filter((x) => x !== t))}
                className="text-muted hover:text-accent-text px-2 py-2 min-h-[36px] transition-colors"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
      <input
        id={id}
        type="text"
        list={listId}
        value={draft}
        placeholder="Type and press Enter"
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            add(draft);
          } else if (e.key === 'Backspace' && draft === '' && tags.length > 0) {
            onChange(tags.slice(0, -1));
          }
        }}
        onBlur={() => add(draft)}
        className={inputCls}
        aria-describedby={describedBy(id, spec, error)}
      />
      <datalist id={listId}>
        {suggestions
          .filter((s) => !tags.includes(s))
          .map((s) => (
            <option key={s} value={s} />
          ))}
      </datalist>
      <Help id={id} spec={spec} error={error} />
    </div>
  );
}

function StringListField({ spec, value, onChange, error }: FieldProps) {
  const id = useId();
  const items = Array.isArray(value) ? (value as string[]) : [];
  const noun = spec.itemNoun ?? 'entry';
  return (
    <fieldset>
      <legend className={labelCls}>
        {spec.label}
        {spec.required && <span className="text-accent-text"> *</span>}
      </legend>
      <div className="space-y-2">
        {items.map((s, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              value={s}
              aria-label={`${spec.label} ${i + 1}`}
              onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))}
              className={inputCls}
            />
            <button
              type="button"
              aria-label={`Remove ${noun} ${i + 1}`}
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="mono text-muted hover:text-accent-text border hairline rounded px-3 min-h-[44px] transition-colors shrink-0"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...items, ''])}
        className="mono text-[0.75rem] border border-line-strong text-muted hover:text-text rounded px-3 py-2.5 min-h-[44px] mt-2 transition-colors"
      >
        + Add {noun}
      </button>
      <Help id={id} spec={spec} error={error} />
    </fieldset>
  );
}

function MediaThumb({ path }: { path: string }) {
  const store = useStore();
  const isImage = /\.(webp|jpe?g|png|gif|avif)$/i.test(path);
  if (!isImage) {
    return (
      <span className="mono text-[0.72rem] text-muted border hairline rounded px-2 py-1">
        {path.split('/').pop()}
      </span>
    );
  }
  return (
    <img
      src={store.client.rawUrl(`public${path}`)}
      alt=""
      width={96}
      height={64}
      loading="lazy"
      className="w-24 h-16 object-cover border hairline rounded"
    />
  );
}

function MediaField({ spec, value, onChange, error, openPicker }: FieldProps) {
  const id = useId();
  const path = typeof value === 'string' ? value : '';
  return (
    <div>
      <span className={labelCls} id={`${id}-label`}>
        {spec.label}
        {spec.required && <span className="text-accent-text"> *</span>}
      </span>
      <div className="flex flex-wrap items-center gap-3">
        {path && <MediaThumb path={path} />}
        {path && <span className="mono text-[0.72rem] text-muted break-all">{path}</span>}
        <button
          type="button"
          aria-describedby={describedBy(id, spec, error)}
          onClick={() => openPicker(spec.mediaKind ?? 'image', spec.mediaDir ?? 'projects', onChange)}
          className="mono text-[0.75rem] border border-line-strong text-text rounded px-3 py-2.5 min-h-[44px] hover:border-accent transition-colors"
        >
          {path ? 'Replace…' : 'Choose…'}
        </button>
        {path && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="mono text-[0.75rem] text-muted hover:text-accent-text px-2 py-2.5 min-h-[44px] transition-colors"
          >
            Remove
          </button>
        )}
      </div>
      <Help id={id} spec={spec} error={error} />
    </div>
  );
}

function MediaListField({ spec, value, onChange, error, openPicker }: FieldProps) {
  const id = useId();
  const items = Array.isArray(value) ? (value as string[]) : [];
  return (
    <fieldset>
      <legend className={labelCls}>{spec.label}</legend>
      {items.length > 0 && (
        <ol className="space-y-2 mb-2">
          {items.map((p, i) => (
            <li key={`${p}-${i}`} className="flex items-center gap-3 border hairline rounded p-2">
              <MediaThumb path={p} />
              <span className="mono text-[0.7rem] text-muted break-all flex-1">{p}</span>
              <div className="flex gap-1 shrink-0">
                <button
                  type="button"
                  aria-label={`Move item ${i + 1} up`}
                  disabled={i === 0}
                  onClick={() => {
                    const next = [...items];
                    [next[i - 1], next[i]] = [next[i]!, next[i - 1]!];
                    onChange(next);
                  }}
                  className="mono text-muted hover:text-text border hairline rounded w-9 h-9 disabled:opacity-30 transition-colors"
                >
                  ↑
                </button>
                <button
                  type="button"
                  aria-label={`Move item ${i + 1} down`}
                  disabled={i === items.length - 1}
                  onClick={() => {
                    const next = [...items];
                    [next[i], next[i + 1]] = [next[i + 1]!, next[i]!];
                    onChange(next);
                  }}
                  className="mono text-muted hover:text-text border hairline rounded w-9 h-9 disabled:opacity-30 transition-colors"
                >
                  ↓
                </button>
                <button
                  type="button"
                  aria-label={`Remove item ${i + 1}`}
                  onClick={() => onChange(items.filter((_, j) => j !== i))}
                  className="mono text-muted hover:text-accent-text border hairline rounded w-9 h-9 transition-colors"
                >
                  ×
                </button>
              </div>
            </li>
          ))}
        </ol>
      )}
      <button
        type="button"
        onClick={() =>
          openPicker(spec.mediaKind ?? 'image', spec.mediaDir ?? 'projects', (p) =>
            onChange([...items, p]),
          )
        }
        className="mono text-[0.75rem] border border-line-strong text-muted hover:text-text rounded px-3 py-2.5 min-h-[44px] transition-colors"
      >
        + Add image
      </button>
      <Help id={id} spec={spec} error={error} />
    </fieldset>
  );
}

function RepeatField({ spec, value, onChange, errorsByPath = {}, pathPrefix = '', openPicker }: FieldProps) {
  const id = useId();
  const items = Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
  const noun = spec.itemNoun ?? 'entry';
  const subFields = spec.fields ?? [];

  function blank(): Record<string, unknown> {
    const o: Record<string, unknown> = {};
    for (const f of subFields) {
      if (f.type === 'select') o[f.key] = f.options?.[0]?.value ?? '';
      else o[f.key] = '';
    }
    return o;
  }

  return (
    <fieldset>
      <legend className={labelCls}>{spec.label}</legend>
      <div className="space-y-4">
        {items.map((entry, i) => (
          <div key={i} className="border hairline rounded p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="mono text-[0.72rem] text-muted uppercase tracking-widest">
                {noun} {i + 1}
              </span>
              <button
                type="button"
                onClick={() => onChange(items.filter((_, j) => j !== i))}
                className="mono text-[0.72rem] text-muted hover:text-accent-text px-2 py-2 min-h-[36px] transition-colors"
              >
                Remove
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {subFields.map((sf) => (
                <div key={sf.key} className={sf.type === 'media' ? 'sm:col-span-2' : ''}>
                  <Field
                    spec={sf}
                    value={entry[sf.key]}
                    onChange={(v) =>
                      onChange(items.map((x, j) => (j === i ? { ...x, [sf.key]: v } : x)))
                    }
                    error={errorsByPath[`${pathPrefix}${spec.key}.${i}.${sf.key}`]}
                    openPicker={openPicker}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...items, blank()])}
        className="mono text-[0.75rem] border border-line-strong text-muted hover:text-text rounded px-3 py-2.5 min-h-[44px] mt-3 transition-colors"
      >
        + Add {noun}
      </button>
      <Help id={id} spec={spec} error={undefined} />
    </fieldset>
  );
}
