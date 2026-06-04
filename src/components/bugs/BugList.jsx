import { useState } from 'react'
import { StatusBadge, Btn, Tag } from '../ui/index.jsx'
import { ConfirmDialog } from '../ui/index.jsx'
import { BUG_STATUS, BUG_SEVERITY } from '../../utils/constants.js'
import { formatDate, formatDateTime, timeAgo } from '../../utils/helpers.js'

const css = `
.bug-card {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 14px 16px;
  transition: border-color var(--transition), transform var(--transition);
  cursor: pointer;
  animation: fadeIn 0.2s ease;
  border-left: 3px solid transparent;
}
.bug-card:hover { border-color: var(--border2); transform: translateY(-1px); }
.bug-card[data-sev=critical] { border-left-color: #ff0000; }
.bug-card[data-sev=high] { border-left-color: var(--accent2); }
.bug-card[data-sev=medium] { border-left-color: var(--accent4); }
.bug-card[data-sev=low] { border-left-color: var(--accent3); }
.bug-card.resolved { opacity: 0.55; }
.bug-section { margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--border); }
.bug-section-label { font-size: 10px; font-family: var(--mono); color: var(--text3); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; }
.bug-section-content { font-size: 12.5px; color: var(--text2); line-height: 1.5; white-space: pre-wrap; }
`

export default function BugList({ bugs, onEdit, onUpdate, onDelete }) {
  const [expanded, setExpanded] = useState(null)
  const [deleting, setDeleting] = useState(null)

  return (
    <>
      <style>{css}</style>
      {deleting && (
        <ConfirmDialog
          title="Xoá bug"
          message={`Xoá "${deleting.title}"?`}
          danger
          onConfirm={() => { onDelete(deleting.id); setDeleting(null) }}
          onCancel={() => setDeleting(null)}
        />
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {bugs.map(bug => {
          const status = BUG_STATUS[bug.status]
          const severity = BUG_SEVERITY[bug.severity]
          const open = expanded === bug.id
          const resolved = ['resolved', 'closed', 'wont_fix'].includes(bug.status)

          return (
            <div key={bug.id} data-sev={bug.severity}
              className={`bug-card${resolved ? ' resolved' : ''}`}
              onClick={() => setExpanded(open ? null : bug.id)}>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.3 }}>{bug.title}</div>
                  {bug.description && <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>{bug.description}</div>}
                </div>
                <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                  <StatusBadge label={severity.label} color={severity.color} small />
                  <StatusBadge label={status.label} color={status.color} small />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                {bug.environment && (
                  <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)', background: 'var(--bg3)', padding: '1px 7px', borderRadius: 4 }}>
                    {bug.environment}
                  </span>
                )}
                {bug.tags?.map(t => <Tag key={t} label={t} />)}
                <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)', marginLeft: 'auto' }}>
                  {timeAgo(bug.updated_at || bug.created_at)}
                </span>
              </div>

              {open && <>
                {bug.steps_to_reproduce && (
                  <div className="bug-section">
                    <div className="bug-section-label">Các bước tái hiện</div>
                    <div className="bug-section-content">{bug.steps_to_reproduce}</div>
                  </div>
                )}
                {bug.solution && (
                  <div className="bug-section">
                    <div className="bug-section-label">Giải pháp</div>
                    <div className="bug-section-content" style={{ color: 'var(--accent3)' }}>{bug.solution}</div>
                  </div>
                )}
                {bug.note && (
                  <div className="bug-section">
                    <div className="bug-section-label">Ghi chú</div>
                    <div className="bug-section-content">{bug.note}</div>
                  </div>
                )}
                {bug.resolved_at && (
                  <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--accent3)', marginTop: 8 }}>
                    ✓ Đã giải quyết lúc {formatDateTime(bug.resolved_at)}
                  </div>
                )}
                <div className="bug-section" onClick={e => e.stopPropagation()}>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {bug.status === 'open' && <Btn small variant="subtle" onClick={() => onUpdate(bug.id, { status: 'in_progress' })}>▶ Xử lý</Btn>}
                    {bug.status === 'in_progress' && <Btn small variant="subtle" onClick={() => onUpdate(bug.id, { status: 'resolved' })}>✓ Đã fix</Btn>}
                    {['open','in_progress'].includes(bug.status) && <Btn small variant="ghost" onClick={() => onUpdate(bug.id, { status: 'wont_fix' })}>✕ Không sửa</Btn>}
                    <Btn small variant="ghost" onClick={() => onEdit(bug)}>✎ Sửa</Btn>
                    <Btn small variant="danger" onClick={() => setDeleting(bug)}>✕ Xoá</Btn>
                  </div>
                </div>
              </>}
            </div>
          )
        })}
      </div>
    </>
  )
}
