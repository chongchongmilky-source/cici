import { useState } from 'react'
import { Btn, Field, Input, Textarea } from '../ui/index.jsx'
import { ConfirmDialog } from '../ui/index.jsx'
import Modal from '../ui/Modal.jsx'

const COLORS = ['#5b73ff','#ff6b6b','#43d9ad','#f5a623','#c471ed','#12c2e9','#f64f59']
const ICONS = ['📚','🧮','🔬','💻','🎨','🌍','📝','🔧','🎵','📊','⚛️','🧪']

function SubjectForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || { name: '', description: '', color: '#5b73ff', icon: '📚', note: '' })
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    setSaving(true)
    try { await onSave(form); onClose() } finally { setSaving(false) }
  }

  return (
    <Modal title={initial?.id ? 'Sửa môn học' : 'Thêm môn học'} onClose={onClose} width="420px"
      footer={<><Btn variant="ghost" onClick={onClose}>Huỷ</Btn><Btn onClick={handleSubmit} disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</Btn></>}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Field label="Tên môn học" required>
          <Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Toán, Lý, Lập trình..." autoFocus required />
        </Field>
        <Field label="Mô tả">
          <Textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="Mô tả ngắn về môn học..." rows={2} />
        </Field>
        <Field label="Icon">
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {ICONS.map(ic => (
              <button key={ic} type="button" onClick={() => set('icon', ic)}
                style={{ width: 34, height: 34, borderRadius: 6, border: form.icon === ic ? '2px solid var(--accent)' : '1px solid var(--border)', background: 'var(--bg3)', cursor: 'pointer', fontSize: 18 }}>
                {ic}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Màu sắc">
          <div style={{ display: 'flex', gap: 6 }}>
            {COLORS.map(c => (
              <button key={c} type="button" onClick={() => set('color', c)}
                style={{ width: 26, height: 26, borderRadius: '50%', background: c, border: form.color === c ? '3px solid #fff' : 'none', cursor: 'pointer', outline: form.color === c ? `2px solid ${c}` : 'none', outlineOffset: 2 }} />
            ))}
          </div>
        </Field>
        <Field label="Ghi chú">
          <Textarea value={form.note} onChange={e => set('note', e.target.value)} placeholder="Ghi chú về môn học..." rows={3} />
        </Field>
      </form>
    </Modal>
  )
}

const css = `
.subject-item {
  display: flex; align-items: center; gap: 10px;
  padding: 9px 10px; border-radius: var(--radius-sm);
  cursor: pointer; transition: all var(--transition);
  border: 1px solid transparent;
}
.subject-item:hover { background: var(--bg3); }
.subject-item.active { background: var(--bg3); border-color: var(--border); }
.subject-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.subject-name { font-size: 13.5px; font-weight: 500; flex: 1; }
.subject-count { font-size: 11px; font-family: var(--mono); color: var(--text3); }
`

export default function SubjectManager({ subjects, activeSubject, onSelect, lessonCounts, onAdd, onEdit, onDelete }) {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)

  return (
    <>
      <style>{css}</style>
      {showForm && <SubjectForm onSave={onAdd} onClose={() => setShowForm(false)} />}
      {editing && <SubjectForm initial={editing} onSave={(d) => onEdit(editing.id, d)} onClose={() => setEditing(null)} />}
      {deleting && (
        <ConfirmDialog
          title="Xoá môn học"
          message={`Xoá môn "${deleting.name}"? Tất cả bài học trong môn này cũng sẽ bị xoá.`}
          danger onConfirm={() => { onDelete(deleting.id); setDeleting(null) }} onCancel={() => setDeleting(null)} />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, padding: '0 2px' }}>
          <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1 }}>Môn học</span>
          <Btn small variant="subtle" onClick={() => setShowForm(true)}>+ Thêm</Btn>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, overflowY: 'auto' }}>
          {subjects.length === 0 && (
            <div style={{ textAlign: 'center', padding: '20px 10px', color: 'var(--text3)', fontSize: 12 }}>
              Chưa có môn học nào
            </div>
          )}
          {subjects.map(s => (
            <div key={s.id} className={`subject-item${activeSubject?.id === s.id ? ' active' : ''}`} onClick={() => onSelect(s)}>
              <span style={{ fontSize: 16 }}>{s.icon}</span>
              <div className="subject-dot" style={{ background: s.color }} />
              <span className="subject-name">{s.name}</span>
              <span className="subject-count">{lessonCounts[s.id] ?? 0}</span>
              <div style={{ display: 'flex', gap: 3 }} onClick={e => e.stopPropagation()}>
                <button onClick={() => setEditing(s)} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', padding: '2px 4px', fontSize: 12, borderRadius: 4 }}>✎</button>
                <button onClick={() => setDeleting(s)} style={{ background: 'none', border: 'none', color: 'var(--accent2)', cursor: 'pointer', padding: '2px 4px', fontSize: 12, borderRadius: 4 }}>×</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
