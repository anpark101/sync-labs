import { build } from 'vite';
import fs from 'node:fs';

const probe = {
  name: 'render-probe3',
  enforce: 'post',
  renderChunk(code, chunk) {
    if (code.includes('CANARY777')) {
      fs.writeFileSync('/tmp/render-stage.js', code);
      console.error('[R3] captured render stage, len=' + code.length);
    }
    return null;
  },
};

await build({
  root: '/home/user/for-au',
  configFile: false,
  logLevel: 'error',
  esbuild: { jsx: 'automatic' },
  plugins: [probe],
  build: { outDir: '/tmp/render3-out', emptyOutDir: true, chunkSizeWarningLimit: 1600 },
});
console.error('[R3] done');
