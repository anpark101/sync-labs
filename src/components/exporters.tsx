import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import type { Project } from '../types';
import { Mock } from './mocks/Mock';
import type { Character } from '../types';

/** Render a mock node to a 2× PNG data URL. */
export async function exportMomentPng(node: HTMLElement): Promise<string> {
  // make sure webkit images are decoded
  await Promise.all(
    Array.from(node.querySelectorAll('img')).map((img) =>
      img.complete ? Promise.resolve() : new Promise<void>((res) => {
        img.onload = () => res();
        img.onerror = () => res();
        setTimeout(res, 1500);
      })
    )
  );
  return toPng(node, {
    pixelRatio: 2,
    cacheBust: true,
    style: { margin: '0' },
  });
}

/** Export every moment of a project as 2× PNGs into a ZIP, plus a story.txt. */
export async function exportProjectZip(
  project: Project,
  store: { char: (id: string) => Character | undefined; state: { characters: Character[] } }
): Promise<Blob> {
  const host = document.createElement('div');
  host.style.position = 'fixed';
  host.style.left = '-99999px';
  host.style.top = '0';
  host.style.width = '400px';
  host.style.background = 'transparent';
  document.body.appendChild(host);

  const zip = new JSZip();
  const folder = zip.folder(project.title.slice(0, 40).replace(/[^\w\- ]+/g, ''))!;

  try {
    for (let i = 0; i < project.moments.length; i++) {
      const mo = project.moments[i];
      host.innerHTML = '';
      const el = document.createElement('div');
      host.appendChild(el);
      // render React node into el
      const { createRoot } = await import('react-dom/client');
      const root = createRoot(el);
      root.render(<Mock moment={mo} char={store.char} />);
      await new Promise((r) => setTimeout(r, 250));
      await document.fonts?.ready?.catch?.(() => {});
      const dataUrl = await exportMomentPng(el);
      folder.file(`${String(i + 1).padStart(2, '0')}-${mo.title.slice(0, 40).replace(/[^\w\- ]+/g, '') || 'moment'}.png`, dataUrl.split(',')[1], { base64: true });
      root.unmount();
    }
  } finally {
    host.remove();
  }

  const storyLines: string[] = [
    project.title,
    project.description || '',
    '',
    'Story notes: ' + (project.notes || '—'),
    '',
    '— moments —',
    '',
  ];
  project.moments.forEach((mo, i) => {
    storyLines.push(`${i + 1}. [${mo.platform}] ${mo.title}${mo.storyTime ? ' · ' + mo.storyTime : ''}`);
    if (mo.notes) storyLines.push(`   note: ${mo.notes}`);
  });
  storyLines.push('', 'Made with AUverse Studio — fictional social media AU creator.');
  zip.file('story.txt', storyLines.join('\n'));

  return zip.generateAsync({ type: 'blob' });
}
