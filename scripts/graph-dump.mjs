import { build } from 'vite';
import fs from 'node:fs';

const probe = {
  name: 'graph-dump',
  transform(code, id) {
    if (id.includes('store') || id.includes('api2') || code.includes('StoreProvider')) {
      console.error('[G] ' + id + '  len=' + code.length + ' hasApiBase=' + code.includes('API_BASE') + ' hasMarker=' + code.includes('APIHELPERMARKER') + ' hasProvider=' + code.includes('StoreProvider'));
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
  build: { outDir: '/tmp/graph-out', emptyOutDir: true, chunkSizeWarningLimit: 1600 },
});
console.error('[G] done');
