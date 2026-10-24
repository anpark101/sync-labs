import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'server-data');
const STATE_FILE = path.join(DATA_DIR, 'state.json');
const PORT = process.env.PORT || 3000;

fs.mkdirSync(DATA_DIR, { recursive: true });

const app = express();
app.use(express.json({ limit: '60mb' }));

// CORS for the API (the Android APK calls the cloud API cross-origin)
app.use('/api', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

function readState() {
  try {
    const raw = fs.readFileSync(STATE_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, app: 'auverse-studio', time: new Date().toISOString() });
});

app.get('/api/state', (_req, res) => {
  const state = readState();
  res.json({ ok: true, state, serverTime: new Date().toISOString() });
});

app.put('/api/state', (req, res) => {
  const incoming = req.body?.state;
  if (!incoming || typeof incoming !== 'object' || !Array.isArray(incoming.projects) || !Array.isArray(incoming.characters)) {
    return res.status(400).json({ ok: false, error: 'invalid state' });
  }
  const existing = readState();
  const incomingAt = Number(incoming.updatedAt || 0);
  const existingAt = Number(existing?.updatedAt || 0);
  // last-writer-wins, but never let an older state overwrite a newer one
  if (existing && incomingAt < existingAt && incomingAt !== existingAt) {
    return res.status(409).json({ ok: false, error: 'stale', state: existing });
  }
  const savedAt = Date.now();
  const toSave = { ...incoming, updatedAt: Math.max(incomingAt, savedAt - 60000) || savedAt };
  const tmp = STATE_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(toSave));
  fs.renameSync(tmp, STATE_FILE);
  res.json({ ok: true, savedAt });
});

// Android APK download (v2-signed, installable on Android 7.0+)
app.get('/apk/auverse-studio.apk', (_req, res) => {
  const apkPath = path.join(ROOT, 'apk', 'auverse-studio.apk');
  res.setHeader('Content-Type', 'application/vnd.android.package-archive');
  res.setHeader('Content-Disposition', 'attachment; filename="auverse-studio.apk"');
  res.sendFile(apkPath);
});

// static frontend
const DIST = path.join(ROOT, 'dist');
app.use(express.static(DIST));
app.get(/^\/(?!api\/).*/, (_req, res) => {
  res.sendFile(path.join(DIST, 'index.html'));
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ ok: false, error: String(err?.message || err) });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`AUverse Studio running on http://0.0.0.0:${PORT}`);
});
