// Build the web bundle for the Android APK with the cloud API URL baked in.
import { build } from 'vite';
import react from '@vitejs/plugin-react';

const CLOUD_API_BASE = process.env.VITE_API_BASE ?? 'https://3000-ieduek2whtmpzxnj5qt3c.e2b.app';

await build({
  root: new URL('..', import.meta.url).pathname,
  logLevel: 'info',
  plugins: [react()],
  define: {
    'import.meta.env.VITE_API_BASE': JSON.stringify(CLOUD_API_BASE),
  },
  build: {
    outDir: 'dist-apk',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1600,
  },
});
