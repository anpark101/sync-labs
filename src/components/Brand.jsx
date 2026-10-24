import React from 'react'

export const BrandMark = ({ size = 34 }) => (
  <span className="brand-mark" style={{ width: size, height: size, borderRadius: size * 0.3 }}>
    <svg width={size * 0.64} height={size * 0.64} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 6.2A3.2 3.2 0 0 1 6.2 3h7.6A3.2 3.2 0 0 1 17 6.2v4.6a3.2 3.2 0 0 1-3.2 3.2H9.5L5.2 17v-3.2A3.2 3.2 0 0 1 3 10.8V6.2Z"
        fill="#F0A07C"
      />
      <path
        d="M8.4 11.4a3 3 0 0 1 3-3h6.2a3 3 0 0 1 3 3v4.2a3 3 0 0 1-3 3h-1.4v2.6l-3.5-2.6h-1.3a3 3 0 0 1-3-3v-4.2Z"
        fill="#C8B5F4"
        opacity="0.92"
      />
    </svg>
  </span>
)

export const Brand = ({ sub = true }) => (
  <span className="brand">
    <BrandMark />
    <span className="brand-copy">
      <span className="brand-name">elsewhere</span>
      {sub ? <span className="brand-sub">AU studio</span> : null}
    </span>
  </span>
)
