import React from 'react'
import {
  AddButton,
  CastSelect,
  EmojiPicker,
  Field,
  ImageField,
  ImageListField,
  NumField,
  RepeatItem,
  Section,
  Segmented,
  TextArea,
  TextInput,
  Toggle,
} from '../fields.jsx'
import { STOCK } from '../../data/stock.js'
import { uid, cn } from '../../lib/util.js'

const move = (arr, from, to) => {
  if (to < 0 || to >= arr.length) return arr
  const copy = [...arr]
  const [x] = copy.splice(from, 1)
  copy.splice(to, 0, x)
  return copy
}

function CommentList({ project, comments = [], set }) {
  const update = (i, patch) => set({ comments: comments.map((c, j) => (j === i ? { ...c, ...patch } : c)) })
  return (
    <Section
      title="Comments"
      hint="Only the first two appear on a feed post. Use a character for a familiar face, or leave it blank for a fan account."
      action={<span className="pill">{comments.length}</span>}
    >
      <div className="stack" style={{ gap: 8 }}>
        {comments.map((c, i) => {
          const cast = project.cast.find((x) => x.id === c.castId)
          return (
            <RepeatItem
              key={c.id || i}
              index={i}
              title={c.text || 'Empty comment'}
              subtitle={cast ? `@${cast.handle}` : c.user ? `@${c.user}` : 'custom account'}
              onRemove={() => set({ comments: comments.filter((_, j) => j !== i) })}
              onUp={i > 0 ? () => set({ comments: move(comments, i, i - 1) }) : null}
              onDown={i < comments.length - 1 ? () => set({ comments: move(comments, i, i + 1) }) : null}
            >
              <div className="stack" style={{ gap: 10 }}>
                <CastSelect
                  project={project}
                  label="Comment as"
                  value={c.castId}
                  onChange={(v) => update(i, { castId: v })}
                  includeEmpty
                  emptyLabel="Custom / fan account"
                />
                {!c.castId ? (
                  <Field label="Username"><TextInput value={c.user || ''} onChange={(e) => update(i, { user: e.target.value })} placeholder="smalltownfan" /></Field>
                ) : null}
                <Field label="Comment"><TextArea rows={2} value={c.text || ''} onChange={(e) => update(i, { text: e.target.value })} /></Field>
                <div className="field-row">
                  <Field label="Likes"><NumField value={c.likes} onChange={(v) => update(i, { likes: v })} /></Field>
                  <Field label="Time"><TextInput value={c.time || ''} onChange={(e) => update(i, { time: e.target.value })} placeholder="1h" /></Field>
                </div>
              </div>
            </RepeatItem>
          )
        })}
        <AddButton onClick={() => set({ comments: [...comments, { id: uid('cm'), castId: project.cast[1]?.id || '', user: '', text: '', likes: 0, time: '1h' }] })}>
          Add comment
        </AddButton>
      </div>
    </Section>
  )
}

/* ------------------------------------------------------------------ */
export function InstagramPostForm({ project, data, set }) {
  return (
    <>
      <Section title="Post" hint="The square photo, the caption, and the numbers.">
        <div className="stack" style={{ gap: 13 }}>
          <CastSelect project={project} label="Posted by" value={data.castId} onChange={(v) => set({ castId: v })} />
          <ImageListField label="Photos" values={data.images || []} onChange={(images) => set({ images })} max={10} />
          <Field label="Caption" hint="line breaks supported; #hashtags and @mentions get picked up">
            <TextArea rows={4} value={data.caption || ''} onChange={(e) => set({ caption: e.target.value })} placeholder="write the caption…" />
          </Field>
          <div className="field-row">
            <Field label="Location"><TextInput value={data.location || ''} onChange={(e) => set({ location: e.target.value })} placeholder="Marigold Records" /></Field>
            <Field label="Time shown"><TextInput value={data.time || ''} onChange={(e) => set({ time: e.target.value })} placeholder="2 hours ago" /></Field>
          </div>
          <div className="field-row">
            <Field label="Music sticker" hint="optional"><TextInput value={data.music || ''} onChange={(e) => set({ music: e.target.value })} placeholder="Dandelions" /></Field>
            <Field label="Artist"><TextInput value={data.musicArtist || ''} onChange={(e) => set({ musicArtist: e.target.value })} placeholder="Ruth B." /></Field>
          </div>
          <div className="field-row">
            <Field label="Likes"><NumField value={data.likes} onChange={(v) => set({ likes: v })} /></Field>
            <Field label="Extra comments" hint="only affects the count"><NumField value={data.extraComments || 0} onChange={(v) => set({ extraComments: v })} /></Field>
          </div>
          <Field label="Liked by" hint="optional line"><TextInput value={data.likedBy || ''} onChange={(e) => set({ likedBy: e.target.value })} placeholder="ariwrites and 1,283 others" /></Field>
          <div className="stack" style={{ gap: 9 }}>
            <Toggle checked={data.liked !== false} onChange={(v) => set({ liked: v })} label="Your like is filled red" />
            <Toggle checked={data.saved} onChange={(v) => set({ saved: v })} label="Saved bookmark is filled" />
            <Toggle checked={data.showNav !== false} onChange={(v) => set({ showNav: v })} label="Show Instagram tab bar" />
          </div>
        </div>
      </Section>
      <CommentList project={project} comments={data.comments || []} set={set} />
    </>
  )
}

/* ------------------------------------------------------------------ */
export function InstagramStoryForm({ project, data, set }) {
  return (
    <>
      <Section title="Story">
        <div className="stack" style={{ gap: 13 }}>
          <CastSelect project={project} label="Posted by" value={data.castId} onChange={(v) => set({ castId: v })} />
          <ImageField value={data.image} onChange={(image) => set({ image })} label="Story photo" hint="portrait works best" />
          <Field label="Story text" hint="the big text on the photo">
            <TextArea rows={2} value={data.caption || ''} onChange={(e) => set({ caption: e.target.value })} placeholder="she said she'd come…" />
          </Field>
          <div className="field-row">
            <Field label="Text position">
              <select className="select" value={data.captionStyle || 'center'} onChange={(e) => set({ captionStyle: e.target.value })}>
                <option value="center">Centre</option>
                <option value="left">Left</option>
                <option value="bottom">Near bottom</option>
              </select>
            </Field>
            <Field label="Location"><TextInput value={data.location || ''} onChange={(e) => set({ location: e.target.value })} placeholder="Marigold Records" /></Field>
          </div>
          <div className="field-row">
            <Field label="Music"><TextInput value={data.music || ''} onChange={(e) => set({ music: e.target.value })} placeholder="Dandelions" /></Field>
            <Field label="Artist"><TextInput value={data.musicArtist || ''} onChange={(e) => set({ musicArtist: e.target.value })} placeholder="Ruth B." /></Field>
          </div>
          <div className="field-row">
            <Field label="Time"><TextInput value={data.time || ''} onChange={(e) => set({ time: e.target.value })} placeholder="2h" /></Field>
            <Field label="Segments" hint="current / total">
              <div className="row">
                <NumField value={data.progress || 1} onChange={(v) => set({ progress: v })} />
                <NumField value={data.progressTotal || 4} onChange={(v) => set({ progressTotal: v })} />
              </div>
            </Field>
          </div>
          <Toggle checked={data.showReply !== false} onChange={(v) => set({ showReply: v })} label="Show “Send message” bar" />
        </div>
      </Section>
      <Section title="Poll sticker" hint="A great way to make readers feel involved.">
        <div className="stack" style={{ gap: 12 }}>
          <Toggle checked={data.pollOn} onChange={(v) => set({ pollOn: v })} label="Add a poll sticker" />
          {data.pollOn ? (
            <>
              <Field label="Question"><TextInput value={data.pollQuestion || ''} onChange={(e) => set({ pollQuestion: e.target.value })} placeholder="be honest" /></Field>
              <div className="field-row">
                <Field label="Option one"><TextInput value={data.pollA || ''} onChange={(e) => set({ pollA: e.target.value })} placeholder="yes" /></Field>
                <Field label="Option two"><TextInput value={data.pollB || ''} onChange={(e) => set({ pollB: e.target.value })} placeholder="no" /></Field>
              </div>
              <div className="field-row">
                <Field label="Votes for one"><NumField value={data.pollVotesA} onChange={(v) => set({ pollVotesA: v })} /></Field>
                <Field label="Votes for two"><NumField value={data.pollVotesB} onChange={(v) => set({ pollVotesB: v })} /></Field>
              </div>
            </>
          ) : null}
        </div>
      </Section>
    </>
  )
}

/* ------------------------------------------------------------------ */
export function InstagramProfileForm({ project, data, set }) {
  const highlights = data.highlights || []
  const grid = data.grid || []
  const updateHighlight = (i, patch) => set({ highlights: highlights.map((h, j) => (j === i ? { ...h, ...patch } : h)) })
  const updateGrid = (i, patch) => set({ grid: grid.map((g, j) => (j === i ? { ...g, ...patch } : g)) })
  return (
    <>
      <Section title="Profile" hint="This is the account page readers see.">
        <div className="stack" style={{ gap: 13 }}>
          <CastSelect project={project} label="Character" value={data.castId} onChange={(v) => set({ castId: v })} />
          <Field label="Bio" hint="line breaks supported">
            <TextArea rows={3} value={data.bio || ''} onChange={(e) => set({ bio: e.target.value })} />
          </Field>
          <div className="field-row">
            <Field label="Category"><TextInput value={data.category || ''} onChange={(e) => set({ category: e.target.value })} placeholder="digital creator" /></Field>
            <Field label="Link"><TextInput value={data.link || ''} onChange={(e) => set({ link: e.target.value })} placeholder="yourlink.studio" /></Field>
          </div>
          <div className="field-row three">
            <Field label="Posts"><NumField value={data.posts} onChange={(v) => set({ posts: v })} /></Field>
            <Field label="Followers"><NumField value={data.followers} onChange={(v) => set({ followers: v })} /></Field>
            <Field label="Following"><NumField value={data.following} onChange={(v) => set({ following: v })} /></Field>
          </div>
          <Toggle checked={data.showFollowing !== false} onChange={(v) => set({ showFollowing: v })} label="Button shows Following" hint="turn off to show a Follow button" />
          <Toggle checked={data.showNav !== false} onChange={(v) => set({ showNav: v })} label="Show Instagram tab bar" />
        </div>
      </Section>

      <Section
        title="Highlights"
        hint="The little circles under the bio."
        action={<button className="btn btn-ghost btn-xs" onClick={() => set({ highlights: [...highlights, { id: uid('h'), name: 'new', image: '' }] })}>+ Add</button>}
      >
        <div className="stack" style={{ gap: 8 }}>
          {highlights.map((h, i) => (
            <RepeatItem key={h.id || i} index={i} title={h.name || 'Highlight'} onRemove={() => set({ highlights: highlights.filter((_, j) => j !== i) })}>
              <div className="stack" style={{ gap: 10 }}>
                <Field label="Name"><TextInput value={h.name || ''} onChange={(e) => updateHighlight(i, { name: e.target.value })} placeholder="the café" /></Field>
                <ImageField value={h.image} onChange={(image) => updateHighlight(i, { image })} label="Cover photo" compact />
              </div>
            </RepeatItem>
          ))}
          {!highlights.length ? <p className="help">No highlights yet. Add up to four for the classic profile look.</p> : null}
        </div>
      </Section>

      <Section
        title="Profile grid"
        hint="Three across. The first nine make the screenshot."
        action={
          <button
            className="btn btn-ghost btn-xs"
            onClick={() => set({ grid: [...grid, ...STOCK.slice(0, Math.max(1, 6 - grid.length)).map((s) => ({ id: uid('g'), image: s.src }))].slice(0, 9) })}
          >
            + Fill with scenes
          </button>
        }
      >
        <div className="stack" style={{ gap: 8 }}>
          {grid.map((g, i) => (
            <RepeatItem
              key={g.id || i}
              index={i}
              title={g.type === 'reels' ? 'Reel' : g.type === 'carousel' ? 'Carousel' : 'Photo'}
              subtitle={g.pinned ? 'pinned' : ''}
              onRemove={() => set({ grid: grid.filter((_, j) => j !== i) })}
              onUp={i > 0 ? () => set({ grid: move(grid, i, i - 1) }) : null}
              onDown={i < grid.length - 1 ? () => set({ grid: move(grid, i, i + 1) }) : null}
            >
              <div className="stack" style={{ gap: 10 }}>
                <ImageField value={g.image} onChange={(image) => updateGrid(i, { image })} label="Thumbnail" square />
                <div className="field-row">
                  <Field label="Badge">
                    <select className="select" value={g.type || 'photo'} onChange={(e) => updateGrid(i, { type: e.target.value })}>
                      <option value="photo">Photo</option>
                      <option value="reels">Reel (play icon)</option>
                      <option value="carousel">Carousel</option>
                    </select>
                  </Field>
                  <div className="stack" style={{ justifyContent: 'flex-end', paddingBottom: 6 }}>
                    <Toggle checked={g.pinned} onChange={(v) => updateGrid(i, { pinned: v })} label="Pinned" />
                  </div>
                </div>
              </div>
            </RepeatItem>
          ))}
          <AddButton onClick={() => set({ grid: [...grid, { id: uid('g'), image: '' }] })}>Add grid photo</AddButton>
        </div>
      </Section>
    </>
  )
}

/* ------------------------------------------------------------------ */
export function InstagramDMForm({ project, data, set }) {
  const messages = data.messages || []
  const update = (i, patch) => set({ messages: messages.map((m, j) => (j === i ? { ...m, ...patch } : m)) })
  return (
    <>
      <Section title="Direct message">
        <div className="stack" style={{ gap: 13 }}>
          <CastSelect project={project} label="Chatting with" value={data.castId} onChange={(v) => set({ castId: v })} />
          <div className="field-row">
            <Field label="Presence">
              <select className="select" value={data.active === false ? 'offline' : 'active'} onChange={(e) => set({ active: e.target.value === 'active' })}>
                <option value="active">Active now</option>
                <option value="offline">Offline</option>
              </select>
            </Field>
            <Field label="Seen label"><select className="select" value={data.seen ? 'yes' : 'no'} onChange={(e) => set({ seen: e.target.value === 'yes' })}><option value="no">Hide</option><option value="yes">Show “Seen”</option></select></Field>
          </div>
          <Toggle checked={data.showReply !== false} onChange={(v) => set({ showReply: v })} label="Show reply bar" />
        </div>
      </Section>
      <Section title="Messages" action={<span className="pill">{messages.length}</span>}>
        <div className="stack" style={{ gap: 8 }}>
          {messages.map((m, i) => (
            <RepeatItem
              key={m.id || i}
              index={i}
              title={m.kind === 'image' ? 'Photo' : m.kind === 'post' ? 'Shared post' : m.kind === 'audio' ? `Voice note · ${m.duration || ''}` : m.text || 'Empty message'}
              subtitle={m.from === 'me' ? 'you' : 'them'}
              onRemove={() => set({ messages: messages.filter((_, j) => j !== i) })}
              onUp={i > 0 ? () => set({ messages: move(messages, i, i - 1) }) : null}
              onDown={i < messages.length - 1 ? () => set({ messages: move(messages, i, i + 1) }) : null}
            >
              <div className="stack" style={{ gap: 10 }}>
                <Segmented value={m.from || 'them'} options={[{ value: 'them', label: 'Them' }, { value: 'me', label: 'You' }]} onChange={(v) => update(i, { from: v })} />
                <Field label="Type">
                  <select className="select" value={m.kind || 'text'} onChange={(e) => update(i, { kind: e.target.value })}>
                    <option value="text">Text</option>
                    <option value="image">Photo</option>
                    <option value="post">Shared post</option>
                    <option value="audio">Voice note</option>
                    <option value="time">Time divider</option>
                  </select>
                </Field>
                {m.kind === 'text' || m.kind === 'post' || m.kind === 'time' ? (
                  <Field label={m.kind === 'time' ? 'Divider' : m.kind === 'post' ? 'Shared post caption' : 'Message'}>
                    <TextArea rows={2} value={m.text || ''} onChange={(e) => update(i, { text: e.target.value })} placeholder={m.kind === 'time' ? 'Today 9:41 AM' : ''} />
                  </Field>
                ) : null}
                {m.kind === 'image' || m.kind === 'post' ? (
                  <ImageField value={m.image} onChange={(image) => update(i, { image })} label={m.kind === 'post' ? 'Shared photo' : 'Photo'} square />
                ) : null}
                {m.kind === 'audio' ? (
                  <Field label="Duration"><TextInput value={m.duration || ''} onChange={(e) => update(i, { duration: e.target.value })} placeholder="0:14" /></Field>
                ) : null}
                <div className="field">
                  <span className="label">Reaction <span className="hint">optional</span></span>
                  <EmojiPicker value={m.reaction || ''} onChange={(v) => update(i, { reaction: v })} options={['❤️', '😂', '😭', '🔥', '👀', '🫶']} />
                </div>
              </div>
            </RepeatItem>
          ))}
          <AddButton onClick={() => set({ messages: [...messages, { id: uid('m'), from: 'them', kind: 'text', text: '' }] })}>Add message</AddButton>
        </div>
      </Section>
    </>
  )
}
