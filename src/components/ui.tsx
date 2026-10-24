import React, { useEffect, useRef, useState } from 'react';
import type { Character } from '../types';
import { IBack, ICheck } from './icons';

export function CharAvatar({ char, size = 40, className = '' }: { char?: Character; size?: number; className?: string }) {
  const base: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: '50%',
    flexShrink: 0,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: size * 0.5,
    overflow: 'hidden',
    background: char?.avatar ? 'transparent' : char?.color || '#666',
    color: '#fff',
    fontWeight: 700,
    lineHeight: 1,
    userSelect: 'none',
  };
  if (!char) return <span className={className} style={base}>?</span>;
  if (char.avatar)
    return (
      <img src={char.avatar} alt={char.name} className={className} style={{ ...base, objectFit: 'cover' }} />
    );
  return (
    <span className={className} style={base}>
      {char.emoji || char.name.slice(0, 1).toUpperCase()}
    </span>
  );
}

export function AvatarImg({ src, name, size = 40, ring }: { src?: string; name?: string; size?: number; ring?: boolean }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        flexShrink: 0,
        background: 'linear-gradient(135deg,#333,#555)',
        color: '#fff',
        fontSize: size * 0.4,
        fontWeight: 700,
        ...(ring
          ? {
              padding: 2.5,
              background: 'conic-gradient(#feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5, #feda75)',
            }
          : {}),
      }}
    >
      <span style={ring ? { width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', display: 'block' } : undefined}>
        {src ? (
          <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <span style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#444,#666)', fontSize: size * 0.4, fontWeight: 700 }}>
            {(name || '?').slice(0, 1).toUpperCase()}
          </span>
        )}
      </span>
    </span>
  );
}

export function Sheet({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);
  if (!open) return null;
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-head">
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <IBack size={20} style={{ transform: 'rotate(90deg)' }} />
          </button>
          <div className="sheet-title">{title}</div>
          <span style={{ width: 32 }} />
        </div>
        <div className="sheet-body">{children}</div>
        {footer ? <div className="sheet-foot">{footer}</div> : null}
      </div>
    </div>
  );
}

export function Field({ label, children, hint, style }: { label: string; children: React.ReactNode; hint?: string; style?: React.CSSProperties }) {
  return (
    <label className="field" style={style}>
      <span className="field-label">{label}</span>
      {children}
      {hint ? <span className="field-hint">{hint}</span> : null}
    </label>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className="input" />;
}
export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className="input textarea" />;
}

export function NumberInput({
  value,
  onChange,
  ...rest
}: { value: number; onChange: (n: number) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'>) {
  return (
    <input
      type="number"
      inputMode="numeric"
      value={Number.isFinite(value) ? value : 0}
      onChange={(e) => onChange(Number(e.target.value) || 0)}
      className="input"
      {...rest}
    />
  );
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { v: T; label: string }[];
}) {
  return (
    <div className="segmented">
      {options.map((o) => (
        <button key={o.v} className={'seg' + (value === o.v ? ' active' : '')} onClick={() => onChange(o.v)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button className={'toggle' + (checked ? ' on' : '')} onClick={() => onChange(!checked)} role="switch" aria-checked={checked}>
      <span className="knob" />
      {label ? <span className="toggle-label">{label}</span> : null}
    </button>
  );
}

export function SelectBox({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { v: string; label: string; avatar?: Character }[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const cur = options.find((o) => o.v === value);
  return (
    <div className="selectbox">
      <button type="button" className="input selectbox-btn" onClick={() => setOpen(true)}>
        <span className="selectbox-cur">
          {cur?.avatar ? <CharAvatar char={cur.avatar} size={22} /> : null}
          {cur?.label || placeholder || '—'}
        </span>
        <span className="chev">▾</span>
      </button>
      {open && (
        <>
          <div className="selectbox-backdrop" onClick={() => setOpen(false)} />
          <div className="selectbox-menu">
            {options.length === 0 && <div className="selectbox-empty">No characters yet — add some in the Crew tab</div>}
            {options.map((o) => (
              <button key={o.v} className="selectbox-item" onClick={() => { onChange(o.v); setOpen(false); }}>
                {o.avatar ? <CharAvatar char={o.avatar} size={26} /> : <span className="selectbox-dot" />}
                <span className="selectbox-item-label">{o.label}</span>
                {value === o.v ? <ICheck size={16} style={{ color: 'var(--accent2)' }} /> : null}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function ImagePick({
  value,
  onChange,
  label = 'Image',
  maxDim = 1400,
}: {
  value?: string;
  onChange: (v?: string) => void;
  label?: string;
  maxDim?: number;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  return (
    <div className="imagepick">
      <span className="field-label">{label}</span>
      <div className="imagepick-row">
        {value ? (
          <span className="imagepick-thumb">
            <img src={value} alt="" />
            <button type="button" className="imagepick-x" onClick={() => onChange(undefined)}>
              ✕
            </button>
          </span>
        ) : (
          <button type="button" className="imagepick-add" onClick={() => ref.current?.click()}>
            <span style={{ fontSize: 22 }}>🖼️</span>
            <span>{busy ? 'Processing…' : 'Add image'}</span>
          </button>
        )}
      </div>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        hidden
        onChange={async (e) => {
          const f = e.target.files?.[0];
          e.target.value = '';
          if (!f) return;
          setBusy(true);
          try {
            const { fileToDataUrl } = await import('../util');
            onChange(await fileToDataUrl(f, maxDim));
          } catch {
            alert('Could not read that image.');
          }
          setBusy(false);
        }}
      />
    </div>
  );
}

export function IconBtn({
  children,
  onClick,
  title,
  danger,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  title?: string;
  danger?: boolean;
}) {
  return (
    <button className={'icon-btn' + (danger ? ' danger' : '')} onClick={onClick} title={title}>
      {children}
    </button>
  );
}

export function EmptyState({ emoji, title, sub, action }: { emoji: string; title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="empty">
      <div className="empty-emoji">{emoji}</div>
      <div className="empty-title">{title}</div>
      {sub ? <div className="empty-sub">{sub}</div> : null}
      {action}
    </div>
  );
}

export function RowActions({ children }: { children: React.ReactNode }) {
  return <div className="row-actions">{children}</div>;
}
