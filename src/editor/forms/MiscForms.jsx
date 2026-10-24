import React from 'react'
import {
  AddButton,
  CastSelect,
  Field,
  ImageField,
  NumField,
  RepeatItem,
  Section,
  TextArea,
  TextInput,
  Toggle,
} from '../fields.jsx'
import { uid } from '../../lib/util.js'

const move = (arr, from, to) => {
  if (to < 0 || to >= arr.length) return arr
  const copy = [...arr]
  const [x] = copy.splice(from, 1)
  copy.splice(to, 0, x)
  return copy
}

/* ------------------------------- TikTok ------------------------------ */
export function TikTokVideoForm({ project, data, set }) {
  return (
    <Section title="Video" hint="The full-screen vertical post. A cover image is your video’s first frame.">
      <div className="stack" style={{ gap: 13 }}>
        <CastSelect project={project} label="Creator" value={data.castId} onChange={(v) => set({ castId: v })} />
        <ImageField value={data.cover} onChange={(cover) => set({ cover })} label="Video cover" hint="portrait works best" />
        <Field label="Caption"><TextArea rows={3} value={data.caption || ''} onChange={(e) => set({ caption: e.target.value })} /></Field>
        <div className="field-row">
          <Field label="Sound"><TextInput value={data.music || ''} onChange={(e) => set({ music: e.target.value })} placeholder="original sound" /></Field>
          <Field label="Sound credit"><TextInput value={data.musicArtist || ''} onChange={(e) => set({ musicArtist: e.target.value })} placeholder="ariwrites" /></Field>
        </div>
        <div className="field-row three">
          <Field label="Likes"><NumField value={data.likes} onChange={(v) => set({ likes: v })} /></Field>
          <Field label="Comments"><NumField value={data.comments} onChange={(v) => set({ comments: v })} /></Field>
          <Field label="Saves"><NumField value={data.saves} onChange={(v) => set({ saves: v })} /></Field>
        </div>
        <div className="field-row">
          <Field label="Shares"><NumField value={data.shares} onChange={(v) => set({ shares: v })} /></Field>
          <div className="stack" style={{ justifyContent: 'flex-end', gap: 9 }}>
            <Toggle checked={data.liked} onChange={(v) => set({ liked: v })} label="Liked" />
            <Toggle checked={data.saved} onChange={(v) => set({ saved: v })} label="Saved" />
          </div>
        </div>
        <Toggle checked={data.showNav !== false} onChange={(v) => set({ showNav: v })} label="Show TikTok tab bar" />
      </div>
    </Section>
  )
}

export function TikTokProfileForm({ project, data, set }) {
  const videos = data.videos || []
  const update = (i, patch) => set({ videos: videos.map((v, j) => (j === i ? { ...v, ...patch } : v)) })
  return (
    <>
      <Section title="Profile">
        <div className="stack" style={{ gap: 13 }}>
          <CastSelect project={project} label="Creator" value={data.castId} onChange={(v) => set({ castId: v })} />
          <Field label="Bio"><TextArea rows={2} value={data.bio || ''} onChange={(e) => set({ bio: e.target.value })} /></Field>
          <Field label="Link"><TextInput value={data.link || ''} onChange={(e) => set({ link: e.target.value })} placeholder="linktr.ee/…" /></Field>
          <div className="field-row three">
            <Field label="Followers"><NumField value={data.followers} onChange={(v) => set({ followers: v })} /></Field>
            <Field label="Following"><NumField value={data.following} onChange={(v) => set({ following: v })} /></Field>
            <Field label="Total likes"><NumField value={data.likes} onChange={(v) => set({ likes: v })} /></Field>
          </div>
        </div>
      </Section>
      <Section title="Videos" hint="Three across. Add the thumbnails and view counts." action={<span className="pill">{videos.length}</span>}>
        <div className="stack" style={{ gap: 8 }}>
          {videos.map((v, i) => (
            <RepeatItem
              key={v.id || i}
              index={i}
              title={`Video ${i + 1}`}
              subtitle={v.views ? `${v.views.toLocaleString()} views` : ''}
              onRemove={() => set({ videos: videos.filter((_, j) => j !== i) })}
              onUp={i > 0 ? () => set({ videos: move(videos, i, i - 1) }) : null}
              onDown={i < videos.length - 1 ? () => set({ videos: move(videos, i, i + 1) }) : null}
            >
              <div className="stack" style={{ gap: 10 }}>
                <ImageField value={v.image} onChange={(image) => update(i, { image })} label="Thumbnail" square />
                <div className="field-row">
                  <Field label="Views"><NumField value={v.views} onChange={(val) => update(i, { views: val })} /></Field>
                  <div className="stack" style={{ justifyContent: 'flex-end', paddingBottom: 6 }}>
                    <Toggle checked={v.pinned} onChange={(val) => update(i, { pinned: val })} label="Pinned" />
                  </div>
                </div>
              </div>
            </RepeatItem>
          ))}
          <AddButton onClick={() => set({ videos: [...videos, { id: uid('v'), image: '', views: 0 }] })}>Add video thumbnail</AddButton>
        </div>
      </Section>
    </>
  )
}

/* ------------------------------- Spotify ----------------------------- */
export function SpotifyForm({ project, data, set }) {
  return (
    <>
      <Section title="Now playing" hint="The screenshot that says what words can’t.">
        <div className="stack" style={{ gap: 13 }}>
          <div className="field-row">
            <Field label="Song title"><TextInput value={data.title || ''} onChange={(e) => set({ title: e.target.value })} /></Field>
            <Field label="Artist"><TextInput value={data.artist || ''} onChange={(e) => set({ artist: e.target.value })} /></Field>
          </div>
          <Field label="Album"><TextInput value={data.album || ''} onChange={(e) => set({ album: e.target.value })} /></Field>
          <ImageField value={data.cover} onChange={(cover) => set({ cover })} label="Album art" square />
          <Field label="Playlist name"><TextInput value={data.playlist || ''} onChange={(e) => set({ playlist: e.target.value })} placeholder="songs for the drive home" /></Field>
          <div className="field-row">
            <Field label="Progress (%)"><NumField value={data.progress} min={0} onChange={(v) => set({ progress: Math.min(100, v) })} /></Field>
            <Field label="Length (seconds)"><NumField value={data.duration} onChange={(v) => set({ duration: v })} /></Field>
          </div>
          <Field label="Accent colour" hint="background glow">
            <div className="row">
              <input type="color" value={data.accent || '#4a3b52'} onChange={(e) => set({ accent: e.target.value })} style={{ width: 46, height: 42, borderRadius: 10, border: '1px solid var(--line)', background: 'transparent' }} />
              <TextInput value={data.accent || ''} onChange={(e) => set({ accent: e.target.value })} placeholder="#4a3b52" />
            </div>
          </Field>
          <Field label="Hidden note" hint="optional lyric or thought"><TextArea rows={2} value={data.note || ''} onChange={(e) => set({ note: e.target.value })} /></Field>
          <div className="field-row">
            <CastSelect project={project} label="Character" value={data.castId} onChange={(v) => set({ castId: v })} includeEmpty emptyLabel="No character" />
            <div className="stack" style={{ justifyContent: 'flex-end', gap: 9 }}>
              <Toggle checked={data.liked} onChange={(v) => set({ liked: v })} label="Liked (green heart)" />
            </div>
          </div>
          <Toggle checked={data.showNav !== false} onChange={(v) => set({ showNav: v })} label="Show Spotify tab bar" />
        </div>
      </Section>
    </>
  )
}

/* ------------------------------- YouTube ----------------------------- */
export function YouTubeForm({ project, data, set }) {
  const comments = data.comments || []
  const update = (i, patch) => set({ comments: comments.map((c, j) => (j === i ? { ...c, ...patch } : c)) })
  return (
    <>
      <Section title="Video">
        <div className="stack" style={{ gap: 13 }}>
          <CastSelect project={project} label="Channel character" value={data.castId} onChange={(v) => set({ castId: v })} />
          <Field label="Channel name" hint="leave blank to use the character name"><TextInput value={data.channelName || ''} onChange={(e) => set({ channelName: e.target.value })} /></Field>
          <ImageField value={data.thumb} onChange={(thumb) => set({ thumb })} label="Thumbnail" hint="16:9 crop" />
          <Field label="Video title"><TextArea rows={2} value={data.title || ''} onChange={(e) => set({ title: e.target.value })} /></Field>
          <div className="field-row">
            <Field label="Views"><NumField value={data.views} onChange={(v) => set({ views: v })} /></Field>
            <Field label="Uploaded"><TextInput value={data.uploaded || ''} onChange={(e) => set({ uploaded: e.target.value })} placeholder="2 days ago" /></Field>
          </div>
          <div className="field-row">
            <Field label="Likes"><NumField value={data.likes} onChange={(v) => set({ likes: v })} /></Field>
            <Field label="Subscribers"><NumField value={data.subscribers || 0} onChange={(v) => set({ subscribers: v })} /></Field>
          </div>
          <div className="field-row">
            <Field label="Comment count"><NumField value={data.commentCount || 0} onChange={(v) => set({ commentCount: v })} /></Field>
            <div className="stack" style={{ justifyContent: 'flex-end', paddingBottom: 6 }}>
              <Toggle checked={data.subscribed} onChange={(v) => set({ subscribed: v })} label="Subscribed" />
            </div>
          </div>
          <Field label="Description" hint="optional"><TextArea rows={2} value={data.description || ''} onChange={(e) => set({ description: e.target.value })} /></Field>
        </div>
      </Section>
      <Section title="Comments" action={<span className="pill">{comments.length}</span>}>
        <div className="stack" style={{ gap: 8 }}>
          {comments.map((c, i) => (
            <RepeatItem
              key={c.id || i}
              index={i}
              title={c.text || 'Empty comment'}
              subtitle={c.user ? `@${c.user}` : ''}
              onRemove={() => set({ comments: comments.filter((_, j) => j !== i) })}
              onUp={i > 0 ? () => set({ comments: move(comments, i, i - 1) }) : null}
              onDown={i < comments.length - 1 ? () => set({ comments: move(comments, i, i + 1) }) : null}
            >
              <div className="stack" style={{ gap: 10 }}>
                <Field label="Username"><TextInput value={c.user || ''} onChange={(e) => update(i, { user: e.target.value })} placeholder="smalltownfan" /></Field>
                <Field label="Comment"><TextArea rows={2} value={c.text || ''} onChange={(e) => update(i, { text: e.target.value })} /></Field>
                <div className="field-row">
                  <Field label="Likes"><NumField value={c.likes} onChange={(v) => update(i, { likes: v })} /></Field>
                  <Field label="Time"><TextInput value={c.time || ''} onChange={(e) => update(i, { time: e.target.value })} placeholder="1 day ago" /></Field>
                </div>
              </div>
            </RepeatItem>
          ))}
          <AddButton onClick={() => set({ comments: [...comments, { id: uid('yc'), user: '', text: '', likes: 0, time: '1 day ago' }] })}>Add comment</AddButton>
        </div>
      </Section>
    </>
  )
}

/* ------------------------------- Reddit ------------------------------ */
export function RedditForm({ project, data, set }) {
  const comments = data.comments || []
  const update = (i, patch) => set({ comments: comments.map((c, j) => (j === i ? { ...c, ...patch } : c)) })
  const updateReply = (i, k, patch) =>
    set({ comments: comments.map((c, j) => (j === i ? { ...c, replies: (c.replies || []).map((r, z) => (z === k ? { ...r, ...patch } : r)) } : c)) })
  return (
    <>
      <Section title="Post">
        <div className="stack" style={{ gap: 13 }}>
          <div className="field-row">
            <Field label="Subreddit" hint="without r/"><TextInput value={data.subreddit || ''} onChange={(e) => set({ subreddit: e.target.value })} placeholder="AmITheAsshole" /></Field>
            <Field label="Flair"><TextInput value={data.flair || ''} onChange={(e) => set({ flair: e.target.value })} placeholder="Not the A-hole" /></Field>
          </div>
          <CastSelect project={project} label="Poster (OP)" value={data.castId} onChange={(v) => set({ castId: v })} />
          <Field label="Title"><TextArea rows={2} value={data.title || ''} onChange={(e) => set({ title: e.target.value })} /></Field>
          <Field label="Body"><TextArea rows={4} value={data.body || ''} onChange={(e) => set({ body: e.target.value })} /></Field>
          <ImageField value={data.image} onChange={(image) => set({ image })} label="Attached image" hint="optional" />
          <div className="field-row three">
            <Field label="Upvotes"><NumField value={data.votes} onChange={(v) => set({ votes: v })} /></Field>
            <Field label="Comments"><NumField value={data.commentCount || 0} onChange={(v) => set({ commentCount: v })} /></Field>
            <Field label="Members"><NumField value={data.members || 0} onChange={(v) => set({ members: v })} /></Field>
          </div>
          <Field label="Posted"><TextInput value={data.time || ''} onChange={(e) => set({ time: e.target.value })} placeholder="9h" /></Field>
        </div>
      </Section>
      <Section title="Comments" hint="Nested replies show one level deep in the preview." action={<span className="pill">{comments.length}</span>}>
        <div className="stack" style={{ gap: 8 }}>
          {comments.map((c, i) => (
            <RepeatItem
              key={c.id || i}
              index={i}
              title={c.text || 'Empty comment'}
              subtitle={`u/${c.user || 'someone'}`}
              onRemove={() => set({ comments: comments.filter((_, j) => j !== i) })}
              onUp={i > 0 ? () => set({ comments: move(comments, i, i - 1) }) : null}
              onDown={i < comments.length - 1 ? () => set({ comments: move(comments, i, i + 1) }) : null}
            >
              <div className="stack" style={{ gap: 10 }}>
                <div className="field-row">
                  <Field label="Username"><TextInput value={c.user || ''} onChange={(e) => update(i, { user: e.target.value })} placeholder="throwaway_9210" /></Field>
                  <Field label="Upvotes"><NumField value={c.votes} onChange={(v) => update(i, { votes: v })} /></Field>
                </div>
                <Field label="Comment"><TextArea rows={2} value={c.text || ''} onChange={(e) => update(i, { text: e.target.value })} /></Field>
                <Field label="Time"><TextInput value={c.time || ''} onChange={(e) => update(i, { time: e.target.value })} placeholder="5h" /></Field>
                <div className="field">
                  <span className="label">Replies</span>
                  <div className="stack" style={{ gap: 8 }}>
                    {(c.replies || []).map((r, k) => (
                      <div className="mini-panel" key={r.id || k}>
                        <div className="field-row">
                          <Field label="User"><TextInput value={r.user || ''} onChange={(e) => updateReply(i, k, { user: e.target.value })} /></Field>
                          <Field label="Upvotes"><NumField value={r.votes} onChange={(v) => updateReply(i, k, { votes: v })} /></Field>
                        </div>
                        <Field label="Reply"><TextArea rows={2} value={r.text || ''} onChange={(e) => updateReply(i, k, { text: e.target.value })} /></Field>
                        <div className="row" style={{ justifyContent: 'flex-end' }}>
                          <button className="btn btn-ghost btn-xs" onClick={() => update(i, { replies: (c.replies || []).filter((_, z) => z !== k) })}>Remove reply</button>
                        </div>
                      </div>
                    ))}
                    <button
                      className="btn btn-ghost btn-xs"
                      onClick={() => update(i, { replies: [...(c.replies || []), { id: uid('rr'), user: '', text: '', votes: 0, time: '1h' }] })}
                    >
                      + Add reply
                    </button>
                  </div>
                </div>
              </div>
            </RepeatItem>
          ))}
          <AddButton onClick={() => set({ comments: [...comments, { id: uid('rc'), user: '', text: '', votes: 0, time: '9h', replies: [] }] })}>Add comment</AddButton>
        </div>
      </Section>
    </>
  )
}
