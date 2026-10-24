import React, { useCallback, useEffect, useState } from 'react';
import { useStore } from '../store';
import { ICloud, ICloudOff, IDevice, IPlus, IUsers, IGear, IHome, IDrama } from './icons';
import Home from './Home';
import ProjectEditor from './ProjectEditor';
import MomentScreen from './MomentScreen';
import Characters from './Characters';
import Tools from './Tools';
import Settings from './Settings';

export type Screen =
  | { name: 'home' }
  | { name: 'project'; id: string }
  | { name: 'moment'; projectId: string; momentId: string }
  | { name: 'characters' }
  | { name: 'tools' }
  | { name: 'settings' };

export function SyncPill() {
  const { sync } = useStore();
  if (sync === 'loading') return <span className="sync-pill"><span className="sync-dot" />Loading…</span>;
  if (sync === 'syncing') return <span className="sync-pill syncing"><span className="sync-dot" />Syncing…</span>;
  if (sync === 'cloud') return <span className="sync-pill cloud"><ICloud size={13} />Cloud saved</span>;
  if (sync === 'offline') return <span className="sync-pill offline"><ICloudOff size={13} />Saved on device</span>;
  return <span className="sync-pill"><IDevice size={13} />On device</span>;
}

export default function App() {
  const { loaded } = useStore();
  const [stack, setStack] = useState<Screen[]>([{ name: 'home' }]);
  const [toast, setToast] = useState<string | null>(null);

  const screen = stack[stack.length - 1];
  const nav = useCallback((s: Screen) => setStack((p) => [...p, s]), []);
  const back = useCallback(() => setStack((p) => (p.length > 1 ? p.slice(0, -1) : p)), []);
  const reset = useCallback((s: Screen) => setStack([s]), []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.clearTimeout((showToast as any)._t);
    (showToast as any)._t = window.setTimeout(() => setToast(null), 2600);
  }, []);

  const screenKey =
    screen.name === 'project' ? `project-${screen.id}` : screen.name === 'moment' ? `moment-${screen.momentId}` : screen.name;

  useEffect(() => {
    // scroll to top on screen change
    window.scrollTo(0, 0);
  }, [screenKey]);

  if (!loaded) {
    return (
      <div className="boot">
        <div className="boot-logo">AU</div>
        <div>Loading your universe…</div>
      </div>
    );
  }

  const topTab = screen.name === 'home' || screen.name === 'project' ? 'home' : screen.name;

  return (
    <div className="app">
      {screen.name === 'home' && <Home onOpen={(id) => nav({ name: 'project', id })} onTab={reset} toast={showToast} />}
      {screen.name === 'project' && <ProjectEditor id={screen.id} back={back} onOpenMoment={(momentId) => nav({ name: 'moment', projectId: screen.id, momentId })} toast={showToast} />}
      {screen.name === 'moment' && <MomentScreen projectId={screen.projectId} momentId={screen.momentId} back={back} toast={showToast} />}
      {screen.name === 'characters' && <Characters />}
      {screen.name === 'tools' && <Tools nav={nav} toast={showToast} />}
      {screen.name === 'settings' && <Settings toast={showToast} />}

      {toast && <div className="toast">{toast}</div>}

      <nav className="bottomnav">
        <button className={'navitem' + (topTab === 'home' ? ' active' : '')} onClick={() => reset({ name: 'home' })}>
          <IHome size={21} />
          <span>AUs</span>
        </button>
        <button className={'navitem' + (topTab === 'characters' ? ' active' : '')} onClick={() => reset({ name: 'characters' })}>
          <IUsers size={21} />
          <span>Crew</span>
        </button>
        <button className="navitem-fab" onClick={() => reset({ name: 'tools' })}>
          <span className="nav-fab"><IPlus size={26} /></span>
          <span>Create</span>
        </button>
        <button className={'navitem' + (topTab === 'tools' ? ' active' : '')} onClick={() => reset({ name: 'tools' })}>
          <IDrama size={21} />
          <span>Tools</span>
        </button>
        <button className={'navitem' + (topTab === 'settings' ? ' active' : '')} onClick={() => reset({ name: 'settings' })}>
          <IGear size={21} />
          <span>More</span>
        </button>
      </nav>
    </div>
  );
}
