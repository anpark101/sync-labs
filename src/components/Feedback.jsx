import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle, Check, Info, X } from 'lucide-react'

const FeedbackContext = createContext(null)

let toastId = 0

export function FeedbackProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const [dialog, setDialog] = useState(null)
  const resolveRef = useRef(null)
  const timers = useRef(new Map())

  useEffect(() => () => timers.current.forEach((t) => clearTimeout(t)), [])

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id))
    const timer = timers.current.get(id)
    if (timer) clearTimeout(timer)
    timers.current.delete(id)
  }, [])

  const toast = useCallback(
    (message, opts = {}) => {
      const id = ++toastId
      const item = { id, message, type: opts.type || 'info', action: opts.action }
      setToasts((list) => [...list.slice(-2), item])
      const timer = setTimeout(() => dismiss(id), opts.duration || 3800)
      timers.current.set(id, timer)
      return id
    },
    [dismiss]
  )

  const api = {
    toast,
    success: (m, o) => toast(m, { ...o, type: 'success' }),
    error: (m, o) => toast(m, { ...o, type: 'error', duration: 5200 }),
    info: (m, o) => toast(m, { ...o, type: 'info' }),
    confirm: (options) =>
      new Promise((resolve) => {
        resolveRef.current = resolve
        setDialog({
          title: 'Are you sure?',
          body: '',
          confirmLabel: 'Confirm',
          cancelLabel: 'Cancel',
          destructive: false,
          ...options,
        })
      }),
    prompt: (options) =>
      new Promise((resolve) => {
        resolveRef.current = resolve
        setDialog({
          title: 'Rename',
          body: '',
          input: true,
          defaultValue: '',
          confirmLabel: 'Save',
          cancelLabel: 'Cancel',
          ...options,
        })
      }),
  }

  const close = (result) => {
    setDialog(null)
    resolveRef.current?.(result)
    resolveRef.current = null
  }

  const [inputValue, setInputValue] = useState('')
  useEffect(() => {
    if (dialog?.input) setInputValue(dialog.defaultValue || '')
    else setInputValue('')
  }, [dialog])

  return (
    <FeedbackContext.Provider value={api}>
      {children}
      {createPortal(
        <div className="toast-stack" aria-live="polite">
          {toasts.map((t) => (
            <div key={t.id} className={`toast toast-${t.type}`} role="status">
              <span className="toast-icon">
                {t.type === 'success' ? <Check size={16} /> : t.type === 'error' ? <AlertTriangle size={16} /> : <Info size={16} />}
              </span>
              <span className="toast-msg">{t.message}</span>
              {t.action ? (
                <button
                  className="toast-action"
                  onClick={() => {
                    t.action.onClick?.()
                    dismiss(t.id)
                  }}
                >
                  {t.action.label}
                </button>
              ) : null}
              <button className="toast-close" onClick={() => dismiss(t.id)} aria-label="Dismiss">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>,
        document.body
      )}
      {dialog
        ? createPortal(
            <div className="dialog-backdrop" onMouseDown={(e) => e.target === e.currentTarget && close(null)}>
              <div className="dialog" role="dialog" aria-modal="true" aria-label={dialog.title}>
                <div className="dialog-body">
                  <h3>{dialog.title}</h3>
                  {dialog.body ? <p>{dialog.body}</p> : null}
                  {dialog.input ? (
                    <input
                      className="input"
                      autoFocus
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') close(inputValue)
                        if (e.key === 'Escape') close(null)
                      }}
                      placeholder={dialog.placeholder || ''}
                    />
                  ) : null}
                </div>
                <div className="dialog-actions">
                  <button className="btn btn-ghost" onClick={() => close(null)}>
                    {dialog.cancelLabel}
                  </button>
                  <button
                    className={`btn ${dialog.destructive ? 'btn-danger' : 'btn-primary'}`}
                    onClick={() => close(dialog.input ? inputValue : true)}
                  >
                    {dialog.confirmLabel}
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </FeedbackContext.Provider>
  )
}

export const useFeedback = () => {
  const ctx = useContext(FeedbackContext)
  if (!ctx) throw new Error('useFeedback must be used inside FeedbackProvider')
  return ctx
}
