import React from 'react'
import {
  AddButton,
  CastSelect,
  EmojiPicker,
  Field,
  ImageField,
  NumField,
  RepeatItem,
  Section,
  Segmented,
  TextArea,
  TextInput,
  Toggle,
} from '../fields.jsx'
import { Avatar, BrandIcon } from '../../screens/ui.jsx'
import { uid, cn } from '../../lib/util.js'

const move = (arr, from, to) => {
  if (to < 0 || to >= arr.length) return arr
  const copy = [...arr]
  const [x] = copy.splice(from, 1)
  copy.splice(to, 0, x)
  return copy
}

const fromOptions = [
  { value: 'them', label: 'Them' },
  { value: 'me', label: 'You' },
]

function SenderControl({ project, value, onChange, isGroup, label = 'Sender' }) {
  return (
    <Field label={label}>
      <select className="select" value={value || ''} onChange={(e) => onChange(e.target.value)}>
        <option value="">{isGroup ? 'Choose a member…' : 'The contact'}</option>
        {project.cast.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
    </Field>
  )
}

const msgTitle = (m, label = 'Message') => {
  if (m.kind === 'time') return m.text || 'Time divider'
  if (m.kind === 'call') return m.text || 'Call'
  if (m.kind === 'audio') return `Voice note · ${m.duration || '0:14'}`
  if (m.kind === 'image') return 'Photo'
  if (m.kind === 'emoji') return `Emoji · ${m.text || '🫶'}`
  return m.text ? (m.text.length > 48 ? `${m.text.slice(0, 48)}…` : m.text) : label
}

/* ------------------------------------------------------------------ */
/* iMessage                                                            */
/* ------------------------------------------------------------------ */
export function IMessageForm({ project, data, set }) {
  const isGroup = (data.participants || []).length > 0
  const messages = data.messages || []
  const contact = project.cast.find((c) => c.id === data.contactId)
  const updateMessage = (i, patch) => set({ messages: messages.map((m, j) => (j === i ? { ...m, ...patch } : m)) })
  const addMessage = (partial = {}) =>
    set({ messages: [...messages, { id: uid('m'), from: 'them', kind: 'text', text: '', ...partial }] })
  const addDivider = () => addMessage({ kind: 'time', text: 'Today 9:41 AM' })
  const removeMessage = (i) => set({ messages: messages.filter((_, j) => j !== i) })
  const moveMessage = (i, dir) => set({ messages: move(messages, i, i + dir) })

  return (
    <>
      <Section title="Conversation" hint="Group chats display sender names above incoming messages.">
        <div className="stack" style={{ gap: 13 }}>
          <Segmented
            label="Chat type"
            value={isGroup ? 'group' : 'direct'}
            options={[
              { value: 'direct', label: 'One-on-one' },
              { value: 'group', label: 'Group chat' },
            ]}
            onChange={(v) =>
              v === 'direct'
                ? set({ participants: [], contactId: data.contactId || project.cast[0]?.id || '' })
                : set({ participants: project.cast.slice(0, 2).map((c) => c.id) })
            }
          />
          {!isGroup ? (
            <CastSelect project={project} label="Contact" value={data.contactId} onChange={(v) => set({ contactId: v })} />
          ) : (
            <>
              <Field label="Group name" hint="shown in the header">
                <TextInput value={data.title || ''} onChange={(e) => set({ title: e.target.value })} placeholder="the group chat" />
              </Field>
              <div className="field">
                <span className="label">Members</span>
                <div className="cast-checks">
                  {project.cast.map((c) => {
                    const checked = (data.participants || []).includes(c.id)
                    return (
                      <label key={c.id} className={cn('cast-check', checked && 'checked')}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) =>
                            set({
                              participants: e.target.checked
                                ? [...(data.participants || []), c.id]
                                : (data.participants || []).filter((id) => id !== c.id),
                            })
                          }
                        />
                        <Avatar src={c.avatar} name={c.name} size={22} />
                        <span>{c.name.split(' ')[0]}</span>
                      </label>
                    )
                  })}
                </div>
              </div>
            </>
          )}
          <div className="field-row">
            <Field label="Read receipt">
              <select className="select" value={data.receipt || 'Read'} onChange={(e) => set({ receipt: e.target.value })}>
                <option value="None">None</option>
                <option value="Delivered">Delivered</option>
                <option value="Read">Read</option>
              </select>
            </Field>
            <Field label="Input placeholder">
              <TextInput value={data.placeholder || ''} onChange={(e) => set({ placeholder: e.target.value })} placeholder="iMessage" />
            </Field>
          </div>
          <div className="field-row">
            <Field label="Day label" hint="first line of the thread">
              <TextInput value={data.day || ''} onChange={(e) => set({ day: e.target.value })} placeholder="Today" />
            </Field>
            <Field label="Time">
              <TextInput value={data.time || ''} onChange={(e) => set({ time: e.target.value })} placeholder="9:41 AM" />
            </Field>
          </div>
          <Toggle checked={data.typing} onChange={(v) => set({ typing: v })} label="Show typing bubble" hint="animated dots at the end of the thread" />
        </div>
      </Section>

      <Section title="Messages" hint="Tap any message to open its fields. Times use your own words." action={<span className="pill">{messages.length}</span>}>
        <div className="stack" style={{ gap: 8 }}>
          {messages.map((m, i) => (
            <RepeatItem
              key={m.id || i}
              index={i}
              title={msgTitle(m, 'Empty message')}
              subtitle={m.kind === 'time' ? 'centered divider' : m.from === 'me' ? 'you' : isGroup ? project.cast.find((c) => c.id === m.castId)?.name || contact?.name || 'them' : contact?.name || 'them'}
              onRemove={() => removeMessage(i)}
              onUp={i > 0 ? () => moveMessage(i, -1) : null}
              onDown={i < messages.length - 1 ? () => moveMessage(i, 1) : null}
            >
              <div className="stack" style={{ gap: 10 }}>
                {m.kind !== 'time' ? (
                  <Segmented value={m.from || 'them'} options={fromOptions} onChange={(v) => updateMessage(i, { from: v })} />
                ) : null}
                <div className="field-row">
                  <Field label="Type">
                    <select className="select" value={m.kind || 'text'} onChange={(e) => updateMessage(i, { kind: e.target.value })}>
                      <option value="text">Text</option>
                      <option value="image">Photo</option>
                      <option value="audio">Voice note</option>
                      <option value="emoji">Big emoji</option>
                      <option value="call">Call log</option>
                      <option value="time">Time divider</option>
                    </select>
                  </Field>
                  {m.kind === 'audio' ? (
                    <Field label="Duration">
                      <TextInput value={m.duration || ''} onChange={(e) => updateMessage(i, { duration: e.target.value })} placeholder="0:14" />
                    </Field>
                  ) : m.kind === 'emoji' ? (
                    <Field label="Emoji">
                      <TextInput value={m.text || ''} onChange={(e) => updateMessage(i, { text: e.target.value })} placeholder="🫶" maxLength={8} />
                    </Field>
                  ) : m.kind === 'call' ? (
                    <Field label="Call duration">
                      <TextInput value={m.duration || ''} onChange={(e) => updateMessage(i, { duration: e.target.value })} placeholder="12 min" />
                    </Field>
                  ) : null}
                </div>

                {m.kind === 'text' || m.kind === 'call' || m.kind === 'time' ? (
                  <Field label={m.kind === 'time' ? 'Divider text' : m.kind === 'call' ? 'Call label' : 'Message'}>
                    <TextArea
                      rows={m.kind === 'time' ? 1 : 2}
                      value={m.text || ''}
                      onChange={(e) => updateMessage(i, { text: e.target.value })}
                      placeholder={m.kind === 'time' ? 'Today 9:41 AM' : m.kind === 'call' ? 'FaceTime Audio' : 'write the message…'}
                    />
                  </Field>
                ) : null}

                {m.kind === 'image' ? (
                  <ImageField value={m.image} onChange={(image) => updateMessage(i, { image })} label="Photo" square />
                ) : null}

                {isGroup && m.from !== 'me' && m.kind !== 'time' ? (
                  <SenderControl project={project} value={m.castId} onChange={(v) => updateMessage(i, { castId: v })} isGroup />
                ) : null}

                {m.kind !== 'time' ? (
                  <div className="field">
                    <span className="label">Tapback reaction <span className="hint">optional</span></span>
                    <EmojiPicker value={m.reaction || ''} onChange={(v) => updateMessage(i, { reaction: v })} options={['❤️', '👍', '😂', '😮', '😢', '🔥', '💀', '🫶']} />
                  </div>
                ) : null}
              </div>
            </RepeatItem>
          ))}
          <div className="row-wrap">
            <AddButton onClick={() => addMessage({ from: 'them', kind: 'text', text: '' })}>Add message</AddButton>
            <button type="button" className="btn btn-ghost btn-sm" onClick={addDivider}>Add time divider</button>
          </div>
        </div>
      </Section>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* WhatsApp                                                            */
/* ------------------------------------------------------------------ */
export function WhatsAppForm({ project, data, set }) {
  const isGroup = (data.participants || []).length > 0
  const messages = data.messages || []
  const updateMessage = (i, patch) => set({ messages: messages.map((m, j) => (j === i ? { ...m, ...patch } : m)) })
  const addMessage = () => set({ messages: [...messages, { id: uid('m'), from: 'them', kind: 'text', text: '', time: '21:34' }] })
  return (
    <>
      <Section title="Conversation">
        <div className="stack" style={{ gap: 13 }}>
          <Segmented
            label="Chat type"
            value={isGroup ? 'group' : 'direct'}
            options={[{ value: 'direct', label: 'One-on-one' }, { value: 'group', label: 'Group' }]}
            onChange={(v) =>
              v === 'direct'
                ? set({ participants: [], contactId: data.contactId || project.cast[0]?.id || '' })
                : set({ participants: project.cast.slice(0, 3).map((c) => c.id) })
            }
          />
          {!isGroup ? (
            <CastSelect project={project} label="Contact" value={data.contactId} onChange={(v) => set({ contactId: v })} />
          ) : (
            <>
              <Field label="Group name"><TextInput value={data.title || ''} onChange={(e) => set({ title: e.target.value })} placeholder="the group chat" /></Field>
              <div className="field">
                <span className="label">Members</span>
                <div className="cast-checks">
                  {project.cast.map((c) => {
                    const checked = (data.participants || []).includes(c.id)
                    return (
                      <label key={c.id} className={cn('cast-check', checked && 'checked')}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) =>
                            set({ participants: e.target.checked ? [...(data.participants || []), c.id] : (data.participants || []).filter((id) => id !== c.id) })
                          }
                        />
                        <Avatar src={c.avatar} name={c.name} size={22} />
                        <span>{c.name.split(' ')[0]}</span>
                      </label>
                    )
                  })}
                </div>
              </div>
            </>
          )}
          <ImageField value={data.wallpaper} onChange={(wallpaper) => set({ wallpaper })} label="Chat wallpaper" hint="optional" compact />
          <div className="field-row">
            <Field label="Day label"><TextInput value={data.dayLabel || ''} onChange={(e) => set({ dayLabel: e.target.value })} placeholder="TODAY" /></Field>
            <div className="stack" style={{ justifyContent: 'flex-end', gap: 8, paddingBottom: 4 }}>
              <Toggle checked={data.online !== false} onChange={(v) => set({ online: v })} label="Online" />
            </div>
          </div>
          <Toggle checked={data.showEncryption !== false} onChange={(v) => set({ showEncryption: v })} label="Show encryption notice" />
        </div>
      </Section>

      <Section title="Messages" hint="Use 24-hour times like 21:34." action={<span className="pill">{messages.length}</span>}>
        <div className="stack" style={{ gap: 8 }}>
          {messages.map((m, i) => (
            <RepeatItem
              key={m.id || i}
              index={i}
              title={m.kind === 'image' ? 'Photo' : m.kind === 'audio' ? `Voice note · ${m.duration || '0:12'}` : msgTitle(m, 'Empty message')}
              subtitle={m.from === 'me' ? 'you' : 'them'}
              onRemove={() => set({ messages: messages.filter((_, j) => j !== i) })}
              onUp={i > 0 ? () => set({ messages: move(messages, i, i - 1) }) : null}
              onDown={i < messages.length - 1 ? () => set({ messages: move(messages, i, i + 1) }) : null}
            >
              <div className="stack" style={{ gap: 10 }}>
                <Segmented value={m.from || 'them'} options={fromOptions} onChange={(v) => updateMessage(i, { from: v })} />
                <div className="field-row">
                  <Field label="Type">
                    <select className="select" value={m.kind || 'text'} onChange={(e) => updateMessage(i, { kind: e.target.value })}>
                      <option value="text">Text</option>
                      <option value="image">Photo</option>
                      <option value="audio">Voice note</option>
                    </select>
                  </Field>
                  <Field label="Time"><TextInput value={m.time || ''} onChange={(e) => updateMessage(i, { time: e.target.value })} placeholder="21:34" /></Field>
                </div>
                {m.kind === 'text' || !m.kind ? (
                  <Field label="Message"><TextArea rows={2} value={m.text || ''} onChange={(e) => updateMessage(i, { text: e.target.value })} /></Field>
                ) : null}
                {m.kind === 'image' ? <ImageField value={m.image} onChange={(image) => updateMessage(i, { image })} label="Photo" square /> : null}
                {m.kind === 'audio' ? (
                  <Field label="Duration"><TextInput value={m.duration || ''} onChange={(e) => updateMessage(i, { duration: e.target.value })} placeholder="0:12" /></Field>
                ) : null}
                {isGroup && m.from !== 'me' ? (
                  <SenderControl project={project} value={m.castId} onChange={(v) => updateMessage(i, { castId: v })} isGroup />
                ) : null}
                <Toggle checked={m.read !== false} onChange={(v) => updateMessage(i, { read: v })} label="Blue ticks (read)" />
              </div>
            </RepeatItem>
          ))}
          <AddButton onClick={addMessage}>Add message</AddButton>
        </div>
      </Section>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Discord                                                             */
/* ------------------------------------------------------------------ */
export function DiscordForm({ project, data, set }) {
  const messages = data.messages || []
  const updateMessage = (i, patch) => set({ messages: messages.map((m, j) => (j === i ? { ...m, ...patch } : m)) })
  const addMessage = () =>
    set({ messages: [...messages, { id: uid('d'), castId: project.cast[0]?.id || '', text: '', time: 'Today at 00:02', reactions: [] }] })
  return (
    <>
      <Section title="Server" hint="Discord chats look best with a little chaos.">
        <div className="stack" style={{ gap: 12 }}>
          <div className="field-row">
            <Field label="Server name"><TextInput value={data.serverName || ''} onChange={(e) => set({ serverName: e.target.value })} placeholder="the fall out" /></Field>
            <Field label="Channel name"><TextInput value={data.channelName || ''} onChange={(e) => set({ channelName: e.target.value })} placeholder="general" /></Field>
          </div>
          <Field label="Channel topic"><TextInput value={data.topic || ''} onChange={(e) => set({ topic: e.target.value })} placeholder="no thoughts head empty" /></Field>
          <Field label="Date divider"><TextInput value={data.dateLabel || ''} onChange={(e) => set({ dateLabel: e.target.value })} placeholder="Today" /></Field>
        </div>
      </Section>

      <Section title="Messages" hint="Each message can have reactions and a reply preview." action={<span className="pill">{messages.length}</span>}>
        <div className="stack" style={{ gap: 8 }}>
          {messages.map((m, i) => {
            const author = project.cast.find((c) => c.id === m.castId)
            return (
              <RepeatItem
                key={m.id || i}
                index={i}
                title={msgTitle(m, 'Empty message')}
                subtitle={`${author?.name || 'someone'} · ${m.time || ''}`}
                onRemove={() => set({ messages: messages.filter((_, j) => j !== i) })}
                onUp={i > 0 ? () => set({ messages: move(messages, i, i - 1) }) : null}
                onDown={i < messages.length - 1 ? () => set({ messages: move(messages, i, i + 1) }) : null}
              >
                <div className="stack" style={{ gap: 10 }}>
                  <CastSelect project={project} value={m.castId} onChange={(v) => updateMessage(i, { castId: v })} label="Author" />
                  <Field label="Message"><TextArea rows={2} value={m.text || ''} onChange={(e) => updateMessage(i, { text: e.target.value })} /></Field>
                  <Field label="Timestamp"><TextInput value={m.time || ''} onChange={(e) => updateMessage(i, { time: e.target.value })} placeholder="Today at 00:02" /></Field>
                  <ImageField value={m.image} onChange={(image) => updateMessage(i, { image })} label="Attachment" compact />
                  <Toggle checked={m.bot} onChange={(v) => updateMessage(i, { bot: v })} label="Show APP / bot tag" />
                  <div className="field">
                    <span className="label">Reactions</span>
                    <div className="stack" style={{ gap: 6 }}>
                      {(m.reactions || []).map((r, k) => (
                        <div className="mini-row" key={k}>
                          <input className="input sm" style={{ width: 64 }} value={r.emoji} onChange={(e) => updateMessage(i, { reactions: m.reactions.map((x, z) => (z === k ? { ...x, emoji: e.target.value } : x)) })} maxLength={8} />
                          <NumField value={r.count} onChange={(v) => updateMessage(i, { reactions: m.reactions.map((x, z) => (z === k ? { ...x, count: v } : x)) })} />
                          <button className="btn btn-ghost btn-xs" onClick={() => updateMessage(i, { reactions: m.reactions.filter((_, z) => z !== k) })}>Remove</button>
                        </div>
                      ))}
                      <button className="btn btn-ghost btn-xs" onClick={() => updateMessage(i, { reactions: [...(m.reactions || []), { emoji: '💀', count: 1 }] })}>+ Add reaction</button>
                    </div>
                  </div>
                  <div className="field">
                    <span className="label">Reply preview <span className="hint">optional</span></span>
                    <div className="field-row">
                      <TextInput value={m.replyTo?.author || ''} onChange={(e) => updateMessage(i, { replyTo: { ...(m.replyTo || {}), author: e.target.value } })} placeholder="Their name" />
                      <TextInput value={m.replyTo?.text || ''} onChange={(e) => updateMessage(i, { replyTo: { ...(m.replyTo || {}), text: e.target.value } })} placeholder="quoted message" />
                    </div>
                  </div>
                </div>
              </RepeatItem>
            )
          })}
          <AddButton onClick={addMessage}>Add message</AddButton>
        </div>
      </Section>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Snapchat                                                            */
/* ------------------------------------------------------------------ */
export function SnapchatForm({ project, data, set }) {
  const messages = data.messages || []
  const updateMessage = (i, patch) => set({ messages: messages.map((m, j) => (j === i ? { ...m, ...patch } : m)) })
  const addMessage = () => set({ messages: [...messages, { id: uid('sp'), from: 'them', kind: 'text', text: '', time: '2m' }] })
  return (
    <>
      <Section title="Chat">
        <div className="stack" style={{ gap: 12 }}>
          <CastSelect project={project} label="Friend" value={data.contactId} onChange={(v) => set({ contactId: v })} />
          <div className="field-row">
            <Field label="Streak" hint="days"><NumField value={data.streak} onChange={(v) => set({ streak: v })} /></Field>
            <Field label="Presence"><TextInput value={data.presence || ''} onChange={(e) => set({ presence: e.target.value })} placeholder="Active now" /></Field>
          </div>
          <Field label="Under their name"><TextInput value={data.heroSub || ''} onChange={(e) => set({ heroSub: e.target.value })} placeholder="You’re friends on Snapchat" /></Field>
          <Field label="Day label"><TextInput value={data.dayLabel || ''} onChange={(e) => set({ dayLabel: e.target.value })} placeholder="TODAY" /></Field>
        </div>
      </Section>
      <Section title="Messages" action={<span className="pill">{messages.length}</span>}>
        <div className="stack" style={{ gap: 8 }}>
          {messages.map((m, i) => (
            <RepeatItem
              key={m.id || i}
              index={i}
              title={m.kind === 'snap' ? m.text || 'Sent a Snap' : m.kind === 'image' ? 'Photo' : msgTitle(m, 'Empty message')}
              subtitle={m.from === 'me' ? 'you' : 'them'}
              onRemove={() => set({ messages: messages.filter((_, j) => j !== i) })}
              onUp={i > 0 ? () => set({ messages: move(messages, i, i - 1) }) : null}
              onDown={i < messages.length - 1 ? () => set({ messages: move(messages, i, i + 1) }) : null}
            >
              <div className="stack" style={{ gap: 10 }}>
                <Segmented value={m.from || 'them'} options={fromOptions} onChange={(v) => updateMessage(i, { from: v })} />
                <div className="field-row">
                  <Field label="Type">
                    <select className="select" value={m.kind || 'text'} onChange={(e) => updateMessage(i, { kind: e.target.value })}>
                      <option value="text">Chat text</option>
                      <option value="snap">Snap card</option>
                      <option value="image">Photo</option>
                    </select>
                  </Field>
                  <Field label="Time"><TextInput value={m.time || ''} onChange={(e) => updateMessage(i, { time: e.target.value })} placeholder="2m" /></Field>
                </div>
                {m.kind === 'snap' ? (
                  <>
                    <Field label="Card title"><TextInput value={m.text || ''} onChange={(e) => updateMessage(i, { text: e.target.value })} placeholder="Sent a Snap" /></Field>
                    <Field label="Card subtitle"><TextInput value={m.sub || ''} onChange={(e) => updateMessage(i, { sub: e.target.value })} placeholder="Opened · 2m" /></Field>
                  </>
                ) : m.kind === 'image' ? (
                  <ImageField value={m.image} onChange={(image) => updateMessage(i, { image })} label="Photo" square />
                ) : (
                  <Field label="Message"><TextArea rows={2} value={m.text || ''} onChange={(e) => updateMessage(i, { text: e.target.value })} /></Field>
                )}
              </div>
            </RepeatItem>
          ))}
          <AddButton onClick={addMessage}>Add message</AddButton>
        </div>
      </Section>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Lock screen                                                         */
/* ------------------------------------------------------------------ */
const LOCK_APPS = ['imessage', 'instagram', 'x', 'tiktok', 'whatsapp', 'discord', 'snapchat', 'spotify', 'youtube', 'reddit', 'phone']

export function LockScreenForm({ project, data, set }) {
  const notifs = data.notifications || []
  const update = (i, patch) => set({ notifications: notifs.map((n, j) => (j === i ? { ...n, ...patch } : n)) })
  return (
    <>
      <Section title="Lock screen" hint="The drama shot. Use a dark, moody wallpaper for the best contrast.">
        <div className="stack" style={{ gap: 12 }}>
          <ImageField value={data.wallpaper} onChange={(wallpaper) => set({ wallpaper })} label="Wallpaper" hint="portrait crop" />
          <div className="field-row">
            <Field label="Date"><TextInput value={data.date || ''} onChange={(e) => set({ date: e.target.value })} placeholder="Monday, October 12" /></Field>
            <Field label="Big clock"><TextInput value={data.time || ''} onChange={(e) => set({ time: e.target.value })} placeholder="9:41" /></Field>
          </div>
          <div className="field-row">
            <Field label="Weather widget"><TextInput value={data.weather || ''} onChange={(e) => set({ weather: e.target.value })} placeholder="18°  Cloudy" /></Field>
            <Field label="Calendar widget"><TextInput value={data.event || ''} onChange={(e) => set({ event: e.target.value })} placeholder="Record fair · 10:00 AM" /></Field>
          </div>
          <Field label="Extra hidden notifications" hint="optional count"><NumField value={data.moreCount || 0} onChange={(v) => set({ moreCount: v })} /></Field>
        </div>
      </Section>
      <Section title="Notifications" hint="Stack up to four. Messages from a cast member show their photo." action={<span className="pill">{notifs.length}</span>}>
        <div className="stack" style={{ gap: 8 }}>
          {notifs.map((n, i) => {
            const cast = project.cast.find((c) => c.id === n.castId)
            return (
              <RepeatItem
                key={n.id || i}
                index={i}
                title={n.body || 'Empty notification'}
                subtitle={`${n.app || 'imessage'}${cast ? ` · ${cast.name}` : ''}`}
                onRemove={() => set({ notifications: notifs.filter((_, j) => j !== i) })}
                onUp={i > 0 ? () => set({ notifications: move(notifs, i, i - 1) }) : null}
                onDown={i < notifs.length - 1 ? () => set({ notifications: move(notifs, i, i + 1) }) : null}
              >
                <div className="stack" style={{ gap: 10 }}>
                  <div className="field-row">
                    <Field label="App">
                      <select className="select" value={n.app || 'imessage'} onChange={(e) => update(i, { app: e.target.value })}>
                        {LOCK_APPS.map((a) => <option key={a} value={a}>{a === 'x' ? 'X' : a[0].toUpperCase() + a.slice(1)}</option>)}
                      </select>
                    </Field>
                    <Field label="Time"><TextInput value={n.time || ''} onChange={(e) => update(i, { time: e.target.value })} placeholder="now" /></Field>
                  </div>
                  <CastSelect project={project} value={n.castId} onChange={(v) => update(i, { castId: v })} label="From character" includeEmpty emptyLabel="No character (app notification)" />
                  <Field label="Title"><TextInput value={n.title || ''} onChange={(e) => update(i, { title: e.target.value })} placeholder={cast?.name || 'Messages'} /></Field>
                  <Field label="Body"><TextArea rows={2} value={n.body || ''} onChange={(e) => update(i, { body: e.target.value })} /></Field>
                </div>
              </RepeatItem>
            )
          })}
          <AddButton onClick={() => set({ notifications: [...notifs, { id: uid('n'), app: 'imessage', castId: project.cast[0]?.id || '', title: '', body: '', time: 'now' }] })}>
            Add notification
          </AddButton>
        </div>
      </Section>
    </>
  )
}
