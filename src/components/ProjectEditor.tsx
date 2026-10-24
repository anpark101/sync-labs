import React, { useState } from 'react';
import { useStore } from '../store';
import { PLATFORMS } from '../types';
import { Field, ImagePick, Sheet, TextArea, TextInput } from './ui';
import { IBack, IDown, IDup, IPlus, ITrash, IDown as IArrowDown, IUp as IArrowUp, platformIcon } from './icons';
import { fileToDataUrl, uid } from '../util';
import type { Moment, PlatformId } from '../types';

export function defaultConfigFor(platform: PlatformId): any {
  const t = '21:30';
  const base = { kind: platform.startsWith('ig') ? platform : 'chat' };
  switch (platform) {
    case 'imessage':
    case 'whatsapp':
    case 'telegram':
      return {
        kind: 'chat',
        title: '',
        members: [],
        group: false,
        subtitle: platform === 'whatsapp' ? 'online' : platform === 'telegram' ? 'last seen recently' : '',
        messages: [{ id: uid(), sender: 'me', text: '', time: t, status: 'read' }],
        time: t,
      };
    case 'ig_dm':
      return { kind: 'ig_dm', title: '', members: [], group: false, active: true, messages: [{ id: uid(), sender: 'me', text: '', time: t }], time: t };
    case 'ig_feed':
      return { kind: 'ig_feed', author: '', image: '', caption: '', location: '', song: '', likes: 1200, timeLabel: '2 HOURS AGO', comments: [], viewAllLabel: 'View all 12 comments' };
    case 'ig_story':
      return { kind: 'ig_story', author: '', image: '', time: t, ago: '2h', ring: true };
    case 'ig_reel':
      return { kind: 'ig_reel', author: '', image: '', caption: '', song: 'original sound', likes: 8000, comments: 320, following: false };
    case 'x':
      return {
        kind: 'x',
        author: '',
        theme: 'dark',
        items: [{ id: uid(), author: 'self', text: '', time: '9:41 PM', date: 'Oct 24', reply: 12, repost: 34, like: 900, view: 12000, liked: false, reposted: false }],
      };
    case 'tiktok':
      return {
        kind: 'tiktok',
        author: '',
        image: '',
        caption: '',
        song: 'original sound',
        likes: 12000,
        commentCount: 430,
        shares: 2100,
        saves: 3400,
        showComments: true,
        comments: [{ id: uid(), author: '', text: '', likes: 24 }],
      };
    case 'snapchat':
      return {
        kind: 'snapchat',
        mode: 'chat',
        title: '',
        members: [],
        subtitle: 'Opened',
        messages: [{ id: uid(), sender: 'me', text: '', time: t }],
        time: t,
        snapImage: '',
        snapName: '',
        snapText: '',
        doodle: 'none',
        snapAgo: '1d',
      };
    case 'reddit':
      return {
        kind: 'reddit',
        sub: 'anonymous',
        author: '',
        flair: 'storytime',
        title: '',
        body: '',
        image: '',
        score: 1200,
        commentCount: 84,
        timeAgo: '3h',
        comments: [{ id: uid(), author: '', text: '', score: 88, isOP: false, timeAgo: '2h' }],
      };
    case 'facebook':
      return {
        kind: 'facebook',
        author: '',
        text: '',
        image: '',
        timeAgo: '2h',
        privacy: 'globe',
        likes: 320,
        comments: 18,
        shares: 4,
        reactions: [
          { emoji: '👍', count: 210 },
          { emoji: '❤️', count: 88 },
        ],
        commentList: [{ id: uid(), author: '', text: '', timeAgo: '1h' }],
        showComments: true,
      };
    case 'lockscreen':
      return {
        kind: 'lockscreen',
        wallpaper: '',
        time: '9:41',
        date: 'Friday, October 24',
        notifications: [{ id: uid(), app: 'messages', name: 'Unknown', body: '…', time: 'now' }],
      };
    default:
      return base;
  }
}

export default function ProjectEditor({
  id,
  back,
  onOpenMoment,
  toast,
}: {
  id: string;
  back: () => void;
  onOpenMoment: (momentId: string) => void;
  toast: (m: string) => void;
}) {
  const { state, updateProject, addCharacter } = useStore();
  const project = state.projects.find((p) => p.id === id);
  const [showAdd, setShowAdd] = useState(false);
  const [editingInfo, setEditingInfo] = useState(false);
  const [cover, setCover] = useState<string | undefined>(project?.cover);
  const [title, setTitle] = useState(project?.title || '');
  const [desc, setDesc] = useState(project?.description || '');
  const [tags, setTags] = useState((project?.tags || []).join(', '));
  const [notes, setNotes] = useState<string | null>(null);

  if (!project) {
    return (
      <div>
        <div className="topbar">
          <button className="icon-btn" onClick={back}><IBack size={18} /></button>
          <div className="title">Missing</div>
        </div>
        <div className="section"><div className="empty"><div className="empty-title">This AU no longer exists</div></div></div>
      </div>
    );
  }

  const move = (idx: number, dir: -1 | 1) => {
    updateProject(id, (p) => {
      const ms = [...p.moments];
      const j = idx + dir;
      if (j < 0 || j >= ms.length) return p;
      [ms[idx], ms[j]] = [ms[j], ms[idx]];
      return { ...p, moments: ms };
    });
  };
  const duplicate = (idx: number) => {
    updateProject(id, (p) => {
      const ms = [...p.moments];
      const copy: Moment = JSON.parse(JSON.stringify(ms[idx]));
      copy.id = uid();
      copy.title = ms[idx].title + ' (copy)';
      ms.splice(idx + 1, 0, copy);
      return { ...p, moments: ms };
    });
    toast('Moment duplicated');
  };
  const remove = (idx: number) => {
    if (!confirm('Delete this moment?')) return;
    updateProject(id, (p) => ({ ...p, moments: p.moments.filter((_, i) => i !== idx) }));
  };
  const addMoment = (platform: PlatformId) => {
    const meta = PLATFORMS.find((p) => p.id === platform)!;
    updateProject(id, (p) => ({
      ...p,
      moments: [...p.moments, { id: uid(), platform, title: `New ${meta.name}`, storyTime: '', notes: '', config: defaultConfigFor(platform), updatedAt: Date.now() }],
    }));
    setShowAdd(false);
    toast('Moment added — tap it to edit');
  };

  const groups = ['Chats', 'Social', 'Screens'] as const;

  return (
    <div>
      <div className="topbar">
        <button className="icon-btn" onClick={back}><IBack size={18} /></button>
        <div className="title">{project.title}</div>
        <button className="icon-btn" title="Edit AU info" onClick={() => { setCover(project.cover); setTitle(project.title); setDesc(project.description); setTags((project.tags || []).join(', ')); setNotes(project.notes as unknown as string ?? ''); setEditingInfo(true); }}>
          ✎
        </button>
      </div>

      <div className="section">
        {/* header card */}
        <div className="card" style={{ padding: '14px', marginBottom: 16, display: 'flex', gap: 14 }}>
          <div className="project-cover" style={{ width: 64, height: 76 }}>
            {project.cover ? <img src={project.cover} alt="" /> : <span>🎭</span>}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="project-title" style={{ fontSize: 17 }}>{project.title}</div>
            {project.description ? <div className="project-desc" style={{ WebkitLineClamp: 3 }}>{project.description}</div> : null}
            <div className="project-meta">
              <span>📸 {project.moments.length} moment{project.moments.length === 1 ? '' : 's'}</span>
              {project.tags?.map((t) => <span key={t} className="tag">#{t}</span>)}
            </div>
            {project.notes ? (
              <div style={{ marginTop: 8, fontSize: 12.5, color: 'var(--muted)', background: 'var(--surface2)', borderRadius: 10, padding: '8px 10px', whiteSpace: 'pre-wrap', maxHeight: 72, overflowY: 'auto' }}>
                📝 {project.notes}
              </div>
            ) : null}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div className="section-title" style={{ margin: 0 }}>Story timeline</div>
          <button className="btn small primary" onClick={() => setShowAdd(true)}>
            <IPlus size={15} /> Add moment
          </button>
        </div>

        {project.moments.length === 0 ? (
          <div className="card">
            <div className="empty">
              <div className="empty-emoji">📸</div>
              <div className="empty-title">No moments yet</div>
              <div className="empty-sub">A moment is one fake screen — a chat, a post, a story, a lock screen. Stack them to tell the story.</div>
              <button className="btn primary" onClick={() => setShowAdd(true)}>Add your first moment</button>
            </div>
          </div>
        ) : (
          <div className="card">
            {project.moments.map((mo, i) => (
              <button key={mo.id} className="moment-row" onClick={() => onOpenMoment(mo.id)}>
                <span className="moment-icon">{platformIcon(mo.platform, 24)}</span>
                <span className="moment-info">
                  <span className="moment-title">{mo.title}</span>
                  <span className="moment-sub">
                    {PLATFORMS.find((p) => p.id === mo.platform)?.name}
                    {mo.storyTime ? <><span>·</span><span className="st">{mo.storyTime}</span></> : null}
                    {mo.notes ? <span>📝</span> : null}
                  </span>
                </span>
                <span className="moment-order" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => move(i, -1)} disabled={i === 0} style={{ opacity: i === 0 ? 0.3 : 1 }}><IArrowUp size={15} /></button>
                  <button onClick={() => move(i, 1)} disabled={i === project.moments.length - 1} style={{ opacity: i === project.moments.length - 1 ? 0.3 : 1 }}><IArrowDown size={15} /></button>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* add moment sheet */}
      <Sheet open={showAdd} onClose={() => setShowAdd(false)} title="Add a moment">
        {groups.map((g) => (
          <div className="ig-grid-group" key={g}>
            <div className="section-title">{g}</div>
            <div className="ig-grid">
              {PLATFORMS.filter((p) => p.group === g).map((p) => (
                <button key={p.id} className="ig-tile" onClick={() => addMoment(p.id)}>
                  <span className="tilebg">{platformIcon(p.id, 24)}</span>
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        ))}
      </Sheet>

      {/* edit AU info sheet */}
      <Sheet
        open={editingInfo}
        onClose={() => setEditingInfo(false)}
        title="Edit AU"
        footer={
          <>
            <button
              className="btn primary"
              onClick={() => {
                updateProject(id, (p) => ({
                  ...p,
                  title: title.trim() || 'Untitled AU',
                  description: desc.trim(),
                  cover,
                  tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
                  notes: notes || '',
                }));
                setEditingInfo(false);
                toast('Saved');
              }}
            >
              Save
            </button>
          </>
        }
      >
        <ImagePick label="Cover image" value={cover} onChange={setCover} maxDim={900} />
        <Field label="Title">
          <TextInput value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label="Description">
          <TextArea value={desc} onChange={(e) => setDesc(e.target.value)} />
        </Field>
        <Field label="Tags" hint="Comma separated. e.g. romance, kpop, school">
          <TextInput value={tags} onChange={(e) => setTags(e.target.value)} placeholder="romance, slowburn" />
        </Field>
        <Field label="Story notes" hint="Your outline: plot, character notes, what happens next.">
          <TextArea rows={5} value={notes || ''} onChange={(e) => setNotes(e.target.value)} placeholder="Day 1: he texts first. Day 2: the tweet. Day 3: the lock screen screenshot that broke me…" />
        </Field>
      </Sheet>
    </div>
  );
}

// keep import used (project notes stored on project.notes via updateProject cast)
export type { Moment };
