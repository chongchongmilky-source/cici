import { useEffect } from 'react'

const css = `
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.65);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  z-index: 100; padding: 20px;
  animation: fadeIn 0.15s ease;
}
.modal {
  background: var(--bg2);
  border: 1px solid var(--border2);
  border-radius: var(--radius);
  width: 100%; max-width: var(--modal-w, 560px);
  max-height: 90vh;
  display: flex; flex-direction: column;
  animation: fadeIn 0.2s ease;
  box-shadow: 0 24px 80px rgba(0,0,0,0.6);
}
.modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 22px 0;
}
.modal-title { font-size: 16px; font-weight: 700; }
.modal-close {
  width: 28px; height: 28px; border-radius: 6px;
  background: var(--bg3); border: none; color: var(--text2);
  font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: all var(--transition);
}
.modal-close:hover { background: var(--border2); color: var(--text); }
.modal-body { padding: 18px 22px; overflow-y: auto; }
.modal-footer {
  padding: 14px 22px;
  border-top: 1px solid var(--border);
  display: flex; gap: 10px; justify-content: flex-end;
}
`

export default function Modal({ title, onClose, children, footer, width }) {
  useEffect(() => {
    const esc = e => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', esc)
    return () => document.removeEventListener('keydown', esc)
  }, [onClose])

  return (
    <>
      <style>{css}</style>
      <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="modal" style={{ '--modal-w': width || '560px' }}>
          <div className="modal-header">
            <span className="modal-title">{title}</span>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
          <div className="modal-body">{children}</div>
          {footer && <div className="modal-footer">{footer}</div>}
        </div>
      </div>
    </>
  )
}
