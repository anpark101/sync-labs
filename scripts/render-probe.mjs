import { build } from 'vite';

const probe = {
  name: 'render-probe',
  enforce: 'post',
  renderChunk(code, chunk) {
    if (chunk.file && chunk.file.endsWith('.js') && code.includes('CANARY777')) {
      const urlHere = code.includes('ieduek2whtmpzxnj5qt3c');
      const markerHere = code.includes('APIHELPERMARKER');
      console.error('[RENDER] chunk ' + chunk.file + ' url=' + urlHere + ' marker=' + markerHere + ' len=' + code.length);
      const i = code.indexOf('/api/state');
      console.error('[RENDER] fetch ctx:', JSON.stringify(code.slice(i - 150, i + 40)));
      // find API_BASE-ish region
      const j = code.indexOf('console.log("CANARY777")');
      console.error('[RENDER] post-canary:', JSON.stringify(code.slice(j, j + 260)));
      return null;
    }
  },
};

await build({
  root: '/home/user/for-au',
  configFile: false,
  logLevel: 'error',
  esbuild: { jsx: 'automatic' },
  plugins: [probe],
  build: { outDir: '/tmp/render-out', emptyOutDir: true, chunkSizeWarningLimit: 1600 },
});
console.error('[RENDER] done');
