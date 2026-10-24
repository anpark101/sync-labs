export const uid = (): string =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

/** 1234 -> "1.2K", 1500000 -> "1.5M" (TikTok/X style) */
export function fmtNum(n: number): string {
  if (!isFinite(n)) return '0';
  if (n >= 1_000_000) return trim(n / 1_000_000) + 'M';
  if (n >= 1_000) return trim(n / 1_000) + 'K';
  return String(n);
}
const trim = (v: number) => {
  const s = v >= 100 ? Math.round(v).toString() : (Math.round(v * 10) / 10).toString();
  return s.replace(/\.0$/, '');
};

export const fmtCount = (n: number) => n.toLocaleString('en-US');

/** Deterministic pseudo-random 0..1 from a string seed (stable waveform bars etc.) */
export function seeded(seed: string, i: number): number {
  let h = 2166136261;
  const s = seed + ':' + i;
  for (let c = 0; c < s.length; c++) {
    h ^= s.charCodeAt(c);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 1000) / 1000;
}

export function timeAgo(ts: number): string {
  const d = Date.now() - ts;
  const m = Math.floor(d / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return m + 'm ago';
  const h = Math.floor(m / 60);
  if (h < 24) return h + 'h ago';
  const days = Math.floor(h / 24);
  if (days < 7) return days + 'd ago';
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export const slug = (s: string) =>
  (s || 'au')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40) || 'au';

/** Read a File, downscale to maxDim, return a compressed JPEG dataURL (PNG kept for <400px to preserve avatar crispness). */
export function fileToDataUrl(file: File, maxDim: number, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('read failed'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('decode failed'));
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, w, h);
        const isPng = w < 400 && h < 400;
        resolve(isPng ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export async function estimateSize(): Promise<number> {
  try {
    const txt = await (await import('idb-keyval')).get<string>('auverse-state');
    return txt ? new Blob([txt]).size : 0;
  } catch {
    return 0;
  }
}

export function fmtBytes(n: number): string {
  if (n < 1024) return n + ' B';
  if (n < 1024 * 1024) return (n / 1024).toFixed(0) + ' KB';
  return (n / (1024 * 1024)).toFixed(1) + ' MB';
}
