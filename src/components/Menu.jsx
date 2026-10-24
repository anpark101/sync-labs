import React, { useEffect, useRef, useState } from 'react'
import { MoreHorizontal } from 'lucide-react'

export default function Menu({ items = [], label = 'More options', icon, className = 'project-more', align = 'right' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])
  return (
    <div className="popmenu" ref={ref}>
      <button
        type="button"
        className={className}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          setOpen((v) => !v)
        }}
      >
        {icon || <MoreHorizontal size={16} />}
      </button>
      {open ? (
        <div className="popmenu-panel" role="menu" style={align === 'left' ? { left: 0, right: 'auto' } : undefined}>
          {items.map((item, i) =>
            item.separator ? (
              <hr key={i} style={{ margin: '4px 0' }} />
            ) : (
              <button
                key={i}
                type="button"
                role="menuitem"
                className={item.danger ? 'danger' : ''}
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  setOpen(false)
                  item.onClick?.()
                }}
              >
                {item.icon}
                {item.label}
              </button>
            )
          )}
        </div>
      ) : null}
    </div>
  )
}
