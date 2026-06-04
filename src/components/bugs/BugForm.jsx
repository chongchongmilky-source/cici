import { useState } from 'react'
import Modal from '../ui/Modal.jsx'
import { Btn, Field, Input, Textarea, Select, Tag } from '../ui/index.jsx'
import { BUG_STATUS, BUG_SEVERITY } from '../../utils/constants.js'
import { parseTagInput } from '../../utils/helpers.js'

const statusOpts = Object.entries(BUG_STATUS).map(([v, d]) => ({ value: v, label: d.label }))
const severityOpts = Object.entries(BUG_SEVERITY).map(([v, d]) => ({ value: v, label: d.label }))

export default function BugForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || {
    title: '', description: '', status: 'open', severity: 'medium',
    environment: '', steps_to_reproduce: '', solution: '', note: '', tags: [],
  })
  const [tagInput, setTagInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState('info') // info | detail | note

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

  const tabs = [
    { key: 'info', label: 'Thông tin' },
    { key: 'detail', label: 'Chi tiết' },
    { key: 'note', label: 'Ghi chú' },
  ]

  return (
    <Modal
      title={initial?.id ? 'Sửa bug' : 'Báo cáo bug mới'}
      onClose={onClose}
      width="600px"
      footer={<>
        <Btn variant="ghost" onClick={onClose}>Huỷ</Btn>
        <Btn onClick={handleSubmit} disabled={saving} style={{ background: 'var(--accent2)' }}>
          {saving ? 'Đang lưu...' : 'Lưu bug'}
        </Btn>
      </>}
    >
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 16, borderBottom: '1px solid var(--border)' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{
              padding: '7px 14px', background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font)', fontSize: 13, fontWeight: 500,
              color: tab === t.key ? 'var(--accent2)' : 'var(--text2)',
              borderBottom: tab === t.key ? '2px solid var(--accent2)' : '2px solid transparent',
              marginBottom: -1, transition: 'all var(--transition)',
            }}>{t.label}</button>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {tab === 'info' && <>
          <Field label="Tiêu đề bug" required>
            <Input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Mô tả ngắn về bug..." autoFocus required />
          </Field>
          <Field label="Mô tả">
            <Textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="Bug xảy ra như thế nào?" rows={3} />
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Trạng thái">
              <Select value={form.status} onChange={e => set('status', e.target.value)} options={statusOpts} />
            </Field>
            <Field label="Mức độ">
              <Select value={form.severity} onChange={e => set('severity', e.target.value)} options={severityOpts} />
            </Field>
          </div>
          <Field label="Môi trường" hint="Trình duyệt, OS, phiên bản...">
            <Input value={form.environment} onChange={e => set('environment', e.target.value)} placeholder="Chrome 120, Windows 11..." />
          </Field>
          <Field label="Tags">
            <div style={{ display: 'flex', gap: 6 }}>
              <Input value={tagInput} onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTags())}
                placeholder="frontend, api, ui..." />
              <Btn variant="ghost" small onClick={addTags} type="button">+ Thêm</Btn>
            </div>
            {form.tags?.length > 0 && (
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 6 }}>
                {form.tags.map(t => <Tag key={t} label={t} onRemove={() => set('tags', form.tags.filter(x => x !== t))} />)}
              </div>
            )}
          </Field>
        </>}

        {tab === 'detail' && <>
          <Field label="Các bước tái hiện" hint="Liệt kê từng bước để tái hiện bug">
            <Textarea value={form.steps_to_reproduce} onChange={e => set('steps_to_reproduce', e.target.value)}
              placeholder="1. Mở trang...\n2. Click vào...\n3. Xảy ra lỗi..." rows={6} />
          </Field>
          <Field label="Giải pháp / Fix" hint="Ghi lại cách đã xử lý bug này">
            <Textarea value={form.solution} onChange={e => set('solution', e.target.value)}
              placeholder="Cách fix, commit liên quan, nguyên nhân gốc..." rows={5} />
          </Field>
        </>}

        {tab === 'note' && <>
          <Field label="Ghi chú" hint="Ghi thêm context, link, ảnh chụp màn hình...">
            <Textarea value={form.note} onChange={e => set('note', e.target.value)}
              placeholder="Ghi chú tự do về bug này..." rows={8} />
          </Field>
        </>}
      </form>
    </Modal>
  )
}
