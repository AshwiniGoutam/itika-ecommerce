'use client';
import { useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Plus, Trash2, Upload, Loader2, Save, RotateCcw, ImageIcon } from 'lucide-react';
import { ICON_NAMES, getIcon } from '@/lib/icons';

const SECTION_LABELS = {
  seo: 'SEO (Google title & description)', brand: 'Brand & contact details', hero: 'Hero (top of page)',
  tape: 'Moving tape', platforms: 'Marketplaces', services: 'Services', statement: 'Big statement',
  results: 'Results / numbers', process: 'Process steps', testimonials: 'Testimonials', faq: 'FAQ',
  contact: 'Lead form section', footer: 'Footer',
};

const IMAGE_KEY = /(image|logo|avatar|photo|picture|banner|thumbnail)/i;
const LONG_KEY = /(desc|description|subtitle|quote|^a$|^text$|message|about|answer)/i;
const COLOR_KEY = /color/i;

const pretty = (k) => String(k).replace(/([A-Z])/g, ' $1').replace(/[_-]/g, ' ').replace(/^./, (s) => s.toUpperCase());
const clone = (v) => JSON.parse(JSON.stringify(v));
function blank(v) {
  if (Array.isArray(v)) return [];
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, blank(x)]));
  if (typeof v === 'number') return 0;
  if (typeof v === 'boolean') return false;
  return '';
}

const inputCls = 'w-full rounded-xl border border-ink/10 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-orange focus:ring-4 focus:ring-orange/10';

function ImageField({ value, onChange, api }) {
  const ref = useRef(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  async function upload(file) {
    if (!file) return;
    setBusy(true); setErr('');
    const fd = new FormData();
    fd.append('file', file);
    try {
      const { url } = await api('/api/upload', { method: 'POST', body: fd });
      onChange(url);
    } catch (e) { setErr(e.message); }
    setBusy(false);
  }
  return (
    <div className="flex flex-wrap items-start gap-3">
      <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-xl border border-ink/10 bg-paper">
        {value ? <img src={value} alt="" className="h-full w-full object-contain" /> : <ImageIcon className="h-6 w-6 text-ink/25" />}
      </div>
      <div className="min-w-[200px] flex-1 space-y-2">
        <input className={inputCls} value={value} onChange={(e) => onChange(e.target.value)} placeholder="Image URL, or upload one" />
        <div className="flex gap-2">
          <button type="button" onClick={() => ref.current?.click()} className="flex items-center gap-2 rounded-lg bg-navy px-3 py-1.5 text-xs font-semibold text-white">
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />} Upload image
          </button>
          {value && <button type="button" onClick={() => onChange('')} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50">Remove</button>}
        </div>
        {err && <p className="text-xs text-red-600">{err}</p>}
        <input ref={ref} type="file" accept="image/*" hidden onChange={(e) => upload(e.target.files?.[0])} />
      </div>
    </div>
  );
}

function Field({ name, value, onChange, api, depth = 0 }) {
  if (Array.isArray(value)) return <ArrayField name={name} value={value} onChange={onChange} api={api} depth={depth} />;
  if (value && typeof value === 'object') {
    return (
      <div className={depth ? 'space-y-4' : 'space-y-5'}>
        {Object.entries(value).map(([k, v]) => (
          <Field key={k} name={k} value={v} api={api} depth={depth + 1} onChange={(nv) => onChange({ ...value, [k]: nv })} />
        ))}
      </div>
    );
  }

  let control;
  if (typeof value === 'number') {
    control = <input type="number" className={inputCls} value={value} onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))} />;
  } else if (typeof value === 'boolean') {
    control = (
      <button type="button" onClick={() => onChange(!value)} className={`relative h-6 w-11 rounded-full transition ${value ? 'bg-orange' : 'bg-ink/20'}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${value ? 'left-[22px]' : 'left-0.5'}`} />
      </button>
    );
  } else if (name === 'icon') {
    const Icon = getIcon(value);
    control = (
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-navy text-orange"><Icon className="h-5 w-5" /></span>
        <select className={inputCls} value={value} onChange={(e) => onChange(e.target.value)}>
          {ICON_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>
    );
  } else if (IMAGE_KEY.test(name)) {
    control = <ImageField value={value || ''} onChange={onChange} api={api} />;
  } else if (COLOR_KEY.test(name)) {
    control = (
      <div className="flex items-center gap-3">
        <input type="color" value={/^#[0-9a-f]{6}$/i.test(value) ? value : '#FF6A13'} onChange={(e) => onChange(e.target.value)} className="h-10 w-14 cursor-pointer rounded-lg border border-ink/10" />
        <input className={inputCls} value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
    );
  } else if (LONG_KEY.test(name) || String(value || '').length > 80) {
    control = <textarea className={`${inputCls} min-h-[90px] resize-y`} value={value || ''} onChange={(e) => onChange(e.target.value)} />;
  } else {
    control = <input className={inputCls} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />;
  }

  return (
    <label className="block">
      {typeof name === 'string' && <span className="mb-1.5 block text-xs font-semibold text-ink/60">{pretty(name)}</span>}
      {control}
    </label>
  );
}

function itemTitle(item, i) {
  if (item && typeof item === 'object') return item.title || item.name || item.q || item.label || `Item ${i + 1}`;
  return null;
}

function ArrayField({ name, value, onChange, api, depth }) {
  const [open, setOpen] = useState(0);
  const isObj = value.length && typeof value[0] === 'object';
  const update = (i, v) => onChange(value.map((x, j) => (j === i ? v : x)));
  const move = (i, d) => {
    const j = i + d;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
    setOpen(j);
  };
  const add = () => {
    const tpl = value.length ? blank(value[0]) : '';
    onChange([...value, tpl]);
    setOpen(value.length);
  };

  return (
    <div>
      <span className="mb-2 block text-xs font-semibold text-ink/60">{pretty(name)} <span className="font-normal text-ink/40">({value.length})</span></span>
      <div className="space-y-2">
        {value.map((item, i) =>
          isObj ? (
            <div key={i} className="overflow-hidden rounded-xl border border-ink/10 bg-paper/50">
              <div className="flex items-center gap-2 px-3 py-2">
                <button type="button" onClick={() => setOpen(open === i ? -1 : i)} className="flex flex-1 items-center gap-2 py-1 text-left text-sm font-semibold">
                  <ChevronDown className={`h-4 w-4 transition ${open === i ? 'rotate-180' : ''}`} />
                  {itemTitle(item, i)}
                </button>
                <ItemTools i={i} len={value.length} move={move} onDelete={() => onChange(value.filter((_, j) => j !== i))} />
              </div>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="border-t border-ink/10 bg-white p-4">
                      <Field name={i} value={item} api={api} depth={depth + 1} onChange={(v) => update(i, v)} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div key={i} className="flex items-center gap-2">
              <div className="flex-1">
                {IMAGE_KEY.test(String(name)) ? (
                  <ImageField value={item} onChange={(v) => update(i, v)} api={api} />
                ) : (
                  <input className={inputCls} value={item} onChange={(e) => update(i, e.target.value)} />
                )}
              </div>
              <ItemTools i={i} len={value.length} move={move} onDelete={() => onChange(value.filter((_, j) => j !== i))} />
            </div>
          )
        )}
      </div>
      <button type="button" onClick={add} className="mt-3 flex items-center gap-1.5 rounded-lg border border-dashed border-ink/20 px-3 py-2 text-xs font-semibold text-ink/60 hover:border-orange hover:text-orange">
        <Plus className="h-3.5 w-3.5" /> Add {isObj ? 'item' : 'line'}
      </button>
    </div>
  );
}

function ItemTools({ i, len, move, onDelete }) {
  return (
    <div className="flex shrink-0 items-center">
      <button type="button" disabled={i === 0} onClick={() => move(i, -1)} className="rounded-md p-1.5 text-ink/40 hover:bg-ink/5 hover:text-ink disabled:opacity-20" aria-label="Move up"><ChevronUp className="h-4 w-4" /></button>
      <button type="button" disabled={i === len - 1} onClick={() => move(i, 1)} className="rounded-md p-1.5 text-ink/40 hover:bg-ink/5 hover:text-ink disabled:opacity-20" aria-label="Move down"><ChevronDown className="h-4 w-4" /></button>
      <button type="button" onClick={() => confirm('Remove this item?') && onDelete()} className="rounded-md p-1.5 text-ink/40 hover:bg-red-50 hover:text-red-600" aria-label="Remove"><Trash2 className="h-4 w-4" /></button>
    </div>
  );
}

export default function ContentEditor({ content, setContent, api, notify }) {
  const [draft, setDraft] = useState(() => clone(content));
  const [section, setSection] = useState(Object.keys(content)[0]);
  const [saving, setSaving] = useState(false);
  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(content), [draft, content]);

  async function save() {
    setSaving(true);
    try {
      await api('/api/content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: draft }) });
      setContent(clone(draft));
      notify('Changes published to the website');
    } catch (e) { notify(e.message, 'err'); }
    setSaving(false);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[240px_1fr]">
      <div className="flex gap-2 overflow-x-auto xl:flex-col xl:overflow-visible">
        {Object.keys(draft).map((k) => (
          <button key={k} onClick={() => setSection(k)} className={`shrink-0 rounded-xl px-4 py-2.5 text-left text-sm font-medium transition ${section === k ? 'bg-navy text-white' : 'bg-white text-ink/65 hover:text-ink'}`}>
            {SECTION_LABELS[k] || pretty(k)}
          </button>
        ))}
      </div>

      <div className="rounded-2xl bg-white p-5 sm:p-7">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-ink/5 pb-5">
          <div>
            <h2 className="font-display text-lg font-bold">{SECTION_LABELS[section] || pretty(section)}</h2>
            <p className="mt-1 text-xs text-ink/50">Tip: wrap words in *asterisks* to show them in orange on the website.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setDraft(clone(content))} disabled={!dirty} className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-ink/60 hover:bg-paper disabled:opacity-30">
              <RotateCcw className="h-4 w-4" /> Discard
            </button>
            <button onClick={save} disabled={!dirty || saving} className="flex items-center gap-2 rounded-xl bg-orange px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-40">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Publish changes
            </button>
          </div>
        </div>
        <Field name={section} value={draft[section]} api={api} onChange={(v) => setDraft((d) => ({ ...d, [section]: v }))} />
      </div>

      <AnimatePresence>
        {dirty && (
          <motion.div initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }} className="fixed bottom-5 right-5 z-30 flex items-center gap-3 rounded-2xl bg-navy-deep px-4 py-3 text-sm text-white shadow-2xl">
            You have unpublished changes
            <button onClick={save} disabled={saving} className="rounded-lg bg-orange px-3 py-1.5 font-semibold">Publish</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
