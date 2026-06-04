import { useState } from 'react'
import { StatusBadge, Btn, Tag } from '../ui/index.jsx'
import { ConfirmDialog } from '../ui/index.jsx'
import { TASK_STATUS, TASK_PRIORITY } from '../../utils/constants.js'
import { formatDate, formatMinutes, isOverdue, timeAgo } from '../../utils/helpers.js'

const css = `
.task-card {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 14px 16px;
  transition: border-color var(--transition), transform var(--transition);
  cursor: pointer;
  animation: fadeIn 0.2s ease;
}
.task-card:hover { border-color: var(--border2); transform: translateY(-1px); }
.task-card.done { opacity: 0.55; }
.task-title { font-weight: 600; font-size: 14px; margin-bottom: 4px; line-height: 1.3; }
.task-title.done { text-decoration: line-through; color: var(--text2); }
.task-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-top: 8px; }
.task-note { font-size: 12px; color: var(--text2); margin-top: 6px; font-family: var(--mono); line-height: 1.4; white-space: pre-wrap; border-left: 2px solid var(--border2); padding-left: 8px; }
.task-actions { display: flex; gap: 6px; margin-top: 10px; border-top: 1px solid var(--border); padding-top: 10px; }
`

export default function TaskList({ tasks, onEdit, onUpdate, onDelete }) {
  const [expanded, setExpanded] = useState(null)
  const [deleting, setDeleting] = useState(null)

  return (
    <>
      <style>{css}</style>
      {deleting && (
        <ConfirmDialog
          title="Xoá công việc"
          message={`Xoá "${deleting.title}"? Hành động này không thể hoàn tác.`}
          danger
          onConfirm={() => { onDelete(deleting.id); setDeleting(null) }}
          onCancel={() => setDeleting(null)}
        />
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {tasks.map(task => {
          const status = TASK_STATUS[task.status]
          const priority = TASK_PRIORITY[task.priority]
          const overdue = task.status !== 'done' && isOverdue(task.due_date)
          const open = expanded === task.id

          return (
            <div key={task.id} className={`task-card${task.status === 'done' ? ' done' : ''}`}
              onClick={() => setExpanded(open ? null : task.id)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <div className={`task-title${task.status === 'done' ? ' done' : ''}`}>{task.title}</div>
                  {task.description && <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>{task.description}</div>}
                </div>
                <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                  <StatusBadge label={priority.label} color={priority.color} small />
                  <StatusBadge label={status.label} color={status.color} small />
                </div>
              </div>

              <div className="task-meta">
                {task.due_date && (
                  <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: overdue ? 'var(--accent2)' : 'var(--text3)' }}>
                    {overdue ? '⚠ ' : '📅 '}{formatDate(task.due_date)}
                  </span>
                )}
                {task.time_spent > 0 && (
                  <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>
                    ⏱ {formatMinutes(task.time_spent)}
                  </span>
                )}
                {task.tags?.map(t => <Tag key={t} label={t} />)}
                <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)', marginLeft: 'auto' }}>
                  {timeAgo(task.updated_at || task.created_at)}
                </span>
              </div>

              {open && <>
                {task.note && <div className="task-note">{task.note}</div>}
                <div className="task-actions" onClick={e => e.stopPropagation()}>
                  {task.status !== 'done' && (
                    <Btn small variant="subtle" onClick={() => onUpdate(task.id, { status: 'done' })}>✓ Hoàn thành</Btn>
                  )}
                  {task.status === 'done' && (
                    <Btn small variant="subtle" onClick={() => onUpdate(task.id, { status: 'todo' })}>↩ Mở lại</Btn>
                  )}
                  <Btn small variant="ghost" onClick={() => onEdit(task)}>✎ Sửa</Btn>
                  <Btn small variant="danger" onClick={() => setDeleting(task)}>✕ Xoá</Btn>
                </div>
              </>}
            </div>
          )
        })}
      </div>
    </>
  )
}
