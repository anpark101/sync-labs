import React, { useLayoutEffect, useRef, useState } from 'react'
import { BLEED_SCREENS, getPlatform } from '../data/platforms.js'
import { cn } from '../lib/util.js'
import { HomeIndicator, StatusBar } from './ui.jsx'
import { ScreenRenderer } from './registry.jsx'

export const ARTBOARD_W = 390
export const ARTBOARD_H = 844

export const resolveTheme = (project, screen) => {
  const platform = getPlatform(screen?.platformId)
  const screenTheme = screen?.design?.theme
  if (screenTheme && screenTheme !== 'auto') return screenTheme
  const projectTheme = project?.style?.theme
  if (projectTheme && projectTheme !== 'auto') return projectTheme
  return platform.theme || 'light'
}

export const resolveChrome = (project, screen) => {
  const style = project?.style || {}
  const design = screen?.design || {}
  return {
    theme: resolveTheme(project, screen),
    island: design.island ?? style.island ?? true,
    statusBar: design.statusBar ?? style.statusBar ?? true,
    time: design.time || style.time || '9:41',
    battery: design.battery ?? style.battery ?? 78,
    frame: design.frame ?? style.frame ?? 'iphone',
    frameColor: style.frameColor || 'black',
    watermark: design.watermark ?? style.watermark ?? false,
    watermarkText: style.watermarkText || 'elsewhere',
  }
}

/**
 * The 390 × 844 artboard — this exact node is what gets exported.
 * Every platform renders inside this box, with the iOS status bar overlaid.
 */
export function PhoneArtboard({ project, screen, className = '', exportMode = false }) {
  const chrome = resolveChrome(project, screen)
  const key = `${screen?.platformId}/${screen?.type}`
  const bleed = BLEED_SCREENS.has(key)
  const variant = bleed ? 'light' : chrome.theme === 'dark' ? 'light' : 'dark'
  return (
    <div
      className={cn('artboard', className)}
      data-theme={chrome.theme}
      data-platform={screen?.platformId}
      style={{ width: ARTBOARD_W, height: ARTBOARD_H }}
    >
      <div className="artboard-screen">
        <ScreenRenderer project={project} screen={screen} />
      </div>
      {chrome.statusBar ? (
        <StatusBar
          time={key === 'imessage/lockscreen' ? '' : chrome.time}
          battery={chrome.battery}
          variant={variant}
          island={chrome.island}
          className={key === 'imessage/lockscreen' ? 'hide-time' : ''}
        />
      ) : null}
      {chrome.watermark ? (
        <span className="artboard-watermark" style={{ color: variant === 'light' ? '#fff' : '#111' }}>
          {chrome.watermarkText}
        </span>
      ) : null}
      <HomeIndicator variant={bleed ? 'light' : chrome.theme === 'dark' ? 'light' : 'dark'} />
      {exportMode ? null : <span className="artboard-glare" aria-hidden="true" />}
    </div>
  )
}

/** Decorative phone shell around the artboard, with responsive scaling. */
export function PhoneMock({ project, screen, showFrame = true, maxWidth, className = '', onClick }) {
  const wrapRef = useRef(null)
  const [scale, setScale] = useState(1)
  const pad = showFrame ? 10 : 0
  const baseW = ARTBOARD_W + pad * 2
  const baseH = ARTBOARD_H + pad * 2

  useLayoutEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const measure = () => {
      const w = el.clientWidth
      if (w > 0) setScale(Math.min(1, w / baseW))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [baseW])

  const stageW = baseW * scale
  const stageH = baseH * scale

  return (
    <div
      ref={wrapRef}
      className={cn('phone-mock', className)}
      style={{ width: '100%', maxWidth: maxWidth || baseW }}
    >
      <div className="phone-stage" style={{ width: stageW, height: stageH }}>
        <div
          className={cn('phone-shell', showFrame && 'with-frame', showFrame && `frame-${project?.style?.frameColor || 'black'}`)}
          style={{
            width: baseW,
            height: baseH,
            padding: pad,
            borderRadius: showFrame ? 54 : 0,
            transform: `scale(${scale})`,
          }}
          onClick={onClick}
        >
          <PhoneArtboard project={project} screen={screen} />
        </div>
      </div>
    </div>
  )
}
