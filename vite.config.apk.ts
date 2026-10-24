// Vite config for building the web bundle that ships INSIDE the Android APK.
//
// Inside the APK the app is served from the WebView's local origin
// (https://appassets.androidplatform.net), so the cloud-sync API must be
// addressed by an absolute URL — the studio preview host that keeps the
// user's cloud save alive.
//
// The URL is injected by rewriting the API_BASE declaration in src/store.tsx
// at transform time (deterministic, and it survives minification because the
// value is genuinely used by the apiUrl() helper).
//
//   npx vite build -c vite.config.apk.ts --outDir dist-apk --emptyOutDir
//
// To point the APK at a different cloud host, change CLOUD_API_BASE below.
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const CLOUD_API_BASE =
  process.env.VITE_API_BASE ?? 'https://3000-ieduek2whtmpzxnj5qt3c.e2b.app';

function injectCloudApiBase(): Plugin {
  return {
    name: 'apk-cloud-api-base',
    enforce: 'pre',
    transform(code, id) {
      if (!id.endsWith('src/store.tsx')) return null;
      const out = code.replace(
        /export const API_BASE: string =[\s\S]{0,120}?\?\? '';/,
        `export const API_BASE: string = ${JSON.stringify(CLOUD_API_BASE)};`
      );
      if (out === code) {
        throw new Error(
          '[apk-cloud-api-base] API_BASE declaration not found in src/store.tsx — update the regex'
        );
      }
      return { code: out, map: null };
    },
  };
}

export default defineConfig({
  plugins: [injectCloudApiBase(), react()],
  build: {
    outDir: 'dist-apk',
    chunkSizeWarningLimit: 1600,
  },
});
