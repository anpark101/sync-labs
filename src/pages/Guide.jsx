import React from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  Camera,
  Clock,
  Download,
  HeartHandshake,
  Image as ImageIcon,
  MessageCircle,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Wand2,
} from 'lucide-react'
import Shell from '../components/Shell.jsx'
import { PLATFORMS, screenTypeCount } from '../data/platforms.js'
import { BrandIcon } from '../screens/ui.jsx'

const SECTIONS = [
  { id: 'what', label: 'What an AU is' },
  { id: 'shape', label: 'Shaping a story' },
  { id: 'platforms', label: 'Which platform when' },
  { id: 'real', label: 'Making it look real' },
  { id: 'first', label: 'Your first AU' },
  { id: 'saving', label: 'Saving your work' },
  { id: 'faq', label: 'Questions' },
]

const PLATFORM_NOTES = {
  imessage: {
    when: 'The private core of the story.',
    use: 'Late-night confessions, group-chat chaos, the message left on read. Lock Screen screens are perfect for a cliffhanger or a chapter break.',
    icon: <MessageCircle size={16} />,
  },
  instagram: {
    when: 'The curated version of a life.',
    use: 'A soft launch, a location that gives someone away, a story posted at 2am, a profile stalked by the reader.',
    icon: <Camera size={16} />,
  },
  x: {
    when: 'The public square.',
    use: 'Viral posts, threads that unravel, burner accounts, quote tweets from strangers. Great for consequences.',
    icon: <Star size={16} />,
  },
  tiktok: {
    when: 'When the internet gets involved.',
    use: 'A video someone else filmed, a comment section doing detective work, a profile that becomes a plot device.',
    icon: <Sparkles size={16} />,
  },
  whatsapp: {
    when: 'Family, logistics, and read receipts.',
    use: 'Group chats with timestamps, a parent texting in all caps, plans that go wrong in real time.',
    icon: <Phone size={16} />,
  },
  discord: {
    when: 'Community and fandom.',
    use: 'Fandom servers, voice-chat lore, a channel where everyone knows everyone, mods losing control.',
    icon: <Users size={16} />,
  },
  snapchat: {
    when: 'Anything that disappears.',
    use: 'Flirting, proof, threats, streaks. The tension of a screenshot that could ruin everything.',
    icon: <HeartHandshake size={16} />,
  },
  spotify: {
    when: 'A song says what dialogue cannot.',
    use: 'A now-playing screen with a note. End a chapter on it; readers will do the rest.',
    icon: <Wand2 size={16} />,
  },
  youtube: {
    when: 'The video that breaks the story open.',
    use: 'A vlog, an interview, a leaked clip. The comments below are where the plot reacts.',
    icon: <Camera size={16} />,
  },
  reddit: {
    when: 'The internet as detective.',
    use: 'A post asking “am I the asshole?”, a thread piecing clues together, a throwaway account that is not as anonymous as it thinks.',
    icon: <Search size={16} />,
  },
}

function Section({ id, icon, eyebrow, title, children }) {
  return (
    <section className="guide-section" id={id}>
      <div className="guide-section-head">
        <span className="feature-icon">{icon}</span>
        <span>
          <em className="eyebrow">{eyebrow}</em>
          <h2 className="display">{title}</h2>
        </span>
      </div>
      {children}
    </section>
  )
}

export default function Guide() {
  return (
    <Shell>
      <div className="page guide-page">
        <header className="guide-hero">
          <span className="eyebrow">
            <BookOpen size={13} /> The field guide
          </span>
          <h1 className="display">
            Everything you need to write a story <em className="accent">people screenshot.</em>
          </h1>
          <p className="muted">
            A social media AU is a story told entirely through the things people post, text, and delete. This page is the
            short version: shape, platforms, and the details that make a fake screenshot feel real.
          </p>
          <div className="guide-hero-actions">
            <Link to="/new" className="btn btn-primary">
              Start an AU <ArrowRight size={15} />
            </Link>
            <Link to="/" className="btn btn-outline">
              Browse the library
            </Link>
          </div>
          <div className="guide-stats">
            <span>
              <b>{PLATFORMS.length}</b> platforms
            </span>
            <span>
              <b>{screenTypeCount}</b> screen types
            </span>
            <span>
              <b>∞</b> characters
            </span>
            <span>
              <b>390 × 844</b> export size
            </span>
          </div>
        </header>

        <div className="guide-layout">
          <nav className="guide-toc" aria-label="Guide contents">
            <span className="eyebrow">On this page</span>
            {SECTIONS.map((s, i) => (
              <a key={s.id} href={`#${s.id}`} className="guide-toc-link">
                <span className="serif">{String(i + 1).padStart(2, '0')}</span>
                {s.label}
              </a>
            ))}
          </nav>

          <div className="guide-body">
            <Section id="what" icon={<Sparkles size={18} />} eyebrow="The form" title="What a social media AU is">
              <p>
                An <b>AU</b> — alternate universe — is fanfiction that asks “what if these people lived in this situation?”
                A <b>SMAU</b> tells that story through invented social media: fake texts, tweets, posts, stories, group
                chats, notifications. The reader scrolls it the way they scroll their own phone, which is exactly why it
                lands.
              </p>
              <p>
                You do not need a fandom to start. Original characters work beautifully — the reader only needs a few
                screens to believe they know these people.
              </p>
              <div className="guide-callout">
                <Clock size={18} />
                <div>
                  <b>The unspoken contract</b>
                  <p className="small">
                    Readers accept that it is fiction. What they want is the <i>feeling</i> of seeing something private.
                    One message left on read is worth a page of description.
                  </p>
                </div>
              </div>
            </Section>

            <Section id="shape" icon={<Wand2 size={18} />} eyebrow="Structure" title="Shaping a story people finish">
              <ol className="guide-list numbered">
                <li>
                  <b>The hook screen.</b> A post, a text, a notification that raises a question in one glance.
                </li>
                <li>
                  <b>Meet the cast.</b> Two to five people, one contradiction each. Give them handles you can remember.
                </li>
                <li>
                  <b>The public / private gap.</b> Show what is said in the group chat, then what is posted publicly.
                  The gap is the story.
                </li>
                <li>
                  <b>Escalation.</b> Likes climb, strangers quote-tweet, a screenshot leaks. Switch platforms as the stakes
                  rise.
                </li>
                <li>
                  <b>The quiet beat.</b> One intimate screen after all the noise — a voice note, a 3am text, a song.
                </li>
                <li>
                  <b>The ending.</b> A post that closes the question you opened in screen one. Then stop.
                </li>
              </ol>
              <div className="guide-grid">
                <div className="mini-panel">
                  <b>Aim for 8–15 screens</b>
                  <p className="small muted">Enough to build a world; short enough to read in one sitting.</p>
                </div>
                <div className="mini-panel">
                  <b>End on a screenshot</b>
                  <p className="small muted">The best AUs leave one image readers want to send to a friend.</p>
                </div>
                <div className="mini-panel">
                  <b>Read it in order</b>
                  <p className="small muted">Use the reader view to feel the pacing before you export.</p>
                </div>
              </div>
            </Section>

            <Section id="platforms" icon={<Users size={18} />} eyebrow="Cheat sheet" title="Which platform, when">
              <p>
                Each platform changes what the reader is allowed to know. A text is private; a post is not. Move between
                them for contrast, not decoration.
              </p>
              <div className="guide-platforms">
                {PLATFORMS.map((p) => {
                  const note = PLATFORM_NOTES[p.id] || { when: p.blurb, use: '', icon: <Sparkles size={16} /> }
                  return (
                    <article className="guide-platform" key={p.id}>
                      <div className="guide-platform-head">
                        <span className="platform-dot" style={{ color: p.id === 'x' ? 'var(--text)' : p.tint }}>
                          <BrandIcon name={p.id} size={18} />
                        </span>
                        <div>
                          <b>{p.name}</b>
                          <em>{note.when}</em>
                        </div>
                      </div>
                      <p className="small muted">{note.use}</p>
                      <div className="guide-platform-tags">
                        {p.screens.map((s) => (
                          <span className="pill tiny" key={s.type}>
                            {s.label}
                          </span>
                        ))}
                      </div>
                    </article>
                  )
                })}
              </div>
            </Section>

            <Section id="real" icon={<ShieldCheck size={18} />} eyebrow="Suspension of disbelief" title="Making it look real">
              <p>
                Readers forgive an invented plot long before they forgive a detail that breaks the illusion. These are the
                details that matter, in order:
              </p>
              <ul className="guide-list">
                <li>
                  <b>Time adds up.</b> 9:41 on a lockscreen, then 9:43 in the chat. The studio lets you set the status bar
                  time per screen.
                </li>
                <li>
                  <b>Handles stay consistent.</b> One character, one handle, everywhere. The cast tab keeps them in sync.
                </li>
                <li>
                  <b>Numbers move.</b> A like count should climb between screens; a group chat should gain members, not
                  lose them.
                </li>
                <li>
                  <b>Side characters exist.</b> One reply from a stranger makes a tweet feel public.
                </li>
                <li>
                  <b>Battery and signal.</b> A character who has been up all night should not have a full battery at 4am.
                </li>
                <li>
                  <b>Read receipts are a plot device.</b> “Delivered” instead of “Read” says more than dialogue.
                </li>
              </ul>
              <div className="guide-callout">
                <ImageIcon size={18} />
                <div>
                  <b>The screenshot test</b>
                  <p className="small">
                    Cover the caption. Could a stranger tell who these people are, how they feel, and what just happened?
                    If yes, the screen works.
                  </p>
                </div>
              </div>
            </Section>

            <Section id="first" icon={<Sparkles size={18} />} eyebrow="Walkthrough" title="Your first AU in ten minutes">
              <ol className="guide-list numbered">
                <li>
                  <b>Pick a starter.</b> Templates gives you a group chat, a soft launch, a fake-dating plot and more —
                  every screen is editable. Or start blank.
                </li>
                <li>
                  <b>Name the story and the cast.</b> Two characters is enough. Add avatars from the stock library or your
                  own camera roll.
                </li>
                <li>
                  <b>Add your opening screen.</b> Inside, “Add screen” lets you choose a platform and then the exact kind
                  — chat, post, story, profile, thread, DM.
                </li>
                <li>
                  <b>Write badly, then fix it.</b> Fill the messages first; polish the likes, times and replies after.
                </li>
                <li>
                  <b>Set the look.</b> The Look tab holds frames, theme, status bar and watermark. Per-screen overrides
                  live at the bottom of each editor.
                </li>
                <li>
                  <b>Read it back.</b> The reader link plays the screens in order, like the finished thing.
                </li>
                <li>
                  <b>Export.</b> Download a ZIP at 2× for posting, or a single screen for a teaser. A backup file is one
                  tap away.
                </li>
              </ol>
              <div className="guide-cta">
                <div>
                  <b>Ready?</b>
                  <p className="small muted">The demo project “After Hours” is already in your library — open it to see a finished story.</p>
                </div>
                <Link to="/new" className="btn btn-primary btn-sm">
                  Browse templates
                </Link>
              </div>
            </Section>

            <Section id="saving" icon={<Download size={18} />} eyebrow="The important part" title="Saving your work">
              <p>
                Your studio saves to this browser automatically, about half a second after you stop typing. You will see
                “Saved” in the top bar when it lands. But a browser is not a permanent home — phones clear data when
                space runs out.
              </p>
              <div className="guide-grid">
                <div className="mini-panel">
                  <b>Weekly backup</b>
                  <p className="small muted">
                    Settings → Download full backup. One file, every project, images included. Email it to yourself.
                  </p>
                </div>
                <div className="mini-panel">
                  <b>Restore anywhere</b>
                  <p className="small muted">Settings → Restore from a file brings projects back on any device.</p>
                </div>
                <div className="mini-panel">
                  <b>Export the PNGs too</b>
                  <p className="small muted">Screens in your camera roll survive even a cleared browser.</p>
                </div>
              </div>
              <p className="help">
                Everything is stored on your device only — there is no account, no server, and nothing to log into.
              </p>
            </Section>

            <Section id="faq" icon={<BookOpen size={18} />} eyebrow="Odds and ends" title="Questions writers ask">
              <div className="guide-faq">
                <details>
                  <summary>Is it okay to make fake posts?</summary>
                  <p>
                    For fiction, yes — that is the whole tradition. Keep it clearly invented: don’t impersonate a real
                    person, don’t pass screenshots off as real events, and don’t use it to harass anyone.
                  </p>
                </details>
                <details>
                  <summary>Can I use real people’s photos?</summary>
                  <p>
                    Use your own photos, stock images, or illustrations you have the right to use. The stock library is
                    there so you never have to borrow a stranger’s face.
                  </p>
                </details>
                <details>
                  <summary>What size are exports?</summary>
                  <p>
                    Every screen is a 390 × 844 artboard. At 2× — the default — that is 780 × 1688 px, which is what
                    social apps expect. 3× gives you 1170 × 2532 px.
                  </p>
                </details>
                <details>
                  <summary>Can I write more than one AU?</summary>
                  <p>
                    As many as you like. Each project has its own cast, screens and look, and the library keeps them
                    separate.
                  </p>
                </details>
                <details>
                  <summary>Why does the app ask to keep my data?</summary>
                  <p>
                    Browsers can evict site storage under pressure. “Ask browser to keep my data” requests persistent
                    storage. Backups are still the only guarantee.
                  </p>
                </details>
                <details>
                  <summary>How do I move a story to a new phone?</summary>
                  <p>
                    Download a backup on the old phone, send the file to the new one, then Settings → Restore from a file.
                    Every image travels inside the JSON.
                  </p>
                </details>
              </div>
            </Section>

            <div className="guide-end">
              <span className="eyebrow">One last thing</span>
              <h2 className="display">Write the screen you want to see.</h2>
              <p className="muted">
                There is no algorithm here and nobody to impress. Start with one message you cannot get out of your head,
                and build the story that explains it.
              </p>
              <Link to="/new" className="btn btn-primary">
                Start writing <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  )
}
