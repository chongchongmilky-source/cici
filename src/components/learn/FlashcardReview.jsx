import { useState } from 'react'
import Modal from '../ui/Modal.jsx'
import { Btn } from '../ui/index.jsx'
import { REVIEW_QUALITY } from '../../utils/constants.js'

const css = `
.review-card {
  background: var(--bg3);
  border: 1px solid var(--border2);
  border-radius: var(--radius);
  padding: 28px 24px;
  min-height: 220px;
  display: flex; flex-direction: column;
  position: relative;
}
.review-flip {
  position: absolute; top: 12px; right: 12px;
  background: none; border: 1px solid var(--border);
  border-radius: 6px; padding: 4px 10px;
  font-size: 11px; font-family: var(--mono); color: var(--text3);
  cursor: pointer;
}
.review-flip:hover { color: var(--text); border-color: var(--border2); }
.quality-btn {
  flex: 1; padding: 10px 6px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--bg2);
  color: var(--text2);
  font-family: var(--font); font-size: 12px; font-weight: 500;
  cursor: pointer;
  transition: all var(--transition);
  text-align: center;
}
.quality-btn:hover { border-color: var(--accent); color: var(--text); }
`

export default function FlashcardReview({ lessons, subjectName, onReview, onClose }) {
  const [idx, setIdx] = useState(0)
  const [showBack, setShowBack] = useState(false)
  const [done, setDone] = useState(false)

  const lesson = lessons[idx]

  async function handleQuality(q) {
    await onReview(lesson.id, q)
    if (idx + 1 >= lessons.length) {
      setDone(true)
    } else {
      setIdx(i => i + 1)
      setShowBack(false)
    }
  }

  if (done) return (
    <Modal title="Hoàn thành ôn tập!" onClose={onClose}>
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
        <p style={{ color: 'var(--text2)', marginBottom: 20 }}>Đã ôn tập xong <strong>{lessons.length}</strong> bài trong môn <strong>{subjectName}</strong></p>
        <Btn onClick={onClose}>Xong</Btn>
      </div>
    </Modal>
  )

  return (
    <>
      <style>{css}</style>
      <Modal title={`Ôn tập — ${subjectName}`} onClose={onClose} width="620px">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Progress */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, height: 4, background: 'var(--bg3)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ width: `${(idx / lessons.length) * 100}%`, height: '100%', background: 'var(--accent3)', transition: 'width 0.3s ease' }} />
            </div>
            <span style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', flexShrink: 0 }}>
              {idx + 1} / {lessons.length}
            </span>
          </div>

          {/* Card */}
          <div className="review-card">
            <button className="review-flip" onClick={() => setShowBack(b => !b)}>
              {showBack ? 'Xem đề bài' : 'Xem nội dung'}
            </button>
            <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--accent3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
              {showBack ? 'Nội dung / Tóm tắt' : 'Bài học'}
            </div>
            <div style={{ fontWeight: 700, fontSize: 18, lineHeight: 1.3, marginBottom: 12 }}>{lesson.title}</div>
            {showBack ? (
              <div style={{ flex: 1 }}>
                {lesson.summary && (
                  <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6, marginBottom: 10, whiteSpace: 'pre-wrap' }}>
                    {lesson.summary}
                  </div>
                )}
                {lesson.content && (
                  <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, whiteSpace: 'pre-wrap', borderTop: '1px solid var(--border)', paddingTop: 10, marginTop: 6 }}>
                    {lesson.content}
                  </div>
                )}
                {lesson.note && (
                  <div style={{ marginTop: 10, padding: '8px 12px', background: 'var(--bg2)', borderRadius: 6, borderLeft: '3px solid var(--accent4)' }}>
                    <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--accent4)', marginBottom: 4 }}>GHI CHÚ</div>
                    <div style={{ fontSize: 13, color: 'var(--text2)', whiteSpace: 'pre-wrap' }}>{lesson.note}</div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text3)', fontSize: 13, fontStyle: 'italic' }}>
                Click "Xem nội dung" để kiểm tra
              </div>
            )}
          </div>

          {/* Quality rating - only shown after flipping */}
          {showBack && (
            <div>
              <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 8, textAlign: 'center' }}>Bạn nhớ được bao nhiêu?</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {REVIEW_QUALITY.map(q => (
                  <button key={q.value} className="quality-btn"
                    onClick={() => handleQuality(q.value)}
                    style={{ '--q-color': q.color }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = q.color; e.currentTarget.style.color = q.color }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text2)' }}>
                    <div style={{ fontSize: 18, marginBottom: 3 }}>{['😫','😟','😕','🙂','😊','🤩'][q.value]}</div>
                    {q.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!showBack && (
            <Btn onClick={() => setShowBack(true)} style={{ alignSelf: 'center' }}>
              Xem nội dung →
            </Btn>
          )}
        </div>
      </Modal>
    </>
  )
}
