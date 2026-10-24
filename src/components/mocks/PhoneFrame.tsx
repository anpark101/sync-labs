import React from 'react';

/** iOS 18-style status bar */
export function StatusBar({ time = '9:41', dark = false }: { time?: string; dark?: boolean }) {
  const c = dark ? '#fff' : '#111';
  return (
    <div className="ph-statusbar" style={{ color: c }}>
      <span className="ph-st-time">{time}</span>
      <span className="ph-st-icons">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor" aria-hidden>
          <rect x="0" y="7" width="3" height="5" rx="1" />
          <rect x="4.5" y="5" width="3" height="7" rx="1" />
          <rect x="9" y="2.5" width="3" height="9.5" rx="1" />
          <rect x="13.5" y="0" width="3" height="12" rx="1" />
        </svg>
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden>
          <path d="M1.5 4.2a10.5 10.5 0 0 1 14 0" />
          <path d="M4.2 7a7 7 0 0 1 8.6 0" />
          <path d="M6.9 9.7a3.4 3.4 0 0 1 3.2 0" />
          <circle cx="8.5" cy="10.8" r="0.9" fill="currentColor" stroke="none" />
        </svg>
        <span className="ph-battery">
          <span className="ph-battery-fill" />
          <span className="ph-battery-tip" />
        </span>
      </span>
    </div>
  );
}

/** iPhone-style frame with dynamic island. width 390 CSS px (exported at 2x). */
export function PhoneFrame({
  time = '9:41',
  statusDark = false,
  bg = '#fff',
  children,
  wallpaper,
}: {
  time?: string;
  statusDark?: boolean;
  bg?: string;
  children: React.ReactNode;
  wallpaper?: string;
}) {
  return (
    <div className="phone" style={wallpaper ? undefined : undefined}>
      <div className="phone-screen" style={{ background: wallpaper ? 'transparent' : bg }}>
        {wallpaper ? (
          <div className="phone-wallpaper" style={{ backgroundImage: `url(${wallpaper})` }} />
        ) : null}
        <div className="phone-island" />
        <StatusBar time={time} dark={statusDark} />
        <div className="phone-content">{children}</div>
      </div>
    </div>
  );
}
