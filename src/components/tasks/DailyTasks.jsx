import { useState } from 'react'
import { isDailyCompletedToday } from '../../hooks/useTasks.js'
import { TASK_PRIORITY } from '../../utils/constants.js'
import { ConfirmDialog } from '../ui/index.jsx'

const css = `
.daily-section {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  margin-bottom: 20px;
  overflow: hidden;
}
.daily-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  background: rgba(67,217,173,0.05);
  cursor: pointer;
  user-select: none;
}
.daily-header:hover { background: rgba(67,217,173,0.09); }
.daily-progress-bar {
  height: 3px;
  background: var(--bg3);
  border-radius: 0;
}
.daily-progress-fill {
  height: 100%;
  background: var(--accent3);
  border-radius: 0;
  transition: width 0.4s ease;
}
.daily-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 16px;
  border-bottom: 1px solid var(--border);
  transition: background var(--transition);
}
.daily-item:last-child { border-bottom: none; }
.daily-item:hover { background: var(--bg3); }
.daily-check {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid var(--border2);
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.18s ease;
}
.daily-check.done {
  background: var(--accent3);
  border-color: var(--accent3);
}
.daily-check:hover { border-color: var(--accent3); transform: scale(1.1); }
.daily-label { flex: 1; font-size: 13.5px; font-weight: 500; transition: color var(--transition); }
.daily-label.done { text-decoration: line-through; color: var(--text3); }
.daily-actions { display: flex; gap: 4px; opacity: 0; transition: opacity var(--transition); }
.daily-item:hover .daily-actions { opacity: 1; }
.daily-action-btn {
  background: none;
  border: none;
  color: var(--text3);
  cursor: pointer;
  padding: 3px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-family: var(--font);
  transition: all var(--transition);
}
.daily-action-btn:hover { background: var(--border); color: var(--text); }
.daily-action-btn.danger:hover { background: rgba(255,107,107,0.15); color: var(--accent2); }
`

export default function DailyTasks({ tasks, onToggle, onEdit, onDelete, onAdd }) {
  const [open, setOpen] = useState(true)
  const [deletingId, setDeletingId] = useState(null)

  const done = tasks.filter(t => isDailyCompletedToday(t)).length
  const total = tasks.length
  const pct = total > 0 ? (done / total) * 100 : 0
  const allDone = total > 0 && done === total

  const delTask = tasks.find(t => t.id === deletingId)

  return (
    <>
      <style>{css}</style>

      {deletingId && (
        <ConfirmDialog
          title="Xoá việc hàng ngày"
          message={`Xoá "${delTask?.title}"? Hành động này không thể hoàn tác.`}
          danger
          onConfirm={() => { onDelete(deletingId); setDeletingId(null) }}
          onCancel={() => setDeletingId(null)}
        />
      )}

      <div className="daily-section">
        {/* Header */}
        <div className="daily-header" onClick={() => setOpen(o => !o)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 14, color: 'var(--accent3)' }}>◈</span>
            <span style={{ fontWeight: 700, fontSize: 14 }}>Việc hàng ngày</span>
            <span style={{
              fontSize: 11, fontFamily: 'var(--mono)',
              color: allDone ? 'var(--accent3)' : 'var(--text3)',
              background: allDone ? 'rgba(67,217,173,0.12)' : 'var(--bg3)',
              padding: '2px 8px', borderRadius: 10,
            }}>
              {done}/{total} {allDone ? '🎉' : ''}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={e => { e.stopPropagation(); onAdd() }}
              style={{
                background: 'rgba(67,217,173,0.1)', border: '1px solid rgba(67,217,173,0.25)',
                color: 'var(--accent3)', borderRadius: 'var(--radius-sm)',
                padding: '4px 10px', fontSize: 12, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'var(--font)',
              }}>
              + Thêm
            </button>
            <span style={{ color: 'var(--text3)', fontSize: 13, transform: open ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s' }}>▾</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="daily-progress-bar">
          <div className="daily-progress-fill" style={{ width: `${pct}%` }} />
        </div>

        {/* List */}
        {open && (
          total === 0 ? (
            <div style={{ padding: '20px 16px', textAlign: 'center', color: 'var(--text3)', fontSize: 13 }}>
              Chưa có việc hàng ngày nào.{' '}
              <button onClick={onAdd} style={{ background: 'none', border: 'none', color: 'var(--accent3)', cursor: 'pointer', fontFamily: 'var(--font)', fontSize: 13, fontWeight: 600 }}>
                Thêm ngay →
              </button>
            </div>
          ) : (
            tasks.map(task => {
              const completed = isDailyCompletedToday(task)
              const priority = TASK_PRIORITY[task.priority]
              return (
                <div key={task.id} className="daily-item">
                  {/* Checkbox tròn */}
                  <div
                    className={`daily-check${completed ? ' done' : ''}`}
                    onClick={() => onToggle(task.id)}
                    title={completed ? 'Bỏ tích' : 'Đánh dấu hoàn thành'}
                  >
                    {completed && <span style={{ color: '#000', fontSize: 12, fontWeight: 800 }}>✓</span>}
                  </div>

                  {/* Tên */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className={`daily-label${completed ? ' done' : ''}`}>{task.title}</div>
                    {task.description && !completed && (
                      <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {task.description}
                      </div>
                    )}
                  </div>

                  {/* Priority dot */}
                  {priority && (
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: priority.color, flexShrink: 0 }} title={priority.label} />
                  )}

                  {/* Actions (hover) */}
                  <div className="daily-actions">
                    <button className="daily-action-btn" onClick={() => onEdit(task)} title="Sửa">✎</button>
                    <button className="daily-action-btn danger" onClick={() => setDeletingId(task.id)} title="Xoá">✕</button>
                  </div>
                </div>
              )
            })
          )
        )}
      </div>
    </>
  )
}
