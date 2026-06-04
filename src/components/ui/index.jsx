// StatusBadge.jsx
export function StatusBadge({ label, color, small }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: small ? '2px 7px' : '3px 9px',
      borderRadius: 99, fontSize: small ? 11 : 12,
      background: color + '22', color,
      fontFamily: 'var(--mono)', fontWeight: 500,
      border: `1px solid ${color}44`,
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, display: 'inline-block' }} />
      {label}
    </span>
  )
}

// SearchBar.jsx
export function SearchBar({ value, onChange, placeholder = 'Tìm kiếm...' }) {
  return (
    <div style={{ position: 'relative' }}>
      <span style={{
        position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)',
        color: 'var(--text3)', fontSize: 14, pointerEvents: 'none'
      }}>⌕</span>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          background: 'var(--bg3)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)', color: 'var(--text)',
          padding: '8px 12px 8px 32px', fontSize: 13, outline: 'none',
          width: '100%', fontFamily: 'var(--font)',
          transition: 'border-color var(--transition)',
        }}
        onFocus={e => e.target.style.borderColor = 'var(--accent)'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
      />
    </div>
  )
}

// FilterButtons.jsx
export function FilterButtons({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          style={{
            padding: '5px 12px', borderRadius: 99, fontSize: 12,
            border: '1px solid ' + (value === opt.value ? (opt.color || 'var(--accent)') : 'var(--border)'),
            background: value === opt.value ? (opt.color || 'var(--accent)') + '22' : 'transparent',
            color: value === opt.value ? (opt.color || 'var(--accent)') : 'var(--text2)',
            cursor: 'pointer', fontFamily: 'var(--font)', fontWeight: 500,
            transition: 'all var(--transition)',
          }}
        >
          {opt.label}{opt.count !== undefined ? ` (${opt.count})` : ''}
        </button>
      ))}
    </div>
  )
}

// EmptyState.jsx
export function EmptyState({ icon = '◌', title, sub, action }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text3)' }}>
      <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.4 }}>{icon}</div>
      <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text2)', marginBottom: 6 }}>{title}</div>
      {sub && <div style={{ fontSize: 13, marginBottom: 20 }}>{sub}</div>}
      {action && action}
    </div>
  )
}

// ConfirmDialog.jsx
import Modal from './Modal.jsx'
export function ConfirmDialog({ title, message, onConfirm, onCancel, danger }) {
  return (
    <Modal title={title} onClose={onCancel} width="380px"
      footer={<>
        <Btn onClick={onCancel} variant="ghost">Huỷ</Btn>
        <Btn onClick={onConfirm} variant={danger ? 'danger' : 'primary'}>Xác nhận</Btn>
      </>}>
      <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.6 }}>{message}</p>
    </Modal>
  )
}

// Btn component
export function Btn({ children, onClick, variant = 'primary', small, disabled, type = 'button', style: extStyle }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer',
    border: 'none', borderRadius: 'var(--radius-sm)',
    fontFamily: 'var(--font)', fontWeight: 600,
    fontSize: small ? 12 : 13,
    padding: small ? '5px 10px' : '8px 15px',
    transition: 'all var(--transition)',
    opacity: disabled ? 0.5 : 1,
    ...extStyle,
  }
  const variants = {
    primary: { background: 'var(--accent)', color: '#fff' },
    ghost: { background: 'transparent', color: 'var(--text2)', border: '1px solid var(--border)' },
    danger: { background: 'var(--accent2)', color: '#fff' },
    subtle: { background: 'var(--bg3)', color: 'var(--text)' },
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant] }}>
      {children}
    </button>
  )
}

// FormField component
export function Field({ label, children, required, hint }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {label && (
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', letterSpacing: 0.3 }}>
          {label} {required && <span style={{ color: 'var(--accent2)' }}>*</span>}
        </label>
      )}
      {children}
      {hint && <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>{hint}</span>}
    </div>
  )
}

// Input
export function Input({ ...props }) {
  return (
    <input
      {...props}
      style={{
        background: 'var(--bg)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-sm)', color: 'var(--text)',
        padding: '8px 12px', fontSize: 13.5, outline: 'none',
        fontFamily: 'var(--font)', width: '100%',
        transition: 'border-color var(--transition)',
        ...props.style,
      }}
      onFocus={e => e.target.style.borderColor = 'var(--accent)'}
      onBlur={e => e.target.style.borderColor = 'var(--border)'}
    />
  )
}

// Textarea
export function Textarea({ rows = 4, ...props }) {
  return (
    <textarea
      rows={rows}
      {...props}
      style={{
        background: 'var(--bg)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-sm)', color: 'var(--text)',
        padding: '8px 12px', fontSize: 13.5, outline: 'none',
        fontFamily: 'var(--font)', width: '100%', resize: 'vertical',
        transition: 'border-color var(--transition)',
        lineHeight: 1.5,
        ...props.style,
      }}
      onFocus={e => e.target.style.borderColor = 'var(--accent)'}
      onBlur={e => e.target.style.borderColor = 'var(--border)'}
    />
  )
}

// Select
export function Select({ options, ...props }) {
  return (
    <select
      {...props}
      style={{
        background: 'var(--bg)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-sm)', color: 'var(--text)',
        padding: '8px 12px', fontSize: 13.5, outline: 'none',
        fontFamily: 'var(--font)', width: '100%', cursor: 'pointer',
        ...props.style,
      }}
    >
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}

// PageHeader
export function PageHeader({ title, sub, accentColor, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
          <div style={{ width: 3, height: 22, borderRadius: 2, background: accentColor || 'var(--accent)' }} />
          <h1 style={{ fontSize: 20, fontWeight: 800 }}>{title}</h1>
        </div>
        {sub && <p style={{ color: 'var(--text2)', fontSize: 13, marginLeft: 11 }}>{sub}</p>}
      </div>
      {children && <div style={{ display: 'flex', gap: 8 }}>{children}</div>}
    </div>
  )
}

// Tag
export function Tag({ label, onRemove }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 8px', borderRadius: 99, fontSize: 11,
      background: 'var(--accent-dim)', color: 'var(--accent)',
      fontFamily: 'var(--mono)', border: '1px solid var(--accent)33',
    }}>
      {label}
      {onRemove && <button onClick={onRemove} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 12, padding: 0, lineHeight: 1 }}>×</button>}
    </span>
  )
}

// Loader
export function Loader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 60, gap: 10, color: 'var(--text2)' }}>
      <div style={{ width: 16, height: 16, border: '2px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      Đang tải...
    </div>
  )
}
