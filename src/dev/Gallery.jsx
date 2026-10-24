import React from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter'
import '@fontsource/grand-hotel'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import '../styles/base.css'
import '../styles/screens.css'
import '../styles/fidelity.css'
import { buildDemoProject } from '../data/demo.js'
import { makeScreenData } from '../data/defaults.js'
import { PhoneArtboard } from '../screens/Phone.jsx'

const KEYS = [
  ['imessage', 'chat'],
  ['imessage', 'lockscreen'],
  ['instagram', 'post'],
  ['instagram', 'story'],
  ['instagram', 'profile'],
  ['instagram', 'dm'],
  ['x', 'post'],
  ['x', 'thread'],
  ['x', 'profile'],
  ['tiktok', 'video'],
  ['tiktok', 'profile'],
  ['whatsapp', 'chat'],
  ['discord', 'chat'],
  ['snapchat', 'chat'],
  ['spotify', 'nowplaying'],
  ['youtube', 'video'],
  ['reddit', 'post'],
]

const project = buildDemoProject()
const only = new URLSearchParams(location.search).get('only')
const list = only ? KEYS.filter(([p, t]) => `${p}/${t}` === only) : KEYS

const screens = list.map(([platformId, type], i) => ({
  id: `gal-${i}`,
  platformId,
  type,
  title: `${platformId} · ${type}`,
  data: makeScreenData(platformId, type, project),
  design: {},
}))

createRoot(document.getElementById('root')).render(
  <div className="gal">
    {screens.map((s) => (
      <div className="gal-item" key={s.id}>
        <span className="gal-label">{s.platformId} / {s.type}</span>
        <div className="gal-frame" id={`qa-${s.platformId}-${s.type}`}>
          <PhoneArtboard project={project} screen={s} />
        </div>
      </div>
    ))}
  </div>
)
