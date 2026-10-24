import React, { useRef, useState } from 'react';
import { useStore } from '../store';
import { SyncPill } from './App';
import { ICloud, ICloudOff, IDevice, ISave, ITrash } from './icons';
import { downloadBlob, estimateSize, fmtBytes, timeAgo } from '../util';
import type { AppState } from '../types';

export default function Settings({ toast }: { toast: (m: string) => void }) {
  const store = useStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [size, setSize] = useState(0);

  React.useEffect(() => {
    const t = setInterval(() => estimateSize().then(setSize), 2000);
    estimateSize().then(setSize);
    return () => clearInterval(t);
  }, []);

  const exportBackup = () => {
    const state = store.exportState();
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    downloadBlob(blob, `auverse-backup-${new Date().toISOString().slice(0, 10)}.json`);
    toast('Backup file downloaded');
  };

  const importBackup = async (f: File) => {
    try {
      const text = await f.text();
      const state = JSON.parse(text) as AppState;
      if (!state || !Array.isArray(state.projects) || !Array.isArray(state.characters)) {
        alert('That file does not look like an AUverse backup.');
        return;
      }
      const { merged } = store.importState(state);
      toast(`Imported — now ${merged} items total`);
    } catch {
      alert('Could not read that file. Is it a valid AUverse backup?');
    }
  };

  const cloudOk = store.sync === 'cloud';

  return (
    <div>
      <div className="topbar">
        <div className="brand">
          <div className="brand-logo">⚙️</div>
          <div className="brand-name">More</div>
        </div>
        <SyncPill />
      </div>

      <div className="section">
        <div className="section-title">Saving</div>
        <div className="card" style={{ padding: 6 }}>
          <div className="settings-row" style={{ cursor: 'default' }}>
            <span className="settings-ic"><IDevice size={18} /></span>
            <span style={{ flex: 1 }}>
              Saved on this device
              <span className="sub">
                Automatic, instant, even offline · {fmtBytes(size)} stored · {store.state.projects.length} AUs, {store.state.characters.length} characters
              </span>
            </span>
            <span style={{ color: 'var(--ok)', fontSize: 12, fontWeight: 700 }}>ON</span>
          </div>
          <div className="settings-row" style={{ cursor: 'default' }}>
            <span className="settings-ic">{cloudOk ? <ICloud size={18} style={{ color: 'var(--ok)' }} /> : <ICloudOff size={18} />}</span>
            <span style={{ flex: 1 }}>
              Cloud backup (this studio server)
              <span className="sub">
                {cloudOk
                  ? `Synced ${store.lastCloudSync ? timeAgo(store.lastCloudSync) : 'just now'} · open this link from any device to see it`
                  : 'Server unreachable right now — everything is still saved on this device'}
              </span>
            </span>
            <span style={{ color: cloudOk ? 'var(--ok)' : 'var(--warn)', fontSize: 12, fontWeight: 700 }}>{cloudOk ? 'ON' : 'OFF'}</span>
          </div>
          <div style={{ padding: '12px 14px 14px' }}>
            <div className="btn-row">
              <button className="btn" onClick={exportBackup}><ISave size={16} /> Download backup (.json)</button>
              <button className="btn" onClick={() => fileRef.current?.click()}>⬆️ Import backup</button>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                e.target.value = '';
                if (f) importBackup(f);
              }}
            />
            <div className="hintbox" style={{ marginTop: 12, marginBottom: 0 }}>
              <b>How saving works:</b> every change is saved to your phone the instant it happens (IndexedDB), then pushed to the studio server a second later. The <b>.json backup</b> is your portable copy — import it on any device to restore everything.
            </div>
          </div>
        </div>

        <div className="section-title">Data</div>
        <div className="card" style={{ padding: 6 }}>
          <button
            className="settings-row"
            style={{ color: 'var(--danger)' }}
            onClick={() => {
              if (confirm('Delete ALL AUs, characters, and notes from this device AND the cloud? This cannot be undone.')) {
                store.clearAll();
                toast('Everything cleared');
              }
            }}
          >
            <span className="settings-ic" style={{ color: 'var(--danger)' }}><ITrash size={17} /></span>
            Erase everything
            <span className="sub">All AUs, characters, and backups on device + cloud</span>
          </button>
        </div>

        <div className="section-title">About</div>
        <div className="card" style={{ padding: 16, fontSize: 13, color: 'var(--muted)', lineHeight: 1.55 }}>
          <b style={{ color: 'var(--text)' }}>AUverse Studio v1.0</b>
          <br />
          A social media AU (SMAU) maker for fictional creativity: fake iMessage, WhatsApp, Telegram, Instagram (feed / story / DM / reel), X, TikTok, Snapchat, Reddit, Facebook, and iOS lock screens — with characters, timelines, 2× PNG export, and local + cloud saving.
          <br /><br />
          Made for self-indulgent fan-fiction. All content is fictional. Not affiliated with any platform.
        </div>
      </div>
    </div>
  );
}
