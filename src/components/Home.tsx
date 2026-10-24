import React, { useState } from 'react';
import { useStore } from '../store';
import type { Screen } from './App';
import { SyncPill } from './App';
import { EmptyState, Field, Sheet, TextArea, TextInput } from './ui';
import { ICopy, IPlus, ISearch, ITrash, platformIcon, IcoLockscreen } from './icons';
import { platformMeta } from '../types';
import { timeAgo } from '../util';

export default function Home({ onOpen, onTab, toast }: { onOpen: (id: string) => void; onTab: (s: Screen) => void; toast: (m: string) => void }) {
  const { state, addProject, duplicateProject, deleteProject } = useStore();
  const [q, setQ] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const projects = state.projects.filter(
    (p) => !q || p.title.toLowerCase().includes(q.toLowerCase()) || (p.description || '').toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div>
      <div className="topbar">
        <div className="brand">
          <div className="brand-logo">AU</div>
          <div className="brand-name">
            AUverse <em>Studio</em>
          </div>
        </div>
        <SyncPill />
      </div>

      <div className="section">
        <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <ISearch size={16} style={{ position: 'absolute', left: 12, top: 12, opacity: 0.5 }} />
            <input className="input" style={{ paddingLeft: 36 }} placeholder="Search your AUs…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <button className="btn primary" style={{ width: 'auto', padding: '11px 16px' }} onClick={() => setShowNew(true)}>
            <IPlus size={17} /> New
          </button>
        </div>

        {projects.length === 0 ? (
          <EmptyState
            emoji="🎬"
            title={q ? 'No AUs match your search' : 'Your universe is empty'}
            sub={q ? 'Try a different name or tag.' : 'Start your first social media AU — a fake iMessage thread, an Instagram post, an X thread, a TikTok, a lock screen. Anything.'}
            action={
              <div className="btn-row">
                <button className="btn primary" onClick={() => setShowNew(true)}>Create a blank AU</button>
                <button className="btn" onClick={() => onTab({ name: 'tools' })}>Browse templates</button>
              </div>
            }
          />
        ) : (
          <>
            <div className="section-title">
              Your AUs · {projects.length}
            </div>
            {projects.map((p) => (
              <div key={p.id} className="card" style={{ marginBottom: 12 }}>
                <button className="project-card" onClick={() => onOpen(p.id)}>
                  <div className="project-cover">
                    {p.cover ? <img src={p.cover} alt="" /> : <span>🎭</span>}
                  </div>
                  <div className="project-info">
                    <div className="project-title">{p.title}</div>
                    {p.description ? <div className="project-desc">{p.description}</div> : null}
                    <div className="project-meta">
                      <span>📸 {p.moments.length} moment{p.moments.length === 1 ? '' : 's'}</span>
                      <span>·</span>
                      <span>{timeAgo(p.updatedAt)}</span>
                      {p.tags?.slice(0, 2).map((t) => (
                        <span key={t} className="tag">#{t}</span>
                      ))}
                    </div>
                  </div>
                </button>
                <div style={{ display: 'flex', borderTop: '1px solid var(--line)' }}>
                  <button className="settings-row" style={{ flex: 1, padding: '9px 12px' }} onClick={() => { duplicateProject(p.id); toast('AU duplicated'); }}>
                    <ICopy size={15} style={{ marginRight: 7 }} /> Duplicate
                  </button>
                  <button
                    className="settings-row"
                    style={{ flex: 1, padding: '9px 12px', color: 'var(--danger)' }}
                    onClick={() => {
                      if (confirm(`Delete “${p.title}”? This can’t be undone.`)) {
                        deleteProject(p.id);
                        toast('AU deleted');
                      }
                    }}
                  >
                    <ITrash size={15} style={{ marginRight: 7 }} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <Sheet
        open={showNew}
        onClose={() => setShowNew(false)}
        title="New AU"
        footer={
          <>
            <button
              className="btn primary"
              onClick={() => {
                if (!title.trim()) return;
                const p = addProject({ title: title.trim(), description: desc.trim() });
                setShowNew(false);
                setTitle('');
                setDesc('');
                onOpen(p.id);
                toast('Saved to your device + cloud');
              }}
            >
              Create AU
            </button>
          </>
        }
      >
        <Field label="Title">
          <TextInput autoFocus placeholder="e.g. The 3AM Group Chat" value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label="Description" hint="One line about the vibe. Optional.">
          <TextArea placeholder="What happens in this universe?" value={desc} onChange={(e) => setDesc(e.target.value)} />
        </Field>
        <div className="hintbox">
          <b>Tip:</b> add characters in the <b>Crew</b> tab first, then build each moment. Everything autosaves — locally the instant you type, and to the cloud a second later.
        </div>
      </Sheet>
    </div>
  );
}
