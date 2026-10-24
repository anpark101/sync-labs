import React, { useState } from 'react';
import { useStore } from '../store';
import type { Character, HandleKey } from '../types';
import { CharAvatar, EmptyState, Field, ImagePick, Sheet, TextArea, TextInput, Toggle } from './ui';
import { IPlus, ITrash, IEdit, ICheck, IBack } from './icons';

const EMOJIS = ['✨', '🌙', '☁️', '🌊', '🔥', '🍀', '', '🦊', '', '🐰', '', '🌸', '', '💫', '⭐', '🌈', '🍑', '', '📸', '', '👑', '', '💙', '💜', '⚡', '', '', '🚲', '', '🎸', '🏀', '☕', '', '🫶'];
const COLORS = ['#7c5cff', '#ff5ca8', '#3b82f6', '#2ec4b6', '#f59e0b', '#ef4444', '#10b981', '#f472b6', '#60a5fa', '#a78bfa', '#94a3b8', '#1e293b'];
const HANDLES: { k: HandleKey; label: string }[] = [
  { k: 'instagram', label: 'Instagram' },
  { k: 'x', label: 'X' },
  { k: 'tiktok', label: 'TikTok' },
  { k: 'whatsapp', label: 'WhatsApp' },
  { k: 'telegram', label: 'Telegram' },
  { k: 'snapchat', label: 'Snapchat' },
  { k: 'reddit', label: 'Reddit' },
  { k: 'facebook', label: 'Facebook' },
];

export default function Characters() {
  const store = useStore();
  const { state, addCharacter, updateCharacter, deleteCharacter } = store;
  const [editing, setEditing] = useState<Character | 'new' | null>(null);
  const [form, setForm] = useState<Partial<Character>>({});
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('✨');
  const [color, setColor] = useState(COLORS[0]);
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const [bio, setBio] = useState('');
  const [verified, setVerified] = useState(false);
  const [handles, setHandles] = useState<Partial<Record<HandleKey, string>>>({});

  const openNew = () => {
    setName(''); setEmoji('✨'); setColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
    setAvatar(undefined); setBio(''); setVerified(false); setHandles({});
    setEditing('new');
  };
  const openEdit = (c: Character) => {
    setName(c.name); setEmoji(c.emoji); setColor(c.color); setAvatar(c.avatar); setBio(c.bio || ''); setVerified(!!c.verified); setHandles(c.handles || {});
    setEditing(c);
  };
  const save = () => {
    if (!name.trim()) return;
    if (editing === 'new') {
      addCharacter({ name: name.trim(), emoji, color, avatar, bio, verified, handles });
    } else if (editing) {
      updateCharacter(editing.id, (c) => ({ ...c, name: name.trim(), emoji, color, avatar, bio, verified, handles }));
    }
    setEditing(null);
  };

  return (
    <div>
      <div className="topbar">
        <div className="brand">
          <div className="brand-logo">👥</div>
          <div className="brand-name">Crew</div>
        </div>
        <button className="btn primary" style={{ width: 'auto', padding: '9px 15px', fontSize: 13 }} onClick={openNew}>
          <IPlus size={15} /> Character
        </button>
      </div>

      <div className="section">
        <div className="hintbox">
          <b>Your cast.</b> Characters are reusable across every AU. Give them handles for each platform — the mocks pull them in automatically (verified badge included 😉).
        </div>
        {state.characters.length === 0 ? (
          <EmptyState emoji="👥" title="No characters yet" sub="Create at least two — one is “you” and the rest are the people in your universe." action={<button className="btn primary" onClick={openNew}>Create your first character</button>} />
        ) : (
          <div className="card">
            {state.characters.map((c) => (
              <div key={c.id} className="char-row">
                <CharAvatar char={c} size={46} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="char-name">
                    {c.name}
                    {c.verified ? <span title="Verified" style={{ color: '#1D9BF0' }}>✔</span> : null}
                  </div>
                  {c.bio ? <div className="char-bio">{c.bio}</div> : null}
                  <div className="char-handles">
                    {HANDLES.filter((h) => c.handles?.[h.k]).slice(0, 4).map((h) => (
                      <span key={h.k} className="char-handle">@{c.handles![h.k]}</span>
                    ))}
                  </div>
                </div>
                <button className="icon-btn" onClick={() => openEdit(c)}><IEdit size={16} /></button>
                <button
                  className="icon-btn danger"
                  onClick={() => {
                    if (confirm(`Delete ${c.name}? They’ll be removed from future mocks (existing posts keep their data).`)) {
                      deleteCharacter(c.id);
                    }
                  }}
                >
                  <ITrash size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Sheet
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing === 'new' ? 'New character' : 'Edit character'}
        footer={
          <>
            <button className="btn primary" onClick={save}><ICheck size={16} /> Save</button>
          </>
        }
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
          <CharAvatar char={{ id: 'x', name, emoji, avatar, color, handles: {}, updatedAt: 0 } as Character} size={64} />
          <div style={{ flex: 1 }}>
            <Field label="Name">
              <TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Minjun" />
            </Field>
            <Field label="Bio" hint="Optional flavor text">
              <TextInput value={bio} onChange={(e) => setBio(e.target.value)} placeholder="tall, quiet, always online" />
            </Field>
          </div>
        </div>

        <Field label="Avatar image" hint="Optional — replaces emoji">
          <ImagePick value={avatar} onChange={setAvatar} maxDim={300} />
        </Field>

        <div className="field">
          <span className="field-label">Emoji avatar</span>
          <div className="emoji-grid">
            {EMOJIS.map((e) => (
              <button key={e} className={emoji === e ? 'sel' : ''} onClick={() => { setEmoji(e); setAvatar(undefined); }}>{e}</button>
            ))}
          </div>
        </div>

        <div className="field">
          <span className="field-label">Accent color</span>
          <div className="color-swatches">
            {COLORS.map((c) => (
              <button key={c} className={'swatch' + (color === c ? ' sel' : '')} style={{ background: c }} onClick={() => setColor(c)} />
            ))}
          </div>
        </div>

        <Field label="Verified badge">
          <Toggle checked={verified} onChange={setVerified} label={verified ? 'Blue check on X / TikTok' : 'No badge'} />
        </Field>

        <span className="field-label">Platform handles</span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
          {HANDLES.map((h) => (
            <div key={h.k} className="field" style={{ marginBottom: 8 }}>
              <TextInput
                value={handles[h.k] || ''}
                onChange={(e) => setHandles({ ...handles, [h.k]: e.target.value.replace(/^@/, '') })}
                placeholder={'@' + h.label.toLowerCase()}
              />
            </div>
          ))}
        </div>
      </Sheet>
    </div>
  );
}
