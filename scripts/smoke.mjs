// Headless smoke test: load the built bundle in a jsdom browser environment
// and verify the app boots and renders the home screen.
import { JSDOM } from 'jsdom';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const assetsDir = path.resolve('dist/assets');
const jsFile = readdirSync(assetsDir).find((f) => f.endsWith('.js'));
if (!jsFile) throw new Error('no bundle in dist/assets');

const dom = new JSDOM(
  `<!doctype html><html><body><div id="root"></div></body></html>`,
  { url: 'http://localhost:3000/', pretendToBeVisual: true }
);

const { window } = dom;
window.fetch = async (url) => {
  const u = String(url);
  if (u.includes('/api/state')) return { ok: true, json: async () => ({ ok: true, state: null }) };
  if (u.includes('/api/health')) return { ok: true, json: async () => ({ ok: true }) };
  return { ok: false, status: 404, json: async () => ({}) };
};
window.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
window.scrollTo = () => {};
window.confirm = () => true;
window.matchMedia = (q) => ({ matches: false, media: q, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} });
window.HTMLCanvasElement.prototype.getContext = () => null;
window.Image = class {
  set src(v) {
    setTimeout(() => this.onload && this.onload(), 0);
  }
};
window.HTMLCanvasElement.prototype.toDataURL = () => 'data:image/png;base64,';

for (const k of ['window', 'document', 'navigator', 'location', 'localStorage', 'sessionStorage', 'CustomEvent', 'Event', 'HTMLElement', 'HTMLInputElement', 'HTMLTextAreaElement', 'getComputedStyle', 'requestAnimationFrame', 'cancelAnimationFrame', 'MutationObserver', 'history']) {
  try {
    globalThis[k] = k === 'requestAnimationFrame'
      ? (cb) => setTimeout(() => cb(Date.now()), 16)
      : k === 'cancelAnimationFrame'
        ? (id) => clearTimeout(id)
        : window[k];
  } catch {}
}
globalThis.window = window;
try {
  Object.defineProperty(globalThis, 'navigator', { value: window.navigator, configurable: true });
} catch {}

let failed = false;
window.addEventListener('error', (e) => {
  console.error('WINDOW ERROR:', e.message);
  failed = true;
});

try {
  await import(path.join(assetsDir, jsFile));
} catch (e) {
  console.error('BUNDLE IMPORT FAILED:', e);
  process.exit(1);
}

await new Promise((r) => setTimeout(r, 1200));

const root = window.document.getElementById('root');
const html = root?.innerHTML || '';
const checks = {
  'rendered something': html.length > 500,
  'has brand name': html.includes('AUverse'),
  'has bottom nav': html.includes('bottomnav'),
  'has empty-state or project list': html.includes('empty') || html.includes('project-card'),
  'has sync pill': html.includes('sync-pill'),
};
let ok = true;
for (const [name, pass] of Object.entries(checks)) {
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}`);
  if (!pass) ok = false;
}
if (failed) {
  console.log('FAIL  no window errors');
  ok = false;
}
console.log(ok ? '\nSMOKE TEST PASSED — app boots and renders.' : '\nSMOKE TEST FAILED');
process.exit(ok ? 0 : 1);
