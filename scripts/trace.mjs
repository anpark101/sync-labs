import { build } from 'vite';
import react from '@vitejs/plugin-react';

const trace = {
  name: 'trace-store',
  enforce: 'post',
  async transform(code, id) {
    if (id.includes('store.tsx')) {
      const i = code.indexOf('VITE_API_BASE');
      console.error('=== TRACE store.tsx transform output ===');
      console.error(i >= 0 ? code.slice(i-200, i+200) : 'VITE_API_BASE NOT FOUND in transformed code!');
      console.error('=== first 300 chars:', code.slice(0, 300));
    }
  },
};

await build({
  root: '/home/user/for-au',
  logLevel: 'error',
  plugins: [react(), trace],
  define: { 'import.meta.env.VITE_API_BASE': JSON.stringify('https://TRACEURL.test') },
  build: { outDir: '/tmp/traceout', emptyOutDir: true, chunkSizeWarningLimit: 1600 },
});
