import { build } from 'vite';
import fs from 'node:fs';

const capture = {
  name: 'nr-capture',
  enforce: 'post',
  generateBundle(_o, bundle) {
    for (const [name, chunk] of Object.entries(bundle)) {
      if (chunk.type === 'chunk' && name.endsWith('.js')) {
        fs.mkdirSync('/tmp/nr-out', { recursive: true });
        fs.writeFileSync('/tmp/nr-final-' + name.replace(/\//g, '_'), chunk.code);
        console.error('[NR] captured ' + name + ' len=' + chunk.code.length + ' url=' + chunk.code.includes('ieduek2whtmpzxnj5qt3c'));
      }
    }
  },
};

await build({
  root: '/home/user/for-au',
  configFile: false,
  logLevel: 'error',
  esbuild: { jsx: 'automatic' },
  plugins: [capture],
  build: { outDir: '/tmp/nr-out', emptyOutDir: true, chunkSizeWarningLimit: 1600 },
});
console.error('[NR] done');
