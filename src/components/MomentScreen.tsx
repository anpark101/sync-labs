import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../store';
import { Mock } from './mocks/Mock';
import { platformMeta } from '../types';
import { Field, Sheet, TextArea, TextInput, Toggle } from './ui';
import { IBack, ICopy, IDown, IDup, IDown as IArrowDown, IUp as IArrowUp, ITrash, IDup as IDupIcon, IDrama, ICheck } from './icons';
import { downloadDataUrl, slug, uid } from '../util';
import MomentForms from './MomentForms';
import { exportMomentPng, exportProjectZip } from './exporters.tsx';

export default function MomentScreen({
  projectId,
  momentId,
  back,
  toast,
}: {
  projectId: string;
  momentId: string;
  back: () => void;
  toast: (m: string) => void;
}) {
  const store = useStore();
  const project = store.state.projects.find((p) => p.id === projectId);
  const moment = project?.moments.find((m) => m.id === momentId);
  const [editing, setEditing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const mockRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const fit = () => {
      const w = el.clientWidth - 8;
      setScale(Math.min(1, w / 400));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [moment?.platform]);

  if (!project || !moment) {
    return (
      <div>
        <div className="topbar">
          <button className="icon-btn" onClick={back}><IBack size={18} /></button>
          <div className="title">Missing</div>
        </div>
      </div>
    );
  }

  const meta = platformMeta(moment.platform);
  const idx = project.moments.findIndex((m) => m.id === momentId);

  const update = (fn: (m: import('../types').Moment) => import('../types').Moment) => {
    store.updateProject(projectId, (p) => ({
      ...p,
      moments: p.moments.map((m) => (m.id === momentId ? { ...fn(m), updatedAt: Date.now() } : m)),
    }));
  };

  const doExport = async () => {
    if (!mockRef.current) return;
    setExporting(true);
    toast('Rendering 2× image…');
    try {
      const dataUrl = await exportMomentPng(mockRef.current);
      downloadDataUrl(dataUrl, `${slug(project.title)}-${slug(moment.title)}-2x.png`);
      toast('PNG downloaded (2×)');
    } catch (e) {
      console.error(e);
      toast('Export failed — try a smaller image');
    }
    setExporting(false);
  };

  const doZip = async () => {
    setExporting(true);
    toast('Building ZIP of every moment…');
    try {
      const blob = await exportProjectZip(project, store);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${slug(project.title)}-all-moments.zip`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 8000);
      toast('ZIP downloaded');
    } catch (e) {
      console.error(e);
      toast('ZIP failed — try again');
    }
    setExporting(false);
  };

  return (
    <div>
      <div className="topbar">
        <button className="icon-btn" onClick={back}><IBack size={18} /></button>
        <div className="title" style={{ display: 'flex', flexDirection: 'column' }}>
          {moment.title}
          <span style={{ fontSize: 11.5, color: 'var(--muted)', fontWeight: 600 }}>{meta.name}</span>
        </div>
        <button className="icon-btn" title="Move up" onClick={() => moveMoment(store, projectId, idx, -1)}><IArrowUp size={16} /></button>
        <button className="icon-btn" title="Move down" onClick={() => moveMoment(store, projectId, idx, 1)}><IArrowDown size={16} /></button>
        <button className="icon-btn" title="Duplicate" onClick={() => { dupMoment(store, projectId, momentId); toast('Duplicated'); }}><ICopy size={15} /></button>
        <button
          className="icon-btn danger"
          title="Delete"
          onClick={() => {
            if (confirm('Delete this moment?')) {
              store.updateProject(projectId, (p) => ({ ...p, moments: p.moments.filter((m) => m.id !== momentId) }));
              back();
              toast('Moment deleted');
            }
          }}
        >
          <ITrash size={15} />
        </button>
      </div>

      <div className="preview-stage" ref={stageRef} style={{ background: 'radial-gradient(120% 90% at 50% 0%, #191b26 0%, #0d0e13 70%)' }}>
        <div className="preview-scale" style={{ transform: `scale(${scale})`, height: scale < 1 ? 860 * scale : 'auto' }}>
          <div ref={mockRef} className="mock">
            <Mock moment={moment} char={store.char} />
          </div>
        </div>
      </div>

      <div className="section" style={{ paddingTop: 8 }}>
        <div className="btn-row" style={{ marginBottom: 12 }}>
          <button className="btn primary" onClick={doExport} disabled={exporting}>
            {exporting ? <span className="spin">⚙️</span> : '📤'} Export PNG (2×)
          </button>
          <button className="btn" onClick={() => setEditing(true)}>✏️ Edit</button>
        </div>
        <div className="btn-row" style={{ marginBottom: 16 }}>
          <button className="btn" onClick={doZip} disabled={exporting}>🗂️ ZIP all moments</button>
        </div>

        <div className="card" style={{ padding: 14 }}>
          <Field label="In-story time" hint="How you want to label this moment in your thread (e.g. Day 1 · 21:44)">
            <TextInput value={moment.storyTime} onChange={(e) => update((m) => ({ ...m, storyTime: e.target.value }))} placeholder="Day 1 · 21:44" />
          </Field>
          <Field label="Notes for you" hint="Only you see this. Plot reminders, next scene, song ideas…">
            <TextArea value={moment.notes} onChange={(e) => update((m) => ({ ...m, notes: e.target.value }))} placeholder="He replies in 3 minutes. Next: the story." />
          </Field>
          <Field label="Title">
            <TextInput value={moment.title} onChange={(e) => update((m) => ({ ...m, title: e.target.value }))} />
          </Field>
        </div>
      </div>

      <Sheet
        open={editing}
        onClose={() => setEditing(false)}
        title={`Edit · ${meta.name}`}
        footer={<button className="btn primary" onClick={() => setEditing(false)}><ICheck size={16} /> Done (autosaved)</button>}
      >
        <MomentForms platform={moment.platform} config={moment.config} onChange={(cfg) => update((m) => ({ ...m, config: cfg }))} />
      </Sheet>
    </div>
  );
}

function moveMoment(store: ReturnType<typeof useStore>, projectId: string, idx: number, dir: -1 | 1) {
  store.updateProject(projectId, (p) => {
    const ms = [...p.moments];
    const j = idx + dir;
    if (j < 0 || j >= ms.length) return p;
    [ms[idx], ms[j]] = [ms[j], ms[idx]];
    return { ...p, moments: ms };
  });
}

function dupMoment(store: ReturnType<typeof useStore>, projectId: string, momentId: string) {
  store.updateProject(projectId, (p) => {
    const i = p.moments.findIndex((m) => m.id === momentId);
    if (i < 0) return p;
    const copy: any = JSON.parse(JSON.stringify(p.moments[i]));
    copy.id = uid();
    copy.title = p.moments[i].title + ' (copy)';
    copy.updatedAt = Date.now();
    const ms = [...p.moments];
    ms.splice(i + 1, 0, copy);
    return { ...p, moments: ms };
  });
}
