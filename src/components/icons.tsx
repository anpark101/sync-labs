import React from 'react';

type P = { size?: number; color?: string; filled?: boolean; style?: React.CSSProperties };

const S = (path: React.ReactNode, fill: boolean) =>
  function Icon({ size = 20, color = 'currentColor', style }: P) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={fill ? color : 'none'} stroke={fill ? 'none' : color} strokeWidth={fill ? 0 : 2} strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden>
        {path}
      </svg>
    );
  };

export const IBack = S(<path d="M15 18l-6-6 6-6" />, false);
export const IPlus = S(<path d="M12 5v14M5 12h14" />, false);
export const ITrash = S(<><path d="M3 6h18" /><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /></>, false);
export const IEdit = S(<><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></>, false);
export const ICopy = S(<><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></>, false);
export const IDup = S(<><path d="M12 3v12" /><path d="M8 11l4 4 4-4" /><path d="M4 21h16" /></>, false);
export const IUp = S(<path d="M12 19V5M5 12l7-7 7 7" />, false);
export const IDown = S(<path d="M12 5v14M19 12l-7 7-7-7" />, false);
export const IImage = S(<><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></>, false);
export const IMusic = S(<><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></>, false);
export const ICheck = S(<path d="M20 6L9 17l-5-5" />, false);
export const IChevronR = S(<path d="M9 18l6-6-6-6" />, false);
export const IDots = S(<><circle cx="12" cy="5" r="1.6" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" /><circle cx="12" cy="19" r="1.6" fill="currentColor" stroke="none" /></>, false);
export const ISearch = S(<><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></>, false);
export const ICloud = S(<path d="M17.5 19a4.5 4.5 0 0 0 .42-8.98 6 6 0 0 0-11.7 1.6A4 4 0 0 0 6.5 19Z" />, false);
export const ICloudOff = S(<><path d="M17.5 19a4.5 4.5 0 0 0 .42-8.98 6 6 0 0 0-11.7 1.6A4 4 0 0 0 6.5 19" /><path d="M3 3l18 18" /></>, false);
export const IDevice = S(<><rect x="7" y="2" width="10" height="20" rx="2.5" /><path d="M11 18h2" /></>, false);
export const IDrama = S(<path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm-3.5 7c.6.5 1 1.4 1 2.4 0 1.6-1.2 2.6-2.5 2.6S4.5 13 4.5 11.4 5.7 8.8 7 8.8c.5 0 1 .1 1.5.2Zm7 0c.6.5 1 1.4 1 2.4 0 1.6-1.2 2.6-2.5 2.6s-2.5-1-2.5-2.6 1.2-2.6 2.5-2.6c.5 0 1 .1 1.5.2ZM8 16c1.2 1 2.7 1.5 4 1.5s2.8-.5 4-1.5" />, false);
export const ISparkle = S(<path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4ZM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8Z" />, false);
export const IGear = S(<><circle cx="12" cy="12" r="3.2" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h.09a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.09a1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1Z" /></>, false);
export const IUsers = S(<><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8" /><path d="M17.5 13.6A6.5 6.5 0 0 1 21.5 20" /></>, false);
export const IHome = S(<><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /></>, false);
export const ISave = S(<><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" /><path d="M17 21v-8H7v8" /><path d="M7 3v5h8" /></>, false);

// ---------- platform brand icons (mini, for UI) ----------
export function IcoInstagram({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <defs>
        <linearGradient id="ig-g" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#FEDA75" />
          <stop offset="0.35" stopColor="#FA7E1E" />
          <stop offset="0.6" stopColor="#D62976" />
          <stop offset="0.8" stopColor="#962FBF" />
          <stop offset="1" stopColor="#4F5BD5" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5.5" fill="url(#ig-g)" />
      <rect x="6" y="6" width="12" height="12" rx="4" fill="none" stroke="#fff" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="3.2" fill="none" stroke="#fff" strokeWidth="1.7" />
      <circle cx="16.6" cy="7.4" r="1.1" fill="#fff" />
    </svg>
  );
}
export function IcoX({ size = 22, color = '#000' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden>
      <path d="M17.6 3H20l-6.5 7.4L21 21h-5.9l-4.6-6-5.3 6H2.8l7-7.9L3 3h6l4.1 5.5L17.6 3Zm-1 16.2h1.6L7.1 4.7H5.4l11.2 14.5Z" />
    </svg>
  );
}
export function IcoTikTok({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path fill="#25F4EE" transform="translate(-0.7 -0.4)" d="M16.8 3c.4 2.1 1.8 3.6 4 3.9v3c-1.6 0-3-.5-4-1.3v6.6c0 4.2-3.3 6.8-7 6.2-3-.5-5.2-3.2-4.8-6.3.4-3 3-5.2 6.2-5v3.1c-1.4-.2-2.7.7-3 2-.2 1.5.9 2.8 2.4 2.9 1.6.1 2.9-1.1 2.9-2.8V3h3.3Z" />
      <path fill="#FE2C55" transform="translate(0.7 0.4)" d="M16.8 3c.4 2.1 1.8 3.6 4 3.9v3c-1.6 0-3-.5-4-1.3v6.6c0 4.2-3.3 6.8-7 6.2-3-.5-5.2-3.2-4.8-6.3.4-3 3-5.2 6.2-5v3.1c-1.4-.2-2.7.7-3 2-.2 1.5.9 2.8 2.4 2.9 1.6.1 2.9-1.1 2.9-2.8V3h3.3Z" />
      <path fill="#fff" d="M16.8 3c.4 2.1 1.8 3.6 4 3.9v3c-1.6 0-3-.5-4-1.3v6.6c0 4.2-3.3 6.8-7 6.2-3-.5-5.2-3.2-4.8-6.3.4-3 3-5.2 6.2-5v3.1c-1.4-.2-2.7.7-3 2-.2 1.5.9 2.8 2.4 2.9 1.6.1 2.9-1.1 2.9-2.8V3h3.3Z" />
    </svg>
  );
}
export function IcoWhatsApp({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="10" fill="#25D366" />
      <path fill="#fff" d="M12.05 5.7c-3.5 0-6.3 2.7-6.3 6 0 1.1.3 2.1.8 3l-1 3.7 3.8-1c.9.5 1.9.7 2.7.7 3.5 0 6.3-2.7 6.3-6s-2.8-6.4-6.3-6.4Zm0 11.7c-.9 0-1.8-.2-2.6-.7l-.4-.2-2.2.6.6-2.1-.3-.4a5 5 0 0 1-.8-2.9c0-2.8 2.4-5 5.4-5s5.4 2.2 5.4 5-2.4 5.7-5.1 5.7Zm3-3.7c-.2-.1-1.1-.5-1.2-.6-.2-.1-.3-.1-.5.1-.1.2-.5.6-.6.7-.1.1-.2.2-.4.1-.2-.1-.9-.3-1.7-1-.6-.5-1-1.2-1.1-1.4-.1-.2 0-.3.1-.4l.3-.4c.1-.1.1-.2.2-.3v-.3c0-.1-.5-1.3-.7-1.7-.2-.4-.4-.4-.5-.4h-.4c-.1 0-.4.1-.5.3-.2.2-.7.7-.7 1.7s.7 2 .8 2.1c.1.1 1.4 2.2 3.4 3 .5.2.9.3 1.2.4.5.2.9.1 1.2.1.4-.1 1.1-.4 1.2-.9.2-.4.2-.8.1-.9 0-.1-.2-.1-.4-.2Z" />
    </svg>
  );
}
export function IcoTelegram({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <defs>
        <linearGradient id="tg-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#37BBFE" />
          <stop offset="1" stopColor="#007DBB" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill="url(#tg-g)" />
                        <path fill="#fff" d="M16.9 7.3 5.5 11.6c-.55.2-.55.55 0 .75l2.6.8 1.1 3.4c.1.3.2.4.4.4.2 0 .3-.1.5-.3l1.2-1.2 2.7 2c.5.35.9.15 1-.4l1.9-9c.15-.7-.35-1-.75-.75Zm-1.4 2-6 5.4c-.2.2-.4.3-.2.6l.7 2.2c.1.2.2.2.3.1l.7-.6c.2-.2.4-.2.6-.1l2.2 1.4c.2.15.4 0 .4-.3l.9-4.2c.05-.2 0-.3-.2-.4l-1.7-.6Z" />
          </svg>
  );
}
export function IcoSnapchat({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5.5" fill="#FFFC00" />
      <path fill="#fff" stroke="#fff" strokeWidth="1" d="M12 4.5c1.8 0 3.4 1.5 3.5 3.4l.1 1.4c0 .3.3.5.6.4l1-.3c.3-.1.6.1.6.4 0 .2-.1.4-.3.5-.5.2-.9.4-1.2.6-.1.1-.1.3 0 .4.6.7 1.5 1.1 2.5 1.2.3 0 .4.3.3.5-.4.7-1.2 1.1-1.8 1.3 0 .3-.2.5-.5.5h-.5c-.3 0-.5.1-.6.3l-.5 1.2c-.1.3-.3.4-.5.4h-1.1c-.2 0-.4.1-.4.3l-.1.4c-.1.3-.3.4-.5.4h-.8c-.3 0-.5-.1-.6-.3l-.3-.6c-.1-.2-.3-.3-.5-.3h-.9c-.2 0-.4.1-.5.3l-.3.6c-.1.2-.3.3-.6.3h-.8c-.2 0-.4-.1-.5-.4l-.1-.4c0-.2-.2-.3-.4-.3H7.4c-.3 0-.5-.2-.5-.5-.6-.2-1.4-.6-1.8-1.3-.1-.2 0-.5.3-.5 1-.1 1.9-.5 2.5-1.2.1-.1.1-.3 0-.4-.3-.2-.7-.4-1.2-.6-.2-.1-.3-.3-.3-.5 0-.3.3-.5.6-.4l1 .3c.3.1.6-.1.6-.4l.1-1.4C8.6 6 10.2 4.5 12 4.5Z" />
    </svg>
  );
}
export function IcoReddit({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="10" fill="#FF4500" />
      <ellipse cx="12" cy="13.2" rx="6.4" ry="4.2" fill="#fff" />
      <circle cx="18.6" cy="8.4" r="2.6" fill="#fff" />
      <circle cx="8.2" cy="13.2" r="1.1" fill="#FF4500" />
      <circle cx="15.8" cy="13.2" r="1.1" fill="#FF4500" />
      <path d="M8.6 16.1c2.2 1.4 4.6 1.4 6.8 0" stroke="#FF4500" strokeWidth="1" fill="none" strokeLinecap="round" />
      <path d="M18.6 8.6c1.2-.4 2.4-.3 3 .1" stroke="#fff" strokeWidth="1" fill="none" strokeLinecap="round" />
    </svg>
  );
}
export function IcoFacebook({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5.5" fill="#1877F2" />
      <path fill="#fff" d="M13.4 21v-7h2.3l.5-2.8h-2.8V9.4c0-.8.4-1.6 1.7-1.6h1.3V5.3c-.6-.1-1.4-.2-2.2-.2-2.4 0-4 1.4-4 4v2.1H8v2.8h2.2v7h3.2Z" />
    </svg>
  );
}
export function IcoIMessage({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <defs>
        <linearGradient id="im-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5CF777" />
          <stop offset="1" stopColor="#0DBC2E" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5.5" fill="url(#im-g)" />
      <path fill="#fff" d="M12 5.6c-4 0-7.2 2.6-7.2 5.9 0 1.9 1.1 3.6 2.8 4.7-.1.9-.5 1.8-1.2 2.5-.2.2 0 .5.3.4 1.4-.2 2.6-.7 3.5-1.4.9.3 1.8.4 2.8.4 4 0 7.2-2.7 7.2-6S16 5.6 12 5.6Z" />
    </svg>
  );
}
export function IcoLockscreen({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <rect x="6" y="2" width="12" height="20" rx="3" fill="#1c1c1e" stroke="#48484a" strokeWidth="1" />
      <path d="M9.5 7.5v-1a2.5 2.5 0 0 1 5 0v1" stroke="#fff" strokeWidth="1.4" fill="none" />
      <rect x="8.5" y="7.5" width="7" height="5.5" rx="1.2" fill="#fff" />
      <path d="M12 10v1.5" stroke="#1c1c1e" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function platformIcon(id: string, size = 22) {
  switch (id) {
    case 'imessage': return <IcoIMessage size={size} />;
    case 'whatsapp': return <IcoWhatsApp size={size} />;
    case 'telegram': return <IcoTelegram size={size} />;
    case 'ig_feed':
    case 'ig_story':
    case 'ig_reel': return <IcoInstagram size={size} />;
    case 'ig_dm': return <IcoInstagram size={size} />;
    case 'x': return <IcoX size={size} color="#fff" />;
    case 'tiktok': return <IcoTikTok size={size} />;
    case 'snapchat': return <IcoSnapchat size={size} />;
    case 'reddit': return <IcoReddit size={size} />;
    case 'facebook': return <IcoFacebook size={size} />;
    case 'lockscreen': return <IcoLockscreen size={size} />;
    default: return null;
  }
}

// ---------- verified badge (X-style blue check) ----------
export function VerifiedBadge({ size = 15, color = '#1D9BF0' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden style={{ verticalAlign: 'middle', flexShrink: 0 }}>
      <path fill={color} d="M12 1.5l2.6 2.1 3.3-.5 1.2 3.1 3.1 1.2-.5 3.3 2.1 2.6-2.1 2.6.5 3.3-3.1 1.2-1.2 3.1-3.3-.5-2.6 2.1-2.6-2.1-3.3.5-1.2-3.1-3.1-1.2.5-3.3L.5 13.2l2.1-2.6-.5-3.3 3.1-1.2 1.2-3.1 3.3.5L12 1.5z" transform="scale(0.92) translate(1 1)" />
      <path d="M7.5 12.2l3 3 6-6" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
