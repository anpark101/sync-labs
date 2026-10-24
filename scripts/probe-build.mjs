import { build } from 'vite';
import fs from 'node:fs';

const capture = {
  name: 'probe-capture',
  enforce: 'post',
  generateBundle(_o, bundle) {
    for (const [name, chunk] of Object.entries(bundle)) {
      if (chunk.type === 'chunk' && name.endsWith('.js')) {
        fs.writeFileSync('/tmp/probe-final-' + name, chunk.code);
        console.error('[PROBE] wrote /tmp/probe-final-' + name, 'len', chunk.code.length);
      }
    }
  },
};

const result = await build({
  root: '/home/user/for-au',
  logLevel: 'info',
  configFile: 'vite.config.apk.ts',
  build: { outDir: '/tmp/probe-out', emptyOutDir: true },
  plugins: [capture],
});
console.error('build returned:', !!result);
