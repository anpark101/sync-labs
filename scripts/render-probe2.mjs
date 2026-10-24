import { build } from 'vite';

const probe = {
  name: 'render-probe2',
  enforce: 'post',
  renderChunk(code, chunk) {
    console.error('[R2] chunk name=' + chunk.name + ' file=' + chunk.file + ' len=' + code.length + ' canary=' + code.includes('CANARY777'));
    return null;
  },
  generateBundle(_o, bundle) {
    for (const [n, c] of Object.entries(bundle))
      console.error('[R2] bundle ' + n + ' type=' + c.type + ' len=' + (c.type==='chunk'?c.code.length:0) + ' canary=' + (c.type==='chunk'?c.code.includes('CANARY777'):false));
  },
};

await build({
  root: '/home/user/for-au',
  configFile: false,
  logLevel: 'error',
  esbuild: { jsx: 'automatic' },
  plugins: [probe],
  build: { outDir: '/tmp/render2-out', emptyOutDir: true, chunkSizeWarningLimit: 1600 },
});
console.error('[R2] done');
