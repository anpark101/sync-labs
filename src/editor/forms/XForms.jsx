import React from 'react'
import {
  AddButton,
  CastSelect,
  Field,
  ImageField,
  ImageListField,
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

export function XPostForm({ project, data, set }) {
  const replies = data.repliesList || []
  const updateReply = (i, patch) => set({ repliesList: replies.map((r, j) => (j === i ? { ...r, ...patch } : r)) })
  return (
    <>
      <Section title="Post" hint="Text is rendered at the real timeline size, with hashtags and mentions highlighted.">
        <div className="stack" style={{ gap: 13 }}>
          <CastSelect project={project} label="Posted by" value={data.castId} onChange={(v) => set({ castId: v })} />
          <Field label="Post text" hint={`${(data.text || '').length}/280-ish`}>
            <TextArea rows={4} value={data.text || ''} onChange={(e) => set({ text: e.target.value })} placeholder="say the thing…" />
          </Field>
          <ImageListField label="Media" values={data.images || []} onChange={(images) => set({ images })} max={4} />
          <div className="field-row three">
            <Field label="Likes"><NumField value={data.likes} onChange={(v) => set({ likes: v })} /></Field>
            <Field label="Replies"><NumField value={data.replies} onChange={(v) => set({ replies: v })} /></Field>
            <Field label="Reposts"><NumField value={data.reposts} onChange={(v) => set({ reposts: v })} /></Field>
          </div>
          <div className="field-row">
            <Field label="Views"><NumField value={data.views} onChange={(v) => set({ views: v })} /></Field>
            <Field label="Time on post"><TextInput value={data.time || ''} onChange={(e) => set({ time: e.target.value })} placeholder="2h" /></Field>
          </div>
          <Field label="Full timestamp" hint="shown under the post"><TextInput value={data.timestamp || ''} onChange={(e) => set({ timestamp: e.target.value })} placeholder="9:41 AM · Oct 12, 2026" /></Field>
          <Field label="Replying to" hint="optional @handle"><TextInput value={data.replyingTo || ''} onChange={(e) => set({ replyingTo: e.target.value })} placeholder="junolately" /></Field>
          <div className="stack" style={{ gap: 9 }}>
            <Toggle checked={data.liked} onChange={(v) => set({ liked: v })} label="Your like is filled pink" />
            <Toggle checked={data.bookmarked} onChange={(v) => set({ bookmarked: v })} label="Bookmarked" />
            <Toggle checked={data.showNav !== false} onChange={(v) => set({ showNav: v })} label="Show X tab bar" />
          </div>
        </div>
      </Section>

      <Section title="Quote post" hint="Optional. Tuck another post inside this one.">
        <div className="stack" style={{ gap: 12 }}>
          <CastSelect project={project} label="Quoted author" value={data.quotedCastId} onChange={(v) => set({ quotedCastId: v })} includeEmpty emptyLabel="No quote" />
          {data.quotedCastId ? (
            <Field label="Quoted text"><TextArea rows={2} value={data.quotedText || ''} onChange={(e) => set({ quotedText: e.target.value })} /></Field>
          ) : null}
        </div>
      </Section>

      <Section title="Visible replies" hint="The first two show under the post in the detail view." action={<span className="pill">{replies.length}</span>}>
        <div className="stack" style={{ gap: 8 }}>
          {replies.map((r, i) => {
            const cast = project.cast.find((c) => c.id === r.castId)
            return (
              <RepeatItem
                key={r.id || i}
                index={i}
                title={r.text || 'Empty reply'}
                subtitle={cast ? `@${cast.handle}` : 'someone'}
                onRemove={() => set({ repliesList: replies.filter((_, j) => j !== i) })}
                onUp={i > 0 ? () => set({ repliesList: move(replies, i, i - 1) }) : null}
                onDown={i < replies.length - 1 ? () => set({ repliesList: move(replies, i, i + 1) }) : null}
              >
                <div className="stack" style={{ gap: 10 }}>
                  <CastSelect project={project} label="Reply from" value={r.castId} onChange={(v) => updateReply(i, { castId: v })} includeEmpty emptyLabel="Custom account" />
                  {!r.castId ? <Field label="Username"><TextInput value={r.user || ''} onChange={(e) => updateReply(i, { user: e.target.value })} placeholder="fanaccount" /></Field> : null}
                  <Field label="Reply"><TextArea rows={2} value={r.text || ''} onChange={(e) => updateReply(i, { text: e.target.value })} /></Field>
                  <div className="field-row">
                    <Field label="Likes"><NumField value={r.likes} onChange={(v) => updateReply(i, { likes: v })} /></Field>
                    <Field label="Time"><TextInput value={r.time || ''} onChange={(e) => updateReply(i, { time: e.target.value })} placeholder="1h" /></Field>
                  </div>
                </div>
              </RepeatItem>
            )
          })}
          <AddButton onClick={() => set({ repliesList: [...replies, { id: uid('r'), castId: project.cast[1]?.id || '', text: '', likes: 0, time: '1h' }] })}>Add reply</AddButton>
        </div>
      </Section>
    </>
  )
}

export function XThreadForm({ project, data, set }) {
  const posts = data.posts || []
  const update = (i, patch) => set({ posts: posts.map((p, j) => (j === i ? { ...p, ...patch } : p)) })
  return (
    <>
      <Section title="Thread">
        <div className="stack" style={{ gap: 13 }}>
          <CastSelect project={project} label="Posted by" value={data.castId} onChange={(v) => set({ castId: v })} />
          <Toggle checked={data.showNav !== false} onChange={(v) => set({ showNav: v })} label="Show X tab bar" />
        </div>
      </Section>
      <Section title="Posts in the thread" hint="A vertical line connects them in the preview." action={<span className="pill">{posts.length}</span>}>
        <div className="stack" style={{ gap: 8 }}>
          {posts.map((p, i) => (
            <RepeatItem
              key={p.id || i}
              index={i}
              title={p.text || 'Empty post'}
              subtitle={`${i + 1} of ${posts.length}`}
              onRemove={() => set({ posts: posts.filter((_, j) => j !== i) })}
              onUp={i > 0 ? () => set({ posts: move(posts, i, i - 1) }) : null}
              onDown={i < posts.length - 1 ? () => set({ posts: move(posts, i, i + 1) }) : null}
            >
              <div className="stack" style={{ gap: 10 }}>
                <Field label="Post text"><TextArea rows={3} value={p.text || ''} onChange={(e) => update(i, { text: e.target.value })} /></Field>
                <ImageField value={p.images?.[0] || ''} onChange={(image) => update(i, { images: image ? [image] : [] })} label="Attached photo" square />
                <div className="field-row three">
                  <Field label="Likes"><NumField value={p.likes} onChange={(v) => update(i, { likes: v })} /></Field>
                  <Field label="Replies"><NumField value={p.replies} onChange={(v) => update(i, { replies: v })} /></Field>
                  <Field label="Reposts"><NumField value={p.reposts} onChange={(v) => update(i, { reposts: v })} /></Field>
                </div>
                <div className="field-row">
                  <Field label="Views"><NumField value={p.views} onChange={(v) => update(i, { views: v })} /></Field>
                  <Field label="Time"><TextInput value={p.time || ''} onChange={(e) => update(i, { time: e.target.value })} placeholder="2h" /></Field>
                </div>
              </div>
            </RepeatItem>
          ))}
          <AddButton onClick={() => set({ posts: [...posts, { id: uid('tp'), text: '', likes: 0, replies: 0, reposts: 0, views: 0, time: '' }] })}>Add post to thread</AddButton>
        </div>
      </Section>
    </>
  )
}

export function XProfileForm({ project, data, set }) {
  const posts = data.posts || []
  const updatePost = (i, patch) => set({ posts: posts.map((p, j) => (j === i ? { ...p, ...patch } : p)) })
  return (
    <>
      <Section title="Profile">
        <div className="stack" style={{ gap: 13 }}>
          <CastSelect project={project} label="Character" value={data.castId} onChange={(v) => set({ castId: v })} />
          <ImageField value={data.banner} onChange={(banner) => set({ banner })} label="Banner" hint="wide crop" />
          <Field label="Bio" hint="line breaks supported">
            <TextArea rows={3} value={data.bio || ''} onChange={(e) => set({ bio: e.target.value })} placeholder="writing songs about someone who won't read this." />
          </Field>
          <div className="field-row">
            <Field label="Location"><TextInput value={data.location || ''} onChange={(e) => set({ location: e.target.value })} placeholder="Seoul" /></Field>
            <Field label="Website"><TextInput value={data.website || ''} onChange={(e) => set({ website: e.target.value })} placeholder="ari.studio" /></Field>
          </div>
          <div className="field-row">
            <Field label="Joined"><TextInput value={data.joined || ''} onChange={(e) => set({ joined: e.target.value })} placeholder="Joined March 2021" /></Field>
            <Field label="Follow button">
              <select className="select" value={data.showFollowing ? 'following' : 'follow'} onChange={(e) => set({ showFollowing: e.target.value === 'following' })}>
                <option value="follow">Follow</option>
                <option value="following">Following</option>
              </select>
            </Field>
          </div>
          <div className="field-row">
            <Field label="Followers"><NumField value={data.followers} onChange={(v) => set({ followers: v })} /></Field>
            <Field label="Following"><NumField value={data.following ?? 0} onChange={(v) => set({ following: v })} /></Field>
          </div>
        </div>
      </Section>
      <Section title="Timeline" hint="The posts on the profile page." action={<span className="pill">{posts.length}</span>}>
        <div className="stack" style={{ gap: 8 }}>
          {posts.map((p, i) => (
            <RepeatItem
              key={p.id || i}
              index={i}
              title={p.text || 'Empty post'}
              onRemove={() => set({ posts: posts.filter((_, j) => j !== i) })}
              onUp={i > 0 ? () => set({ posts: move(posts, i, i - 1) }) : null}
              onDown={i < posts.length - 1 ? () => set({ posts: move(posts, i, i + 1) }) : null}
            >
              <div className="stack" style={{ gap: 10 }}>
                <Field label="Text"><TextArea rows={2} value={p.text || ''} onChange={(e) => updatePost(i, { text: e.target.value })} /></Field>
                <ImageField value={p.images?.[0] || ''} onChange={(image) => updatePost(i, { images: image ? [image] : [] })} label="Photo" compact />
                <div className="field-row three">
                  <Field label="Likes"><NumField value={p.likes} onChange={(v) => updatePost(i, { likes: v })} /></Field>
                  <Field label="Replies"><NumField value={p.replies} onChange={(v) => updatePost(i, { replies: v })} /></Field>
                  <Field label="Reposts"><NumField value={p.reposts} onChange={(v) => updatePost(i, { reposts: v })} /></Field>
                </div>
                <div className="field-row">
                  <Field label="Views"><NumField value={p.views} onChange={(v) => updatePost(i, { views: v })} /></Field>
                  <Field label="Time"><TextInput value={p.time || ''} onChange={(e) => updatePost(i, { time: e.target.value })} placeholder="3h" /></Field>
                </div>
              </div>
            </RepeatItem>
          ))}
          <AddButton onClick={() => set({ posts: [...posts, { id: uid('xp'), text: '', images: [], likes: 0, replies: 0, reposts: 0, views: 0, time: '1h' }] })}>Add post</AddButton>
        </div>
      </Section>
    </>
  )
}
