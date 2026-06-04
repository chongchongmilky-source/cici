import { useState } from 'react'
import Modal from '../ui/Modal.jsx'
import { Btn, Field, Input, Textarea, Select, Tag } from '../ui/index.jsx'
import { TASK_STATUS, TASK_PRIORITY } from '../../utils/constants.js'
import { parseTagInput } from '../../utils/helpers.js'

const statusOpts = Object.entries(TASK_STATUS).map(([v, d]) => ({ value: v, label: d.label }))
const priorityOpts = Object.entries(TASK_PRIORITY).map(([v, d]) => ({ value: v, label: d.label }))

export default function TaskForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || {
    title: '', description: '', status: 'todo', priority: 'medium',
    due_date: '', note: '', tags: [], time_spent: 0,
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
      title={initial?.id ? 'Sửa công việc' : 'Thêm công việc'}
      onClose={onClose}
      footer={<>
        <Btn variant="ghost" onClick={onClose}>Huỷ</Btn>
        <Btn onClick={handleSubmit} disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</Btn>
      </>}
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Field label="Tiêu đề" required>
          <Input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Tên công việc..." autoFocus required />
        </Field>
        <Field label="Mô tả">
          <Textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="Chi tiết công việc..." rows={3} />
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Trạng thái">
            <Select value={form.status} onChange={e => set('status', e.target.value)} options={statusOpts} />
          </Field>
          <Field label="Ưu tiên">
            <Select value={form.priority} onChange={e => set('priority', e.target.value)} options={priorityOpts} />
          </Field>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Hạn chót">
            <Input type="date" value={form.due_date} onChange={e => set('due_date', e.target.value)} />
          </Field>
          <Field label="Thời gian (phút)" hint="Tổng thời gian đã làm">
            <Input type="number" min="0" value={form.time_spent} onChange={e => set('time_spent', +e.target.value)} />
          </Field>
        </div>
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
        <Field label="Ghi chú" hint="Ghi lại chi tiết, vấn đề, cách làm...">
          <Textarea value={form.note} onChange={e => set('note', e.target.value)}
            placeholder="Ghi chú thêm về công việc này..." rows={4} />
        </Field>
      </form>
    </Modal>
  )
}
