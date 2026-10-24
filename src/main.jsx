import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import '@fontsource-variable/inter'
import '@fontsource/instrument-serif/400.css'
import '@fontsource/instrument-serif/400-italic.css'
import '@fontsource/grand-hotel'
import './styles/base.css'
import './styles/screens.css'
import './styles/studio.css'
import App from './App.jsx'
import { StudioProvider } from './lib/store.jsx'
import { FeedbackProvider } from './components/Feedback.jsx'

createRoot(document.getElementById('root')).render(
  <HashRouter>
    <FeedbackProvider>
      <StudioProvider>
        <App />
      </StudioProvider>
    </FeedbackProvider>
  </HashRouter>
)
