import { useState, useEffect } from 'react'
import { useLearn } from '../hooks/useLearn.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import SubjectManager from '../components/learn/SubjectManager.jsx'
import FlashcardReview from '../components/learn/FlashcardReview.jsx'
import Modal from '../components/ui/Modal.jsx'
import { Btn, Field, Input, Textarea, Select, StatusBadge, EmptyState, Loader, PageHeader, ConfirmDialog } from '../components/ui/index.jsx'
import { LESSON_STATUS } from '../utils/constants.js'
import { formatDate, timeAgo } from '../utils/helpers.js'

const css = `
.learn-layout { display: grid; grid-template-columns: 200px 1fr; gap: 20px; }
.learn-sidebar { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px; }
.lesson-card {
  background: var(--bg2); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 14px 16px;
  animation: fadeIn 0.2s ease; transition: border-color var(--transition);
}
.lesson-card:hover { border-color: var(--border2); }
.lesson-content { font-size: 13px; color: var(--text2); line-height: 1.6; white-space: pre-wrap; }
.lesson-note { font-size: 12px; color: var(--text2); white-space: pre-wrap; padding: 8px 12px; background: var(--bg3); border-left: 3px solid var(--accent4); border-radius: 0 6px 6px 0; margin-top: 8px; }
.review-indicator { display: flex; align-items: center; gap: 5px; font-size: 11px; font-family: var(--mono); }
@media (max-width: 700px) { .learn-layout { grid-template-columns: 1fr; } }
`

const STATUS_OPTS = Object.entries(LESSON_STATUS).map(([v, d]) => ({ value: v, label: d.label }))

function LessonForm({ initial, subjectId, userId, totalLessons, onSave, onClose }) {
  const [form, setForm] = useState(initial || {
    title: '', content: '', summary: '', note: '',
    status: 'not_started', order_index: totalLessons,
  })
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState('info')
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) return
    setSaving(true)
    try { await onSave({ ...form, subject_id: subjectId, user_id: userId }); onClose() }
    finally { setSaving(false) }
  }

  const tabs = [{ key: 'info', label: 'Thông tin' }, { key: 'content', label: 'Nội dung' }, { key: 'note', label: 'Ghi chú' }]

  return (
    <Modal title={initial?.id ? 'Sửa bài học' : 'Thêm bài học'} onClose={onClose} width="600px"
      footer={<><Btn variant="ghost" onClick={onClose}>Huỷ</Btn><Btn onClick={handleSubmit} disabled={saving} style={{ background: 'var(--accent3)', color: '#000' }}>{saving ? 'Đang lưu...' : 'Lưu'}</Btn></>}>
      <div style={{ display: 'flex', gap: 0, marginBottom: 16, borderBottom: '1px solid var(--border)' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{ padding: '7px 14px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font)', fontSize: 13, fontWeight: 500, color: tab === t.key ? 'var(--accent3)' : 'var(--text2)', borderBottom: tab === t.key ? '2px solid var(--accent3)' : '2px solid transparent', marginBottom: -1, transition: 'all var(--transition)' }}>
            {t.label}
          </button>
        ))}
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {tab === 'info' && <>
          <Field label="Tên bài học" required>
            <Input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Bài 1: Giới thiệu..." autoFocus required />
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Trạng thái">
              <Select value={form.status} onChange={e => set('status', e.target.value)} options={STATUS_OPTS} />
            </Field>
            <Field label="Thứ tự" hint="Số thứ tự trong môn học">
              <Input type="number" min="0" value={form.order_index} onChange={e => set('order_index', +e.target.value)} />
            </Field>
          </div>
          <Field label="Tóm tắt" hint="Điểm chính cần nhớ, hiện trong ôn tập">
            <Textarea value={form.summary} onChange={e => set('summary', e.target.value)} placeholder="Tóm tắt những điểm quan trọng nhất của bài này..." rows={4} />
          </Field>
        </>}
        {tab === 'content' && (
          <Field label="Nội dung bài học" hint="Ghi chép chi tiết, công thức, ví dụ...">
            <Textarea value={form.content} onChange={e => set('content', e.target.value)} placeholder="Nội dung chi tiết bài học..." rows={10} />
          </Field>
        )}
        {tab === 'note' && (
          <Field label="Ghi chú" hint="Câu hỏi, điểm cần hỏi, link tài liệu...">
            <Textarea value={form.note} onChange={e => set('note', e.target.value)} placeholder="Ghi chú tự do: điểm khó, câu hỏi, link tài liệu..." rows={8} />
          </Field>
        )}
      </form>
    </Modal>
  )
}

function LessonCard({ lesson, onEdit, onDelete, onUpdate }) {
  const [expanded, setExpanded] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const status = LESSON_STATUS[lesson.status]
  const isOverdue = lesson.next_review && new Date(lesson.next_review) <= new Date()

  return (
    <>
      {deleting && (
        <ConfirmDialog title="Xoá bài học" message={`Xoá bài "${lesson.title}"?`} danger
          onConfirm={() => { onDelete(lesson.id); setDeleting(false) }}
          onCancel={() => setDeleting(false)} />
      )}
      <div className="lesson-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => setExpanded(e => !e)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>#{lesson.order_index + 1}</span>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{lesson.title}</span>
            </div>
            {lesson.summary && !expanded && (
              <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>{lesson.summary.slice(0, 100)}{lesson.summary.length > 100 ? '...' : ''}</div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 5, alignItems: 'center', flexShrink: 0 }}>
            <StatusBadge label={status.label} color={status.color} small />
            {isOverdue && lesson.review_count > 0 && <span title="Đến hạn ôn tập">🔔</span>}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
          {lesson.review_count > 0 && (
            <span className="review-indicator" style={{ color: 'var(--text3)' }}>↺ {lesson.review_count} lần ôn</span>
          )}
          {lesson.next_review && (
            <span className="review-indicator" style={{ color: isOverdue ? 'var(--accent2)' : 'var(--text3)' }}>
              📅 Ôn tiếp: {formatDate(lesson.next_review)}
            </span>
          )}
          {lesson.last_reviewed && (
            <span className="review-indicator" style={{ color: 'var(--text3)' }}>✓ {timeAgo(lesson.last_reviewed)}</span>
          )}
        </div>

        {expanded && <>
          {lesson.summary && (
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
              <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--accent3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5 }}>Tóm tắt</div>
              <div className="lesson-content">{lesson.summary}</div>
            </div>
          )}
          {lesson.content && (
            <div style={{ marginTop: 10 }}>
              <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5 }}>Nội dung</div>
              <div className="lesson-content">{lesson.content}</div>
            </div>
          )}
          {lesson.note && <div className="lesson-note">{lesson.note}</div>}
          <div style={{ display: 'flex', gap: 6, marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
            {lesson.status !== 'mastered' && (
              <Btn small variant="subtle" onClick={() => onUpdate(lesson.id, { status: 'mastered' })}>⭐ Nắm rõ</Btn>
            )}
            {lesson.status === 'not_started' && (
              <Btn small variant="subtle" onClick={() => onUpdate(lesson.id, { status: 'learning' })}>▶ Bắt đầu học</Btn>
            )}
            <Btn small variant="ghost" onClick={() => onEdit(lesson)}>✎ Sửa</Btn>
            <Btn small variant="danger" onClick={() => setDeleting(true)}>✕ Xoá</Btn>
          </div>
        </>}
      </div>
    </>
  )
}

export default function LearnManager() {
  const { user: authUser } = useAuth()
  const {
    subjects, lessons, loading, activeSubject, setActiveSubject,
    loadLessons, addSubject, updateSubject, removeSubject,
    addLesson, updateLesson, removeLesson, reviewLesson
  } = useLearn()

  const [showLessonForm, setShowLessonForm] = useState(false)
  const [editingLesson, setEditingLesson] = useState(null)
  const [reviewing, setReviewing] = useState(false)

  useEffect(() => {
    if (activeSubject && !lessons[activeSubject.id]) {
      loadLessons(activeSubject.id)
    }
  }, [activeSubject])

  const currentLessons = activeSubject ? (lessons[activeSubject.id] || []) : []
  const lessonCounts = Object.fromEntries(subjects.map(s => [s.id, (lessons[s.id] || []).length]))
  const dueLessons = currentLessons.filter(l => l.next_review && new Date(l.next_review) <= new Date())

  const stats = {
    total: currentLessons.length,
    mastered: currentLessons.filter(l => l.status === 'mastered').length,
    learning: currentLessons.filter(l => l.status === 'learning').length,
    due: dueLessons.length,
  }

  return (
    <>
      <style>{css}</style>
      <PageHeader title="Ôn luyện" sub="Học theo môn và bài, nhắc lặp thông minh" accentColor="var(--learn)" />

      <div className="learn-layout">
        <div className="learn-sidebar">
          <SubjectManager
            subjects={subjects} activeSubject={activeSubject}
            onSelect={s => { setActiveSubject(s); if (!lessons[s.id]) loadLessons(s.id) }}
            lessonCounts={lessonCounts}
            onAdd={addSubject} onEdit={updateSubject} onDelete={removeSubject}
          />
        </div>

        <div className="learn-main">
          {!activeSubject ? (
            <EmptyState icon="◆" title="Chọn môn học" sub="Chọn hoặc thêm môn học ở bên trái" />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Subject header */}
              <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '14px 18px', borderLeft: `4px solid ${activeSubject.color}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 20 }}>{activeSubject.icon}</span>
                      <h2 style={{ fontSize: 17, fontWeight: 800 }}>{activeSubject.name}</h2>
                    </div>
                    {activeSubject.description && <p style={{ fontSize: 12.5, color: 'var(--text2)' }}>{activeSubject.description}</p>}
                    {activeSubject.note && <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4, fontFamily: 'var(--mono)' }}>{activeSubject.note}</p>}
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {dueLessons.length > 0 && (
                      <Btn onClick={() => setReviewing(true)} style={{ background: 'var(--accent3)', color: '#000' }}>
                        🔔 Ôn tập ({dueLessons.length})
                      </Btn>
                    )}
                    {currentLessons.length > 0 && dueLessons.length === 0 && (
                      <Btn onClick={() => setReviewing(true)} variant="ghost">↺ Ôn tất cả</Btn>
                    )}
                    <Btn onClick={() => setShowLessonForm(true)} style={{ background: activeSubject.color }}>+ Thêm bài</Btn>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 20, marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
                  {[
                    { label: 'Tổng bài', value: stats.total },
                    { label: 'Đang học', value: stats.learning, color: 'var(--accent)' },
                    { label: 'Nắm rõ', value: stats.mastered, color: 'var(--accent3)' },
                    { label: 'Đến hạn ôn', value: stats.due, color: stats.due > 0 ? 'var(--accent2)' : 'var(--text3)' },
                  ].map(s => (
                    <div key={s.label}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: s.color || 'var(--text)' }}>{s.value}</div>
                      <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {loading ? <Loader /> : (
                currentLessons.length === 0 ? (
                  <EmptyState icon="📝" title="Chưa có bài học" sub="Thêm bài học đầu tiên"
                    action={<Btn onClick={() => setShowLessonForm(true)} style={{ background: activeSubject.color }}>+ Thêm bài học</Btn>} />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[...currentLessons].sort((a, b) => a.order_index - b.order_index).map(lesson => (
                      <LessonCard
                        key={lesson.id} lesson={lesson}
                        onEdit={setEditingLesson}
                        onDelete={id => removeLesson(id, activeSubject.id)}
                        onUpdate={(id, updates) => updateLesson(id, activeSubject.id, updates)}
                      />
                    ))}
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {showLessonForm && activeSubject && (
        <LessonForm subjectId={activeSubject.id} userId={authUser?.id} totalLessons={currentLessons.length}
          onSave={addLesson} onClose={() => setShowLessonForm(false)} />
      )}
      {editingLesson && (
        <LessonForm initial={editingLesson} subjectId={editingLesson.subject_id} userId={authUser?.id}
          totalLessons={currentLessons.length}
          onSave={d => updateLesson(editingLesson.id, editingLesson.subject_id, d)}
          onClose={() => setEditingLesson(null)} />
      )}
      {reviewing && activeSubject && (
        <FlashcardReview
          lessons={dueLessons.length > 0 ? dueLessons : currentLessons}
          subjectName={activeSubject.name}
          onReview={(id, q) => reviewLesson(id, activeSubject.id, q)}
          onClose={() => setReviewing(false)}
        />
      )}
    </>
  )
}