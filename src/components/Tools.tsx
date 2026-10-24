import React, { useState } from 'react';
import { useStore } from '../store';
import type { Screen } from './App';
import { buildTemplates } from '../templates';
import { IDrama, ISparkle } from './icons';

const PROMPTS = [
  'They screenshot your 1am “thinking of you” text and you find out the next day.',
  'The group chat goes silent for 4 hours. Then one voice note. 6 seconds long.',
  'You post the photo. 3 minutes later, they story it with “who’s this??” and 47 replies.',
  'The rival replies to your anonymous post. From their main account.',
  '“delete this after you read it” — they never delete it.',
  'The lock screen shows 3 notifications from the same person. All within 2 minutes. It’s 3:47 AM.',
  'They repost your post to their story with one word: “finally.”',
  'The comment section has 2,300 comments. The top one is “POV: you just found out”.',
  'The DM says “we need to talk” and then nothing for 11 days.',
  'Their reel gets 100k likes. The caption is just “for you.”',
  'You catch them double-tapping your photo from the group chat screenshot.',
  '“it’s not a big deal” — said by someone who posted it to 6 platforms.',
  'The thread that started with “quick question” ended with 40 posts and a confession.',
  'Their story is one second of black. The music says everything.',
  'You see “seen” at 2:47 AM. It’s been 2 hours. Your thumbs are shaking.',
];

export default function Tools({ nav, toast }: { nav: (s: Screen) => void; toast: (m: string) => void }) {
  const store = useStore();
  const [prompt, setPrompt] = useState('');
  const [used, setUsed] = useState(false);

  const useTemplate = (idx: number) => {
    buildTemplates(store, idx);
    toast('Template added to your AUs');
    nav({ name: 'home' });
  };

  const rollPrompt = () => {
    const p = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
    setPrompt(p);
    setUsed(true);
  };

  return (
    <div>
      <div className="topbar">
        <div className="brand">
          <div className="brand-logo">🛠</div>
          <div className="brand-name">Tools</div>
        </div>
      </div>

      <div className="section">
        <div className="section-title">Starter AUs (templates)</div>
        <button className="template-card" onClick={() => useTemplate(0)}>
          <h4>💌 The 2AM Confession</h4>
          <p>A late-night WhatsApp confession, a 42-second voice note, and the tweet that broke the internet.</p>
          <div className="tpl-meta">5 moments · romance · slowburn</div>
        </button>
        <button className="template-card" onClick={() => useTemplate(1)}>
          <h4>⚔️ Anonymous Rivalry</h4>
          <p>An anonymous account, a forced group project, and a group chat that finds out everything.</p>
          <div className="tpl-meta">5 moments · school · rivals</div>
        </button>
        <button className="template-card" onClick={() => useTemplate(2)}>
          <h4>🎂 Group Chat Chaos</h4>
          <p>Planning a surprise where the victim is in the group chat. Total collapse guaranteed.</p>
          <div className="tpl-meta">5 moments · friends · party</div>
        </button>
        <div className="hintbox" style={{ marginTop: 12 }}>
          Templates add <b>their characters to your Crew</b> and create a ready-to-edit AU. Duplicate, rename, and make it yours.
        </div>

        <div className="section-title">Drama prompt generator</div>
        <div className="card" style={{ padding: 18, textAlign: 'center' }}>
          <div style={{ fontSize: 34 }}>🎲</div>
          {prompt ? (
            <div style={{ fontSize: 15.5, lineHeight: 1.5, margin: '10px 4px 14px' }}>{prompt}</div>
          ) : (
            <div style={{ color: 'var(--muted)', fontSize: 14, margin: '10px 4px 14px' }}>Writer’s block? Let the universe give you a scene.</div>
          )}
          <div className="btn-row">
            <button className="btn primary" onClick={rollPrompt}><IDrama size={16} /> {used ? 'Another one' : 'Roll a prompt'}</button>
            {prompt ? (
              <button className="btn" onClick={() => {
                const p = store.addProject({ title: 'New AU', description: prompt, tags: ['prompt'] });
                toast('AU created with this prompt');
                nav({ name: 'project', id: p.id });
              }}>
                <ISparkle size={15} /> Make it an AU
              </button>
            ) : null}
          </div>
        </div>

        <div className="section-title">About</div>
        <div className="card" style={{ padding: 16, fontSize: 13, color: 'var(--muted)', lineHeight: 1.55 }}>
          <b style={{ color: 'var(--text)' }}>AUverse Studio</b> is a fictional social-media AU (SMAU) creator. Everything you make here is fiction for your own creative world — characters, conversations, and metrics are invented.
          <br /><br />
          Platform looks are imitated for creative parody / storytelling purposes. Not affiliated with Apple, Meta, X, TikTok, Telegram, WhatsApp, or Reddit.
        </div>
      </div>
    </div>
  );
}
