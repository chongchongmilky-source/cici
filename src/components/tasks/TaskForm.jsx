import { useState } from 'react'
import Modal from '../ui/Modal.jsx'
import { Btn, Field, Input, Textarea, Select, Tag } from '../ui/index.jsx'
import { TASK_STATUS, TASK_PRIORITY } from '../../utils/constants.js'
import { parseTagInput } from '../../utils/helpers.js'

const statusOpts = Object.entries(TASK_STATUS).map(([v, d]) => ({ value: v, label: d.label }))
const priorityOpts = Object.entries(TASK_PRIORITY).map(([v, d]) => ({ value: v, label: d.label }))

export default function TaskForm({ initial, onSave, onClose, defaultDaily = false }) {
  const [form, setForm] = useState(initial || {
    title: '', description: '', status: 'todo', priority: 'medium',
    due_date: null, note: '', tags: [], time_spent: 0,
    is_daily: defaultDaily,
  })
  const [tagInput, setTagInput] = useState('')
  const [saving, setSaving] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  function addTags() {
    const newTags = parseTagInput(tagInput)
    set('tags', [...new Set([...(form.tags || []), ...newTags])])
    setTagInput('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) return
      const submitData = {
    ...form,
    due_date: form.due_date === '' ? null : form.due_date,
  }
    try {
      setSaving(true)
      await onSave(form)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      title={initial?.id ? 'Sửa công việc' : (form.is_daily ? 'Thêm việc hàng ngày' : 'Thêm công việc')}
      onClose={onClose}
      footer={<>
        <Btn variant="ghost" onClick={onClose}>Huỷ</Btn>
        <Btn onClick={handleSubmit} disabled={saving}
          style={form.is_daily ? { background: 'var(--accent3)', color: '#000' } : {}}>
          {saving ? 'Đang lưu...' : 'Lưu'}
        </Btn>
      </>}
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Toggle hàng ngày */}
        <div
          onClick={() => set('is_daily', !form.is_daily)}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 14px', borderRadius: 'var(--radius-sm)',
            border: `1px solid ${form.is_daily ? 'rgba(67,217,173,0.4)' : 'var(--border)'}`,
            background: form.is_daily ? 'rgba(67,217,173,0.08)' : 'var(--bg3)',
            cursor: 'pointer', transition: 'all 0.18s ease', userSelect: 'none',
          }}>
          <div style={{
            width: 18, height: 18, borderRadius: 4,
            border: `2px solid ${form.is_daily ? 'var(--accent3)' : 'var(--border2)'}`,
            background: form.is_daily ? 'var(--accent3)' : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, transition: 'all 0.15s ease',
          }}>
            {form.is_daily && <span style={{ color: '#000', fontSize: 11, fontWeight: 800, lineHeight: 1 }}>✓</span>}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: form.is_daily ? 'var(--accent3)' : 'var(--text2)' }}>
              Việc lặp lại hàng ngày
            </div>
            <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 1 }}>
              Tự reset mỗi ngày — tích xong hôm nay, ngày mai làm lại
            </div>
          </div>
        </div>

        <Field label="Tiêu đề" required>
          <Input value={form.title} onChange={e => set('title', e.target.value)}
            placeholder={form.is_daily ? 'VD: Uống đủ nước, Tập thể dục...' : 'Tên công việc...'}
            autoFocus required />
        </Field>

        <Field label="Mô tả">
          <Textarea value={form.description} onChange={e => set('description', e.target.value)}
            placeholder="Chi tiết..." rows={2} />
        </Field>

        {/* Ẩn trạng thái nếu là daily (trạng thái quản lý bởi last_completed_date) */}
        {!form.is_daily && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Trạng thái">
              <Select value={form.status} onChange={e => set('status', e.target.value)} options={statusOpts} />
            </Field>
            <Field label="Ưu tiên">
              <Select value={form.priority} onChange={e => set('priority', e.target.value)} options={priorityOpts} />
            </Field>
          </div>
        )}

        {form.is_daily && (
          <Field label="Ưu tiên">
            <Select value={form.priority} onChange={e => set('priority', e.target.value)} options={priorityOpts} />
          </Field>
        )}

        {!form.is_daily && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Hạn chót">
              <Input type="date" value={form.due_date} onChange={e => set('due_date', e.target.value)} />
            </Field>
            <Field label="Thời gian (phút)">
              <Input type="number" min="0" value={form.time_spent} onChange={e => set('time_spent', +e.target.value)} />
            </Field>
          </div>
        )}

        <Field label="Tags">
          <div style={{ display: 'flex', gap: 6 }}>
            <Input value={tagInput} onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTags())}
              placeholder="Nhập tag, Enter để thêm..." />
            <Btn variant="ghost" small onClick={addTags} type="button">+ Thêm</Btn>
          </div>
          {form.tags?.length > 0 && (
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 6 }}>
              {form.tags.map(t => <Tag key={t} label={t} onRemove={() => set('tags', form.tags.filter(x => x !== t))} />)}
            </div>
          )}
        </Field>

        <Field label="Ghi chú">
          <Textarea value={form.note} onChange={e => set('note', e.target.value)}
            placeholder="Ghi chú thêm..." rows={3} />
        </Field>
      </form>
    </Modal>
  )
}