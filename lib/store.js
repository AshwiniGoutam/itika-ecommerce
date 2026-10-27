import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const CONTENT_FILE = path.join(DATA_DIR, 'content.json');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');
export const UPLOAD_DIR = path.join(DATA_DIR, 'uploads');

async function readJSON(file, fallback) {
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch {
    return fallback;
  }
}

// atomic write: write temp file then rename, so a crash never leaves half a file
async function writeJSON(file, data) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = `${file}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf8');
  await fs.rename(tmp, file);
}

// simple in-process queue so two requests never write leads.json at the same time
let queue = Promise.resolve();
function serial(fn) {
  const run = queue.then(fn, fn);
  queue = run.catch(() => {});
  return run;
}

export const getContent = () => readJSON(CONTENT_FILE, {});
export const saveContent = (content) => serial(() => writeJSON(CONTENT_FILE, content));

export const getLeads = () => readJSON(LEADS_FILE, []);

export const addLead = (lead) =>
  serial(async () => {
    const leads = await getLeads();
    leads.unshift(lead);
    await writeJSON(LEADS_FILE, leads);
    return lead;
  });

export const updateLead = (id, patch) =>
  serial(async () => {
    const leads = await getLeads();
    const i = leads.findIndex((l) => l.id === id);
    if (i === -1) return null;
    leads[i] = { ...leads[i], ...patch, updatedAt: new Date().toISOString() };
    await writeJSON(LEADS_FILE, leads);
    return leads[i];
  });

export const deleteLead = (id) =>
  serial(async () => {
    const leads = await getLeads();
    const next = leads.filter((l) => l.id !== id);
    await writeJSON(LEADS_FILE, next);
    return next.length !== leads.length;
  });
