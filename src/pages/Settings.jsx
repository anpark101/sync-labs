import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowLeft,
  CloudDownload,
  CloudUpload,
  Database,
  HardDrive,
  Info,
  Loader2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import Shell from '../components/Shell.jsx'
import { SaveIndicator } from '../components/Shell.jsx'
import { useStudio } from '../lib/store.jsx'
import { useFeedback } from '../components/Feedback.jsx'
import { Segmented, Toggle } from '../editor/fields.jsx'
import { downloadBackup } from '../lib/exporter.jsx'
import { pickFile, prettyBytes } from '../lib/media.js'
import { storage } from '../lib/db.js'
import { relativeDate } from '../lib/util.js'

export default function Settings() {
  const { projects, settings, patchSettings, storageEstimate, importProject, deleteProject, flush, markBackedUp } =
    useStudio()
  const { success, error, confirm } = useFeedback()
  const [busy, setBusy] = useState(null)

  const screenCount = projects.reduce((n, p) => n + p.screens.length, 0)
  const used = storageEstimate?.usage || 0
  const quota = storageEstimate?.quota || 0
  const percent = quota ? Math.min(100, Math.round((used / quota) * 100)) : 0

  const backupAll = () => {
    if (!projects.length) return error('There is nothing to back up yet.')
    downloadBackup(projects)
    markBackedUp()
    success(`Backed up ${projects.length} project${projects.length === 1 ? '' : 's'} — keep the file somewhere safe.`)
  }

  const restore = async () => {
    if (busy) return
    setBusy('restore')
    try {
      const file = await pickFile('.json,application/json')
      if (!file) return
      if (file.size > 60 * 1024 * 1024) {
        error('That file is too large for this browser. Try a single project backup.')
        return
      }
      const text = await file.text()
      let parsed
      try {
        parsed = JSON.parse(text)
      } catch {
        error('That file is not valid JSON — is it an Elsewhere backup?')
        return
      }
      const list = Array.isArray(parsed) ? parsed : Array.isArray(parsed.projects) ? parsed.projects : parsed.screens ? [parsed] : []
      if (!list.length) {
        error('No projects were found in that file.')
        return
      }
      let restored = 0
      for (const raw of list) {
        try {
          importProject(raw)
          restored += 1
        } catch (e) {
          console.warn('Skipped a project while restoring', e)
        }
      }
      await flush()
      if (restored) success(`Restored ${restored} project${restored === 1 ? '' : 's'}.`)
      else error('Those projects could not be read.')
    } catch (e) {
      console.error(e)
      error('Something went wrong while restoring that file.')
    } finally {
      setBusy(null)
    }
  }

  const keepData = async () => {
    setBusy('persist')
    try {
      const granted = await storage.requestPersistence()
      if (granted) success('This browser will now fight to keep your work.')
      else error('The browser declined — keep downloading backups to be safe.')
    } finally {
      setBusy(null)
    }
  }

  const eraseAll = async () => {
    if (!projects.length) return
    const ok = await confirm({
      title: 'Delete every project?',
      body: `This removes ${projects.length} project${projects.length === 1 ? '' : 's'} and every image inside them from this device. Download a backup first if you might want them back.`,
      confirmLabel: 'Delete everything',
      destructive: true,
    })
    if (!ok) return
    projects.forEach((p) => deleteProject(p.id))
    await flush()
    success('All projects removed from this device.')
  }

  return (
    <Shell>
      <div className="page settings-page">
        <Link to="/" className="back-link">
          <ArrowLeft size={15} /> Library
        </Link>
        <div className="settings-head">
          <span className="eyebrow">
            <Sparkles size={13} /> Settings
          </span>
          <h1 className="display">
            Your studio, <em className="accent">your rules.</em>
          </h1>
          <p className="muted">
            Elsewhere is private by design: everything lives in this browser, not on a server. That makes backups the one
            habit worth keeping.
          </p>
        </div>

        <section className="settings-card">
          <div className="settings-card-head">
            <span className="feature-icon"><ShieldCheck size={18} /></span>
            <div>
              <h2>Saving &amp; backups</h2>
              <p className="small muted">Autosave is always on. Backups are your safety net if the browser is cleared.</p>
            </div>
            <SaveIndicator />
          </div>

          <div className="settings-backup-status">
            <div>
              <b>Last backup</b>
              <span className="muted small">
                {settings.lastBackupAt ? relativeDate(settings.lastBackupAt) : 'Never — download one now'}
              </span>
            </div>
            <div>
              <b>In this browser</b>
              <span className="muted small">
                {projects.length} project{projects.length === 1 ? '' : 's'} · {screenCount} screen{screenCount === 1 ? '' : 's'}
              </span>
            </div>
          </div>

          <div className="settings-actions">
            <button className="btn btn-primary" onClick={backupAll} disabled={!projects.length}>
              <CloudDownload size={15} /> Download full backup
            </button>
            <button className="btn btn-outline" onClick={restore} disabled={busy === 'restore'}>
              {busy === 'restore' ? <Loader2 size={15} className="spin" /> : <CloudUpload size={15} />}
              Restore from a file
            </button>
          </div>
          <p className="help">
            A backup is one <code>.elsewhere.json</code> file holding every screen, caption, avatar and photo — images are
            embedded, so nothing goes missing. Restoring adds projects back without touching what is already here.
          </p>
        </section>

        <section className="settings-card">
          <div className="settings-card-head">
            <span className="feature-icon"><HardDrive size={18} /></span>
            <div>
              <h2>Storage on this device</h2>
              <p className="small muted">Photos are the biggest thing you save. A few hundred screens still fit comfortably.</p>
            </div>
          </div>
          <div className="storage-bar">
            <i style={{ width: `${percent}%` }} className={percent > 80 ? 'warn' : ''} />
          </div>
          <div className="storage-labels">
            <span>
              <b>{prettyBytes(used)}</b> used
            </span>
            <span className="muted">{quota ? `${prettyBytes(quota)} available` : 'Browser estimate unavailable'}</span>
          </div>
          <div className="settings-actions">
            <button className="btn btn-outline btn-sm" onClick={keepData} disabled={busy === 'persist'}>
              <Database size={14} /> Ask browser to keep my data
            </button>
            <span className="help">Most browsers only clear site data when space runs out — this asks them not to.</span>
          </div>
        </section>

        <section className="settings-card">
          <div className="settings-card-head">
            <span className="feature-icon"><Sparkles size={18} /></span>
            <div>
              <h2>Appearance</h2>
              <p className="small muted">The studio theme. Your exported screens have their own light/dark look.</p>
            </div>
          </div>
          <div className="settings-field">
            <label>Theme</label>
            <Segmented
              value={settings.theme}
              onChange={(theme) => patchSettings({ theme })}
              options={[
                { value: 'dark', label: 'Night' },
                { value: 'light', label: 'Day' },
                { value: 'system', label: 'Match phone' },
              ]}
            />
          </div>
          <Toggle
            checked={Boolean(settings.reduceMotion)}
            onChange={(reduceMotion) => patchSettings({ reduceMotion })}
            label="Reduce motion"
            hint="Turns off sliding transitions and typing dots. Screens themselves stay unchanged."
          />
          <div className="settings-field">
            <label>Your name (optional)</label>
            <input
              className="input"
              value={settings.name || ''}
              placeholder="Shown on your library greeting"
              onChange={(e) => patchSettings({ name: e.target.value })}
            />
            <p className="help">Only stored on this device. It never leaves your browser.</p>
          </div>
        </section>

        <section className="settings-card danger">
          <div className="settings-card-head">
            <span className="feature-icon danger"><AlertTriangle size={18} /></span>
            <div>
              <h2>Start over</h2>
              <p className="small muted">Deleting is immediate and cannot be undone from inside the app.</p>
            </div>
          </div>
          <div className="settings-actions">
            <button className="btn btn-danger-ghost" onClick={eraseAll} disabled={!projects.length}>
              Delete all projects
            </button>
            <button className="btn btn-ghost btn-sm" onClick={backupAll} disabled={!projects.length}>
              Download a backup first
            </button>
          </div>
        </section>

        <div className="settings-about">
          <Info size={15} />
          <p className="small muted">
            Elsewhere AU Studio · a private workshop for fictional social media stories. Not affiliated with Instagram, X,
            TikTok, Snapchat, Discord, Spotify, YouTube, Reddit, WhatsApp or Apple. Characters and posts are inventions.
          </p>
        </div>
      </div>
    </Shell>
  )
}
