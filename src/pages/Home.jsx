import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  CloudCheck,
  Download,
  Layers,
  Lock,
  MonitorSmartphone,
  Plus,
  Sparkles,
  Users,
  Wand2,
} from 'lucide-react'
import Shell from '../components/Shell.jsx'
import { PhoneMock } from '../screens/Phone.jsx'
import { BrandIcon } from '../screens/ui.jsx'
import { ProjectCard } from '../components/ProjectCard.jsx'
import { useStudio } from '../lib/store.jsx'
import { buildDemoProject } from '../data/demo.js'
import { PLATFORMS, platformCount, screenTypeCount } from '../data/platforms.js'

const FEATURES = [
  {
    icon: <Layers size={19} />,
    tone: '',
    title: 'Ten worlds, one studio',
    body: `iMessage, Instagram, X, TikTok, WhatsApp, Discord, Snapchat, Spotify, YouTube and Reddit — ${screenTypeCount} screen types that look like the real thing.`,
  },
  {
    icon: <CloudCheck size={19} />,
    tone: 'mint',
    title: 'Saves while you type',
    body: 'Every change lands in this browser automatically. Close the tab, lose signal, come back tomorrow — your AU is exactly where you left it.',
  },
  {
    icon: <Users size={19} />,
    tone: 'lilac',
    title: 'One cast, every screen',
    body: 'Set names, handles, profile photos and bios once. Characters follow you into chats, comments, posts and profiles.',
  },
  {
    icon: <Download size={19} />,
    tone: '',
    title: 'Screenshot-clean exports',
    body: 'Download any screen as a crisp 2× or 3× PNG, or export the whole AU as a numbered ZIP your readers can scroll.',
  },
  {
    icon: <Sparkles size={19} />,
    tone: 'lilac',
    title: 'The details do the work',
    body: 'Read receipts, typing dots, voice notes, verified badges, liked-by counts, poll votes, timestamps and unread dots — all editable.',
  },
  {
    icon: <MonitorSmartphone size={19} />,
    tone: 'mint',
    title: 'Built for your thumbs',
    body: 'A phone-first editor with a live preview that stays visible while you write. No design software, no blank canvas fear.',
  },
]

const STEPS = [
  {
    n: '01',
    title: 'Pick a starting point',
    body: 'Open one of six story starters or begin blank. You’re never stuck looking at an empty screen.',
    icon: <Wand2 size={16} />,
  },
  {
    n: '02',
    title: 'Cast your characters',
    body: 'Give everyone a name, handle and face. Then drop them into a group chat, a story, a thread — anywhere.',
    icon: <Users size={16} />,
  },
  {
    n: '03',
    title: 'Post the moment',
    body: 'Write the message, add the photo, hit export. Your readers get a screenshot that feels lifted from their own phone.',
    icon: <ArrowRight size={16} />,
  },
]

export default function Home() {
  const { projects, loaded, createProject } = useStudio()
  const fallbackDemo = useMemo(() => buildDemoProject(), [])
  const demo = projects.find((p) => p.demo) || fallbackDemo
  const heroScreen = demo.screens.find((s) => s.id === demo.coverScreenId) || demo.screens[0] || null
  const recent = projects.slice(0, 6)
  const totalScreens = projects.reduce((n, p) => n + p.screens.length, 0)

  const start = () => createProject({ templateId: 'blank', title: 'Untitled AU' })

  return (
    <Shell>
      <div className="page">
        <section className="home-hero">
          <div className="home-copy">
            <span className="eyebrow">A private studio for social media AUs</span>
            <h1 className="display">
              Write it like
              <br />
              <em>it happened.</em>
            </h1>
            <p>
              Build the group chat, the soft launch, the 2am post, the screenshot your readers will zoom into.
              Ten platforms, every detail editable — and everything saved automatically on your phone.
            </p>
            <div className="home-actions">
              <Link to="/new" className="btn btn-primary btn-lg">
                Start a new AU
                <ArrowRight size={17} />
              </Link>
              <Link to={`/p/${demo.id}`} className="btn btn-outline btn-lg">
                Open the sample
              </Link>
            </div>
            <div className="home-meta">
              <span><i /> {platformCount} platforms</span>
              <span><i /> {screenTypeCount} screen types</span>
              <span><i /> Autosave built in</span>
              <span><i /> No account needed</span>
            </div>
          </div>

          <div className="hero-visual">
            <span className="hero-orb" />
            <div className="hero-phone-wrap">
              {heroScreen ? <PhoneMock project={demo} screen={heroScreen} showFrame maxWidth={355} /> : null}
              <div className="hero-chip tl">
                <span className="chip-icon"><CloudCheck size={14} /></span>
                <span><b>Autosaved</b><br />just now, on this device</span>
              </div>
              <div className="hero-chip br">
                <span className="hero-platforms">
                  {['imessage', 'instagram', 'x', 'tiktok'].map((p) => (
                    <span key={p}><BrandIcon name={p} size={13} color={p === 'x' ? 'var(--text-2)' : p === 'tiktok' ? 'var(--text)' : p === 'imessage' ? '#34C759' : '#E1306C'} /></span>
                  ))}
                </span>
                <span><b>{platformCount} platforms</b><br />one story</span>
              </div>
            </div>
          </div>
        </section>

        <section className="platform-strip" aria-label="Supported platforms">
          <div className="platform-strip-inner">
            {PLATFORMS.map((p) => (
              <span className="platform-brand" key={p.id}>
                <BrandIcon name={p.id} size={16} color={p.id === 'x' ? 'currentColor' : p.tint} />
                {p.name}
              </span>
            ))}
          </div>
        </section>
      </div>

      <section className="section">
        <div className="page">
          <div className="section-head">
            <div>
              <span className="eyebrow">Built for the screenshot</span>
              <h2 className="display">Less editing. More <em className="accent" style={{ fontStyle: 'italic' }}>plot twist.</em></h2>
            </div>
            <p>
              Everything is designed around the moment your reader forgets it isn’t real — down to the read receipt.
            </p>
          </div>
          <div className="feature-grid">
            {FEATURES.map((f) => (
              <article className="feature-card" key={f.title}>
                <span className={`feature-icon ${f.tone}`}>{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="page">
          <div className="section-head">
            <div>
              <span className="eyebrow">From blank page to posted</span>
              <h2 className="display">Three taps to a <em className="accent" style={{ fontStyle: 'italic' }}>whole world.</em></h2>
            </div>
            <Link to="/guide" className="btn btn-outline btn-sm">
              <BookOpen size={15} /> Read the guide
            </Link>
          </div>
          <div className="steps">
            {STEPS.map((s) => (
              <article className="step" key={s.n}>
                <div className="spread">
                  <span className="step-num serif">{s.n}</span>
                  <span className="feature-icon" style={{ marginBottom: 0, width: 32, height: 32, borderRadius: 9 }}>{s.icon}</span>
                </div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="page">
          <div className="backup-panel">
            <div className="backup-copy">
              <span className="eyebrow">Progress, protected</span>
              <h2 className="display">Your AU is <em className="accent" style={{ fontStyle: 'italic' }}>yours.</em></h2>
              <p>
                No account, no feed, no strangers. Your screens live in this browser’s private storage and save after every keystroke.
                Want a second copy? Download a backup file and keep it in iCloud Drive, Google Drive, or wherever your photos live.
              </p>
              <div className="backup-list">
                <span className="backup-li"><CloudCheck size={15} /> Autosave on every edit — no save button to forget</span>
                <span className="backup-li"><Lock size={15} /> Private by design. Nothing is uploaded anywhere</span>
                <span className="backup-li"><Download size={15} /> One-tap backup includes every screen and photo</span>
              </div>
              <div className="row-wrap" style={{ marginTop: 8 }}>
                <Link to="/settings" className="btn btn-primary btn-sm">Manage backups</Link>
                <Link to="/guide" className="btn btn-ghost btn-sm">How saving works</Link>
              </div>
            </div>
            <div className="backup-visual">
              <div className="save-card">
                <span className="icon-box green"><CloudCheck size={16} /></span>
                <span className="grow"><b>Autosaved locally</b><small>Every change · this browser</small></span>
                <span className="pill" style={{ color: 'var(--success)', borderColor: 'transparent', background: 'transparent' }}>On</span>
              </div>
              <div className="save-card">
                <span className="icon-box lilac"><Download size={16} /></span>
                <span className="grow"><b>Backup file</b><small>Keep a copy in your cloud drive</small></span>
                <span className="tiny muted">.elsewhere</span>
              </div>
              <div className="save-card" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 4 }}>
                <div className="spread">
                  <span className="grow"><b>Storage used</b><small>{totalScreens} screens in your library</small></span>
                  <span className="tiny muted">Local</span>
                </div>
                <div className="save-bar"><i /></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="library">
        <div className="page">
          <div className="library-head">
            <div>
              <span className="eyebrow">Your library</span>
              <h2 className="display">Your stories</h2>
              <p className="muted small" style={{ marginTop: 4 }}>
                {loaded && projects.length
                  ? `${projects.length} AU${projects.length === 1 ? '' : 's'} · ${totalScreens} screen${totalScreens === 1 ? '' : 's'} · saved on this device`
                  : 'Nothing here yet. Your first AU is one tap away.'}
              </p>
            </div>
            <Link to="/new" className="btn btn-primary">
              <Plus size={16} /> New AU
            </Link>
          </div>
          {loaded && recent.length ? (
            <div className="project-grid">
              {recent.map((p) => <ProjectCard key={p.id} project={p} />)}
              <Link to="/new" className="empty-card">
                <span className="plus-circle"><Plus size={18} /></span>
                <span className="strong small" style={{ color: 'var(--text-2)' }}>Start another AU</span>
                <span className="tiny">Templates, starters, or a blank page</span>
              </Link>
            </div>
          ) : loaded ? (
            <div className="backup-visual" style={{ border: '1px dashed var(--line-strong)', borderRadius: 'var(--radius)', alignItems: 'center', textAlign: 'center', gap: 12, padding: 40, background: 'var(--panel)' }}>
              <span className="feature-icon"><Sparkles size={19} /></span>
              <h3 className="serif" style={{ fontSize: 26, fontWeight: 400 }}>Every universe starts with one message.</h3>
              <p className="muted small" style={{ maxWidth: 380 }}>Pick a starter and make it yours, or open the sample AU to see how the pieces fit together.</p>
              <div className="row-wrap" style={{ justifyContent: 'center' }}>
                <Link to="/new" className="btn btn-primary btn-sm">Browse starters</Link>
                <button className="btn btn-ghost btn-sm" onClick={start}>Start blank</button>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 20 }}>
        <div className="page center stack" style={{ alignItems: 'center', gap: 14, paddingBottom: 20 }}>
          <span className="eyebrow" style={{ alignSelf: 'center' }}>Soft launch your story</span>
          <h2 className="display" style={{ fontSize: 'clamp(40px, 6vw, 64px)' }}>The group chat is waiting.</h2>
          <p className="text-2 muted" style={{ maxWidth: 440, fontSize: 13.5 }}>
            Create the AU you keep imagining at 2am. It saves itself.
          </p>
          <Link to="/new" className="btn btn-primary btn-lg" style={{ marginTop: 6 }}>
            Start writing <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </Shell>
  )
}
