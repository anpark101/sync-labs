import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Workspace from './pages/Workspace.jsx'

const Templates = lazy(() => import('./pages/Templates.jsx'))
const ScreenEditor = lazy(() => import('./pages/ScreenEditor.jsx'))
const Reader = lazy(() => import('./pages/Reader.jsx'))
const ExportPage = lazy(() => import('./pages/ExportPage.jsx'))
const Settings = lazy(() => import('./pages/Settings.jsx'))
const Guide = lazy(() => import('./pages/Guide.jsx'))

const Loading = () => (
  <div className="loading-screen">
    <span className="loading-mark"><span className="spinner" /></span>
    <p className="muted small">One moment…</p>
  </div>
)

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new" element={<Templates />} />
        <Route path="/p/:projectId" element={<Workspace />} />
        <Route path="/p/:projectId/s/:screenId" element={<ScreenEditor />} />
        <Route path="/p/:projectId/read" element={<Reader />} />
        <Route path="/p/:projectId/export" element={<ExportPage />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
