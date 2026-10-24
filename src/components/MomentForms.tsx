import React, { useState } from 'react';
import { useStore } from '../store';
import type { Character, NotifApp, PlatformId, StoryMessage } from '../types';
import { Field, ImagePick, NumberInput, Segmented, SelectBox, TextArea, TextInput, Toggle } from './ui';
import { ITrash } from './icons';
import { uid } from '../util';

type Cfg = any;

function useChars() {
  const { state } = useStore();
  return state.characters;
}

function CharOpts(chars: Character[], extra: { v: string; label: string }[] = []) {
  return [
    ...extra,
    ...chars.map((c) => ({ v: c.id, label: c.name, avatar: c })),
  ];
}

function ListMove({ idx, len, onMove, onRemove }: { idx: number; len: number; onMove: (d: -1 | 1) => void; onRemove: () => void }) {
  return (
    <span className="msg-move" onClick={(e) => e.stopPropagation()}>
      <button onClick={() => onMove(-1)} style={{ opacity: idx === 0 ? 0.3 : 1 }}>↑</button>
      <button onClick={() => onMove(1)} style={{ opacity: idx === len - 1 ? 0.3 : 1 }}>↓</button>
      <button onClick={onRemove} style={{ color: 'var(--danger)' }}>✕</button>
    </span>
  );
}

const moveInList = <T,>(list: T[], idx: number, d: -1 | 1): T[] => {
  const l = [...list];
  const j = idx + d;
  if (j < 0 || j >= l.length) return l;
  [l[idx], l[j]] = [l[j], l[idx]];
  return l;
};

/* ================= MESSAGE EDITOR (chats) ================= */

const TAPBACKS = ['❤️', '👍', '👎', '😂', '💯', '❓', 'LOVE', 'LIKE', 'LAUGH', 'THANKS'];
const QUICK_REACTIONS = ['❤️', '😂', '', '', '😭', '🫶', '', '💀'];
const NOTIFS: { v: NotifApp; label: string }[] = [
  { v: 'messages', label: 'Messages' },
  { v: 'instagram', label: 'Instagram' },
  { v: 'x', label: 'X' },
  { v: 'tiktok', label: 'TikTok' },
  { v: 'whatsapp', label: 'WhatsApp' },
  { v: 'snapchat', label: 'Snapchat' },
  { v: 'facebook', label: 'Facebook' },
  { v: 'telegram', label: 'Telegram' },
  { v: 'phone', label: 'Phone call' },
  { v: 'mail', label: 'Mail' },
];

function MessageEditor({
  messages,
  onChange,
  platform,
}: {
  messages: StoryMessage[];
  onChange: (ms: StoryMessage[]) => void;
  platform: PlatformId;
}) {
  const chars = useChars();
  const isImsg = platform === 'imessage';
  const hasChecks = platform === 'whatsapp' || platform === 'telegram';
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const set = (i: number, patch: Partial<StoryMessage>) => {
    const ms = [...messages];
    ms[i] = { ...ms[i], ...patch };
    onChange(ms);
  };
  const add = () => {
    onChange([...messages, { id: uid(), sender: 'me', text: '', time: '21:30', status: 'read' }]);
    setOpenIdx(messages.length);
  };

  return (
    <div>
      {messages.map((m, i) => (
        <div className="msg-edit-card" key={m.id}>
          <ListMove idx={i} len={messages.length} onMove={(d) => onChange(moveInList(messages, i, d))} onRemove={() => onChange(messages.filter((_, x) => x !== i))} />
          <div className="msg-edit-head">
            <button
              className="icon-btn"
              style={{ width: 30, height: 30, background: 'var(--surface3)' }}
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
            >
              {openIdx === i ? '−' : '+'}
            </button>
            <div className="field" style={{ flex: 1 }}>
              <SelectBox
                value={m.sender}
                onChange={(v) => set(i, { sender: v })}
                placeholder="Who sends this?"
                options={CharOpts(chars, [{ v: 'me', label: 'You (blue / outgoing)' }])}
              />
            </div>
            <TextInput style={{ width: 84 }} type="time" value={m.time} onChange={(e) => set(i, { time: e.target.value })} />
          </div>

          {openIdx === i ? (
            <div>
              <Field label="Message">
                <TextArea value={m.text || ''} onChange={(e) => set(i, { text: e.target.value })} placeholder="Type the message…" rows={2} />
              </Field>
              <div className="btn-row" style={{ marginBottom: 12 }}>
                <button
                  className={'btn small' + (m.voice ? ' primary' : '')}
                  onClick={() => set(i, { voice: m.voice ? undefined : 14, text: m.voice ? m.text : undefined })}
                >
                  🎙️ Voice note
                </button>
                {m.voice ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <NumberInput style={{ width: 70 }} value={m.voice} onChange={(n) => set(i, { voice: Math.max(1, n) })} />
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>sec</span>
                  </span>
                ) : null}
              </div>
              <ImagePick label="Photo in message" value={m.image} onChange={(v) => set(i, { image: v })} maxDim={1100} />

              <div className="field">
                <span className="field-label">{isImsg ? 'Tapback reaction' : 'Reaction'}</span>
                {isImsg ? (
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                    <button className={'btn small' + (!m.reaction ? ' primary' : '')} onClick={() => set(i, { reaction: undefined })}>None</button>
                    {TAPBACKS.map((t) => (
                      <button key={t} className={'btn small' + (m.reaction === t ? ' primary' : '')} onClick={() => set(i, { reaction: t })}>{t}</button>
                    ))}
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                    <button className={'btn small' + (!m.reaction ? ' primary' : '')} onClick={() => set(i, { reaction: undefined })}>None</button>
                    {QUICK_REACTIONS.map((t) => (
                      <button key={t} className={'btn small' + (m.reaction === t ? ' primary' : '')} onClick={() => set(i, { reaction: t })}>{t}</button>
                    ))}
                  </div>
                )}
              </div>

              {(platform === 'whatsapp' || platform === 'ig_dm') && (
                <Field label="Replying to (quote)" hint="Optional.">
                  <TextInput value={m.quote || ''} onChange={(e) => set(i, { quote: e.target.value || undefined })} placeholder="quoted message text" />
                </Field>
              )}
              {m.sender === 'me' && (isImsg || hasChecks) && (
                <Field label={isImsg ? 'Status (receipt)' : 'Checkmarks'}>
                  <Segmented
                    value={m.status || 'delivered'}
                    onChange={(v) => set(i, { status: v as any })}
                    options={
                      isImsg
                        ? [{ v: 'delivered', label: 'Delivered' }, { v: 'read', label: 'Read ✓' }]
                        : [{ v: 'sent', label: '✓ sent' }, { v: 'delivered', label: '✓✓' }, { v: 'read', label: '✓✓ blue' }]
                    }
                  />
                </Field>
              )}
            </div>
          ) : (
            <div style={{ fontSize: 13, color: m.text ? 'var(--text)' : 'var(--muted)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {m.voice ? `🎙️ voice note (${m.voice}s)` : null}
              {m.image ? ' 🖼️' : null}
              {m.text || <em>empty — tap + to write</em>}
              {m.reaction ? `  [${m.reaction}]` : ''}
            </div>
          )}
        </div>
      ))}
      <button className="btn" onClick={add}>＋ Add message</button>
    </div>
  );
}

/* ================= CHAT FORM (imessage / whatsapp / telegram / snapchat-chat / ig_dm) ================= */

function ChatForm({ platform, cfg, onChange }: { platform: PlatformId; cfg: Cfg; onChange: (c: Cfg) => void }) {
  const chars = useChars();
  const isIgdm = platform === 'ig_dm';
  const set = (patch: Partial<Cfg>) => onChange({ ...cfg, ...patch });
  return (
    <div>
      <Field label={isIgdm ? 'Chat name' : platform === 'imessage' ? 'Contact (shown in header)' : 'Contact / group name'}>
        {cfg.group ? (
          <TextInput value={cfg.title} onChange={(e) => set({ title: e.target.value })} placeholder="Group name, e.g. THE MISSION 🎂" />
        ) : (
          <SelectBox
            value={cfg.members[0] || ''}
            onChange={(v) => set({ members: v ? [v] : [] })}
            placeholder="Pick the contact"
            options={CharOpts(chars)}
          />
        )}
      </Field>
      {!isIgdm ? (
        <Field label="Group chat">
          <Toggle checked={!!cfg.group} onChange={(v) => set({ group: v, title: v ? cfg.title || 'Group' : '' })} label={cfg.group ? 'Group (show names)' : '1-on-1'} />
        </Field>
      ) : (
        <Field label="Group DM">
          <Toggle checked={!!cfg.group} onChange={(v) => set({ group: v, title: v ? cfg.title || 'Group' : '' })} label={cfg.group ? 'Group' : 'Direct'} />
        </Field>
      )}
      {!isIgdm ? (
        <Field label="Status line" hint="Under the name in the header">
          <TextInput
            value={cfg.subtitle}
            onChange={(e) => set({ subtitle: e.target.value })}
            placeholder={platform === 'whatsapp' ? 'online / last seen today at 10:42' : platform === 'telegram' ? 'last seen recently / online' : 'Opened / Active now'}
          />
        </Field>
      ) : (
        <Field label="Active now">
          <Toggle checked={!!cfg.active} onChange={(v) => set({ active: v })} label={cfg.active ? 'Shows “Active now”' : 'Hidden'} />
        </Field>
      )}
      <Field label="Phone time (status bar)">
        <TextInput type="time" value={cfg.time} onChange={(e) => set({ time: e.target.value })} />
      </Field>
      <Field label="Messages">
        <MessageEditor messages={cfg.messages} onChange={(ms) => set({ messages: ms })} platform={platform} />
      </Field>
    </div>
  );
}

/* ================= FEED / STORY / REEL ================= */

function FeedForm({ cfg, onChange }: { cfg: Cfg; onChange: (c: Cfg) => void }) {
  const chars = useChars();
  const set = (patch: Partial<Cfg>) => onChange({ ...cfg, ...patch });
  return (
    <div>
      <Field label="Author">
        <SelectBox value={cfg.author} onChange={(v) => set({ author: v })} placeholder="Pick the character" options={CharOpts(chars)} />
      </Field>
      <ImagePick label="Photo" value={cfg.image} onChange={(v) => set({ image: v })} />
      <Field label="Caption">
        <TextArea value={cfg.caption} onChange={(e) => set({ caption: e.target.value })} placeholder="it’s giving main character energy ✨" />
      </Field>
      <div className="btn-row">
        <Field label="Location" style={{ flex: 1 }}>
          <TextInput value={cfg.location || ''} onChange={(e) => set({ location: e.target.value })} placeholder="Downtown" />
        </Field>
        <Field label="Song" style={{ flex: 1 }}>
          <TextInput value={cfg.song || ''} onChange={(e) => set({ song: e.target.value })} placeholder="song name" />
        </Field>
      </div>
      <div className="btn-row">
        <Field label="Likes" style={{ flex: 1 }}>
          <NumberInput value={cfg.likes} onChange={(n) => set({ likes: n })} />
        </Field>
        <Field label="Posted" style={{ flex: 1 }}>
          <TextInput value={cfg.timeLabel} onChange={(e) => set({ timeLabel: e.target.value })} placeholder="2 HOURS AGO" />
        </Field>
      </div>
      <Field label="“View all…” line" hint="Leave empty to hide">
        <TextInput value={cfg.viewAllLabel} onChange={(e) => set({ viewAllLabel: e.target.value })} placeholder="View all 32 comments" />
      </Field>
      <CommentEditor
        items={cfg.comments}
        onChange={(list) => set({ comments: list })}
        label="Comment preview"
        authorKey="author"
        textKey="text"
        extraNums={[]}
        timeKey=""
      />
    </div>
  );
}

function StoryForm({ cfg, onChange }: { cfg: Cfg; onChange: (c: Cfg) => void }) {
  const chars = useChars();
  const set = (patch: Partial<Cfg>) => onChange({ ...cfg, ...patch });
  return (
    <div>
      <Field label="Who posted the story">
        <SelectBox value={cfg.author} onChange={(v) => set({ author: v })} placeholder="Pick the character" options={CharOpts(chars)} />
      </Field>
      <ImagePick label="Story photo" value={cfg.image} onChange={(v) => set({ image: v || '' })} />
      <div className="btn-row">
        <Field label="Story time" style={{ flex: 1 }}>
          <TextInput type="time" value={cfg.time} onChange={(e) => set({ time: e.target.value })} />
        </Field>
        <Field label="Posted ago" style={{ flex: 1 }}>
          <TextInput value={cfg.ago} onChange={(e) => set({ ago: e.target.value })} placeholder="2h" />
        </Field>
      </div>
      <Field label="Unread ring">
        <Toggle checked={!!cfg.ring} onChange={(v) => set({ ring: v })} label={cfg.ring ? 'Gradient story ring' : 'No ring'} />
      </Field>
    </div>
  );
}

function ReelForm({ cfg, onChange }: { cfg: Cfg; onChange: (c: Cfg) => void }) {
  const chars = useChars();
  const set = (patch: Partial<Cfg>) => onChange({ ...cfg, ...patch });
  return (
    <div>
      <Field label="Reel creator">
        <SelectBox value={cfg.author} onChange={(v) => set({ author: v })} placeholder="Pick the character" options={CharOpts(chars)} />
      </Field>
      <ImagePick label="Video frame" value={cfg.image} onChange={(v) => set({ image: v || '' })} />
      <Field label="Caption">
        <TextArea value={cfg.caption} onChange={(e) => set({ caption: e.target.value })} placeholder="POV: …" />
      </Field>
      <Field label="Audio">
        <TextInput value={cfg.song} onChange={(e) => set({ song: e.target.value })} placeholder="original sound - user" />
      </Field>
      <div className="btn-row">
        <Field label="Likes" style={{ flex: 1 }}>
          <NumberInput value={cfg.likes} onChange={(n) => set({ likes: n })} />
        </Field>
        <Field label="Comments" style={{ flex: 1 }}>
          <NumberInput value={cfg.comments} onChange={(n) => set({ comments: n })} />
        </Field>
      </div>
      <Field label="You follow them?">
        <Toggle checked={!!cfg.following} onChange={(v) => set({ following: v })} label={cfg.following ? 'Following' : 'Follow button'} />
      </Field>
    </div>
  );
}

/* ================= X ================= */

function XForm({ cfg, onChange }: { cfg: Cfg; onChange: (c: Cfg) => void }) {
  const chars = useChars();
  const set = (patch: Partial<Cfg>) => onChange({ ...cfg, ...patch });
  const items = cfg.items as Cfg[];
  const setItem = (i: number, patch: Partial<Cfg>) => {
    const it = [...items];
    it[i] = { ...it[i], ...patch };
    set({ items: it });
  };
  return (
    <div>
      <Field label="Main author">
        <SelectBox value={cfg.author} onChange={(v) => set({ author: v })} placeholder="Pick the character" options={CharOpts(chars)} />
      </Field>
      <Field label="Theme">
        <Segmented value={cfg.theme} onChange={(v) => set({ theme: v })} options={[{ v: 'dark', label: '🌑 Dark' }, { v: 'light', label: '☀️ Light' }]} />
      </Field>
      {items.map((it, i) => (
        <div className="msg-edit-card" key={it.id}>
          <ListMove idx={i} len={items.length} onMove={(d) => set({ items: moveInList(items, i, d) })} onRemove={() => set({ items: items.filter((_, x) => x !== i) })} />
          <div className="field">
            <SelectBox
              value={it.author}
              onChange={(v) => setItem(i, { author: v })}
              placeholder="Who posts this?"
              options={CharOpts(chars, [{ v: 'self', label: 'Same as main author' }])}
            />
          </div>
          <Field label="Post">
            <TextArea value={it.text || ''} onChange={(e) => setItem(i, { text: e.target.value })} rows={3} placeholder="the tweet…" />
          </Field>
          <ImagePick label="Media" value={it.image} onChange={(v) => setItem(i, { image: v })} />
          <div className="btn-row">
            <Field label="Time" style={{ flex: 1 }}>
              <TextInput value={it.time} onChange={(e) => setItem(i, { time: e.target.value })} placeholder="9:41 PM" />
            </Field>
            <Field label="Date" style={{ flex: 1 }}>
              <TextInput value={it.date} onChange={(e) => setItem(i, { date: e.target.value })} placeholder="Oct 24" />
            </Field>
          </div>
          <div className="btn-row">
            <Field label="Replies" style={{ flex: 1 }}>
              <NumberInput value={it.reply} onChange={(n) => setItem(i, { reply: n })} />
            </Field>
            <Field label="Reposts" style={{ flex: 1 }}>
              <NumberInput value={it.repost} onChange={(n) => setItem(i, { repost: n })} />
            </Field>
          </div>
          <div className="btn-row">
            <Field label="Likes" style={{ flex: 1 }}>
              <NumberInput value={it.like} onChange={(n) => setItem(i, { like: n })} />
            </Field>
            <Field label="Views" style={{ flex: 1 }}>
              <NumberInput value={it.view} onChange={(n) => setItem(i, { view: n })} />
            </Field>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <Toggle checked={!!it.liked} onChange={(v) => setItem(i, { liked: v })} label="♥ liked" />
            <Toggle checked={!!it.reposted} onChange={(v) => setItem(i, { reposted: v })} label="↻ reposted" />
          </div>
        </div>
      ))}
      <button className="btn" onClick={() => set({ items: [...items, { id: uid(), author: 'self', text: '', time: '9:41 PM', date: 'Oct 24', reply: 0, repost: 0, like: 0, view: 0, liked: false, reposted: false }] })}>
        ＋ Add to thread
      </button>
    </div>
  );
}

/* ================= TIKTOK ================= */

function TikTokForm({ cfg, onChange }: { cfg: Cfg; onChange: (c: Cfg) => void }) {
  const chars = useChars();
  const set = (patch: Partial<Cfg>) => onChange({ ...cfg, ...patch });
  return (
    <div>
      <Field label="Creator">
        <SelectBox value={cfg.author} onChange={(v) => set({ author: v })} placeholder="Pick the character" options={CharOpts(chars)} />
      </Field>
      <ImagePick label="Video frame" value={cfg.image} onChange={(v) => set({ image: v || '' })} />
      <Field label="Caption" hint="Use #hashtags">
        <TextArea value={cfg.caption} onChange={(e) => set({ caption: e.target.value })} placeholder="POV: … #fyp" />
      </Field>
      <Field label="Audio">
        <TextInput value={cfg.song} onChange={(e) => set({ song: e.target.value })} placeholder="original sound - user" />
      </Field>
      <div className="btn-row">
        <Field label="Likes" style={{ flex: 1 }}>
          <NumberInput value={cfg.likes} onChange={(n) => set({ likes: n })} />
        </Field>
        <Field label="Comments" style={{ flex: 1 }}>
          <NumberInput value={cfg.commentCount} onChange={(n) => set({ commentCount: n })} />
        </Field>
      </div>
      <div className="btn-row">
        <Field label="Saves" style={{ flex: 1 }}>
          <NumberInput value={cfg.saves} onChange={(n) => set({ saves: n })} />
        </Field>
        <Field label="Shares" style={{ flex: 1 }}>
          <NumberInput value={cfg.shares} onChange={(n) => set({ shares: n })} />
        </Field>
      </div>
      <Field label="Comments sheet">
        <Toggle checked={!!cfg.showComments} onChange={(v) => set({ showComments: v })} label={cfg.showComments ? 'Visible' : 'Hidden'} />
      </Field>
      {cfg.showComments ? (
        <CommentEditor
          items={cfg.comments}
          onChange={(list) => set({ comments: list })}
          label="Comments"
          authorKey="author"
          textKey="text"
          extraNums={[{ key: 'likes', label: 'hearts' }]}
          timeKey=""
        />
      ) : null}
    </div>
  );
}

/* ================= SNAPCHAT ================= */

function SnapForm({ cfg, onChange }: { cfg: Cfg; onChange: (c: Cfg) => void }) {
  const chars = useChars();
  const set = (patch: Partial<Cfg>) => onChange({ ...cfg, ...patch });
  return (
    <div>
      <Field label="Mode">
        <Segmented value={cfg.mode} onChange={(v) => set({ mode: v })} options={[{ v: 'chat', label: '💬 Chat' }, { v: 'snap', label: '📸 Snap' }]} />
      </Field>
      {cfg.mode === 'chat' ? (
        <ChatForm platform="snapchat" cfg={cfg} onChange={onChange} />
      ) : (
        <div>
          <Field label="From">
            <SelectBox value={cfg.members[0] || ''} onChange={(v) => set({ members: v ? [v] : [] })} placeholder="Pick the sender" options={CharOpts(chars)} />
          </Field>
          <ImagePick label="Snap photo" value={cfg.snapImage} onChange={(v) => set({ snapImage: v || '' })} />
          <div className="btn-row">
            <Field label="Name (top)" style={{ flex: 1 }}>
              <TextInput value={cfg.snapName} onChange={(e) => set({ snapName: e.target.value })} placeholder="Joon & You" />
            </Field>
            <Field label="Ago" style={{ flex: 1 }}>
              <TextInput value={cfg.snapAgo} onChange={(e) => set({ snapAgo: e.target.value })} placeholder="1d" />
            </Field>
          </div>
          <Field label="Handwritten text" hint="Yellow snap text. Keep it short.">
            <TextInput value={cfg.snapText} onChange={(e) => set({ snapText: e.target.value })} placeholder="you have to see this" />
          </Field>
          <Field label="Doodle">
            <Segmented
              value={cfg.doodle}
              onChange={(v) => set({ doodle: v })}
              options={[
                { v: 'none', label: 'None' },
                { v: 'heart', label: '♥' },
                { v: 'star', label: '★' },
                { v: 'lightning', label: '⚡' },
                { v: 'smile', label: '☺' },
              ]}
            />
          </Field>
          <Field label="Phone time">
            <TextInput type="time" value={cfg.time} onChange={(e) => set({ time: e.target.value })} />
          </Field>
        </div>
      )}
    </div>
  );
}

/* ================= REDDIT / FACEBOOK ================= */

function RedditForm({ cfg, onChange }: { cfg: Cfg; onChange: (c: Cfg) => void }) {
  const chars = useChars();
  const set = (patch: Partial<Cfg>) => onChange({ ...cfg, ...patch });
  return (
    <div>
      <div className="btn-row">
        <Field label="Subreddit" style={{ flex: 1 }}>
          <TextInput value={cfg.sub} onChange={(e) => set({ sub: e.target.value.replace(/^r\//, '') })} placeholder="school" />
        </Field>
        <Field label="Flair" style={{ flex: 1 }}>
          <TextInput value={cfg.flair} onChange={(e) => set({ flair: e.target.value })} placeholder="storytime" />
        </Field>
      </div>
      <Field label="OP">
        <SelectBox value={cfg.author} onChange={(v) => set({ author: v })} placeholder="Pick the character" options={CharOpts(chars)} />
      </Field>
      <Field label="Title">
        <TextInput value={cfg.title} onChange={(e) => set({ title: e.target.value })} placeholder="my rival and I are stuck in a group project" />
      </Field>
      <Field label="Body">
        <TextArea value={cfg.body} onChange={(e) => set({ body: e.target.value })} rows={4} placeholder="full storytime…" />
      </Field>
      <ImagePick label="Image" value={cfg.image} onChange={(v) => set({ image: v })} />
      <div className="btn-row">
        <Field label="Upvotes" style={{ flex: 1 }}>
          <NumberInput value={cfg.score} onChange={(n) => set({ score: n })} />
        </Field>
        <Field label="Comments" style={{ flex: 1 }}>
          <NumberInput value={cfg.commentCount} onChange={(n) => set({ commentCount: n })} />
        </Field>
      </div>
      <Field label="Posted">
        <TextInput value={cfg.timeAgo} onChange={(e) => set({ timeAgo: e.target.value })} placeholder="5h" />
      </Field>
      <CommentEditor
        items={cfg.comments}
        onChange={(list) => set({ comments: list })}
        label="Comments"
        authorKey="author"
        textKey="text"
        extraNums={[{ key: 'score', label: 'upvotes' }]}
        timeKey="timeAgo"
        opFlag
      />
    </div>
  );
}

function FacebookForm({ cfg, onChange }: { cfg: Cfg; onChange: (c: Cfg) => void }) {
  const chars = useChars();
  const set = (patch: Partial<Cfg>) => onChange({ ...cfg, ...patch });
  return (
    <div>
      <Field label="Author">
        <SelectBox value={cfg.author} onChange={(v) => set({ author: v })} placeholder="Pick the character" options={CharOpts(chars)} />
      </Field>
      <Field label="Post text">
        <TextArea value={cfg.text} onChange={(e) => set({ text: e.target.value })} placeholder="I can’t believe we made it…" />
      </Field>
      <ImagePick label="Photo" value={cfg.image} onChange={(v) => set({ image: v })} />
      <div className="btn-row">
        <Field label="Time ago" style={{ flex: 1 }}>
          <TextInput value={cfg.timeAgo} onChange={(e) => set({ timeAgo: e.target.value })} placeholder="2h" />
        </Field>
        <Field label="Privacy" style={{ flex: 1 }}>
          <Segmented value={cfg.privacy} onChange={(v) => set({ privacy: v })} options={[{ v: 'globe', label: '🌐 Public' }, { v: 'friends', label: '👥 Friends' }]} />
        </Field>
      </div>
      <div className="btn-row">
        <Field label="Likes" style={{ flex: 1 }}>
          <NumberInput value={cfg.likes} onChange={(n) => set({ likes: n })} />
        </Field>
        <Field label="Comments" style={{ flex: 1 }}>
          <NumberInput value={cfg.comments} onChange={(n) => set({ comments: n })} />
        </Field>
      </div>
      <Field label="Shares">
        <NumberInput value={cfg.shares} onChange={(n) => set({ shares: n })} />
      </Field>
      <div className="field">
        <span className="field-label">Reaction badges (up to 3)</span>
        {cfg.reactions.slice(0, 3).map((r: Cfg, i: number) => (
          <div className="btn-row" key={i} style={{ marginBottom: 6 }}>
            <span style={{ fontSize: 18, padding: '0 6px' }}>{r.emoji}</span>
            <NumberInput value={r.count} onChange={(n) => {
              const rs = [...cfg.reactions];
              rs[i] = { ...rs[i], count: n };
              set({ reactions: rs });
            }} />
            <button className="icon-btn danger" onClick={() => set({ reactions: cfg.reactions.filter((_: any, x: number) => x !== i) })}>
              <ITrash size={14} />
            </button>
          </div>
        ))}
        <button className="btn small" onClick={() => set({ reactions: [...cfg.reactions, { emoji: '👍', count: 10 }] })}>＋ Add reaction</button>
      </div>
      <Field label="Comments">
        <Toggle checked={!!cfg.showComments} onChange={(v) => set({ showComments: v })} label={cfg.showComments ? 'Visible' : 'Hidden'} />
      </Field>
      {cfg.showComments ? (
        <CommentEditor
          items={cfg.commentList}
          onChange={(list) => set({ commentList: list })}
          label="Comments"
          authorKey="author"
          textKey="text"
          extraNums={[]}
          timeKey="timeAgo"
        />
      ) : null}
    </div>
  );
}

/* ================= LOCKSCREEN ================= */

function LockForm({ cfg, onChange }: { cfg: Cfg; onChange: (c: Cfg) => void }) {
  const set = (patch: Partial<Cfg>) => onChange({ ...cfg, ...patch });
  const notifs = cfg.notifications as Cfg[];
  return (
    <div>
      <ImagePick label="Wallpaper" value={cfg.wallpaper} onChange={(v) => set({ wallpaper: v })} />
      <div className="btn-row">
        <Field label="Lock time" style={{ flex: 1 }}>
          <TextInput type="time" value={cfg.time} onChange={(e) => set({ time: e.target.value })} />
        </Field>
        <Field label="Date" style={{ flex: 1 }}>
          <TextInput value={cfg.date} onChange={(e) => set({ date: e.target.value })} placeholder="Friday, October 24" />
        </Field>
      </div>
      <Field label="Notifications" hint="Top = newest. Max 3 looks best.">
        {notifs.map((n, i) => (
          <div className="msg-edit-card" key={n.id}>
            <ListMove idx={i} len={notifs.length} onMove={(d) => set({ notifications: moveInList(notifs, i, d) })} onRemove={() => set({ notifications: notifs.filter((_, x) => x !== i) })} />
            <div className="btn-row" style={{ marginBottom: 8 }}>
              <Field label="App" style={{ flex: 2 }}>
                <SelectBox value={n.app} onChange={(v) => {
                  const l = [...notifs];
                  l[i] = { ...l[i], app: v };
                  set({ notifications: l });
                }} options={NOTIFS} />
              </Field>
              <Field label="When" style={{ flex: 1 }}>
                <TextInput value={n.time} onChange={(e) => {
                  const l = [...notifs];
                  l[i] = { ...l[i], time: e.target.value };
                  set({ notifications: l });
                }} placeholder="now / 2m" />
              </Field>
            </div>
            <Field label="From (name)">
              <TextInput value={n.name} onChange={(e) => {
                const l = [...notifs];
                l[i] = { ...l[i], name: e.target.value };
                set({ notifications: l });
              }} placeholder="Minjun" />
            </Field>
            <Field label="Message">
              <TextArea rows={2} value={n.body} onChange={(e) => {
                const l = [...notifs];
                l[i] = { ...l[i], body: e.target.value };
                set({ notifications: l });
              }} placeholder="I just keep thinking about you" />
            </Field>
          </div>
        ))}
        <button className="btn" onClick={() => set({ notifications: [...notifs, { id: uid(), app: 'messages', name: '', body: '', time: 'now' }] })}>
          ＋ Add notification
        </button>
      </Field>
    </div>
  );
}

/* ================= GENERIC COMMENT EDITOR ================= */

function CommentEditor({
  items,
  onChange,
  label,
  authorKey,
  textKey,
  extraNums,
  timeKey,
  opFlag,
}: {
  items: Cfg[];
  onChange: (list: Cfg[]) => void;
  label: string;
  authorKey: string;
  textKey: string;
  extraNums: { key: string; label: string }[];
  timeKey: string;
  opFlag?: boolean;
}) {
  const chars = useChars();
  return (
    <div className="field">
      <span className="field-label">{label}</span>
      {items.map((c, i) => (
        <div className="msg-edit-card" key={c.id}>
          <ListMove idx={i} len={items.length} onMove={(d) => onChange(moveInList(items, i, d))} onRemove={() => onChange(items.filter((_, x) => x !== i))} />
          <div className="field" style={{ marginBottom: 8 }}>
            <SelectBox value={c[authorKey]} onChange={(v) => { const l = [...items]; l[i] = { ...l[i], [authorKey]: v }; onChange(l); }} placeholder="Who comments?" options={CharOpts(chars)} />
          </div>
          <Field label="Text">
            <TextInput value={c[textKey] || ''} onChange={(e) => { const l = [...items]; l[i] = { ...l[i], [textKey]: e.target.value }; onChange(l); }} />
          </Field>
          {extraNums.map((n) => (
            <div className="btn-row" key={n.key}>
              <Field label={n.label} style={{ flex: 1 }}>
                <NumberInput value={c[n.key] ?? 0} onChange={(num) => { const l = [...items]; l[i] = { ...l[i], [n.key]: num }; onChange(l); }} />
              </Field>
              {timeKey ? (
                <Field label="Time ago" style={{ flex: 1 }}>
                  <TextInput value={c[timeKey] || ''} onChange={(e) => { const l = [...items]; l[i] = { ...l[i], [timeKey]: e.target.value }; onChange(l); }} placeholder="2h" />
                </Field>
              ) : null}
            </div>
          ))}
          {timeKey && extraNums.length === 0 ? (
            <Field label="Time ago">
              <TextInput value={c[timeKey] || ''} onChange={(e) => { const l = [...items]; l[i] = { ...l[i], [timeKey]: e.target.value }; onChange(l); }} placeholder="2h" />
            </Field>
          ) : null}
          {opFlag ? (
            <Toggle
              checked={!!c.isOP}
              onChange={(v) => { const l = [...items]; l[i] = { ...l[i], isOP: v }; onChange(l); }}
              label="Is OP"
            />
          ) : null}
        </div>
      ))}
      <button
        className="btn"
        onClick={() =>
          onChange([...items, { id: uid(), [authorKey]: '', [textKey]: '', ...(extraNums.reduce((a, n) => ({ ...a, [n.key]: 10 }), {} as Cfg)), ...(timeKey ? { [timeKey]: '1h' } : {}) , isOP: false }])
        }
      >
        ＋ Add
      </button>
    </div>
  );
}

/* ================= DISPATCH ================= */

export default function MomentForms({
  platform,
  config,
  onChange,
}: {
  platform: PlatformId;
  config: any;
  onChange: (cfg: any) => void;
}) {
  const [draft, setDraft] = useState<any>(config);
  const push = (c: any) => {
    setDraft(c);
    onChange(c);
  };
  switch (platform) {
    case 'imessage':
    case 'whatsapp':
    case 'telegram':
    case 'ig_dm':
      return <ChatForm platform={platform} cfg={draft} onChange={push} />;
    case 'ig_feed':
      return <FeedForm cfg={draft} onChange={push} />;
    case 'ig_story':
      return <StoryForm cfg={draft} onChange={push} />;
    case 'ig_reel':
      return <ReelForm cfg={draft} onChange={push} />;
    case 'x':
      return <XForm cfg={draft} onChange={push} />;
    case 'tiktok':
      return <TikTokForm cfg={draft} onChange={push} />;
    case 'snapchat':
      return <SnapForm cfg={draft} onChange={push} />;
    case 'reddit':
      return <RedditForm cfg={draft} onChange={push} />;
    case 'facebook':
      return <FacebookForm cfg={draft} onChange={push} />;
    case 'lockscreen':
      return <LockForm cfg={draft} onChange={push} />;
    default:
      return null;
  }
}
