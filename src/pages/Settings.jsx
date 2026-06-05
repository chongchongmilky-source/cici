import { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useBugs } from '../hooks/useBugs';
import { useLearn } from '../hooks/useLearn';
import { ConfirmDialog } from '../components/ui';

const css = `
.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin: 20px 0 32px;
}
@media (max-width: 480px) {
  .settings-grid { grid-template-columns: 1fr; gap: 12px; }
}
`

export default function Settings() {
  const { tasks, resetTasks } = useTasks();
  const { bugs, resetBugs } = useBugs();
  const { subjects, resetLearn } = useLearn();
  const [confirming, setConfirming] = useState(null);

  const handleReset = async (type) => {
    try {
      if (type === 'tasks' && resetTasks) await resetTasks();
      if (type === 'bugs' && resetBugs) await resetBugs();
      if (type === 'learn' && resetLearn) await resetLearn();
    } catch (error) {
      console.error(error);
    } finally {
      setConfirming(null);
    }
  };

  const getCount = (type) => {
    if (type === 'tasks') return tasks.length;
    if (type === 'bugs') return bugs.length;
    return subjects.length;
  };

  const getMessage = (type) => {
    const count = getCount(type);
    if (type === 'tasks') return `Xoá ${count} công việc? Không thể hoàn tác.`;
    if (type === 'bugs') return `Xoá ${count} lỗi? Không thể hoàn tác.`;
    return `Xoá ${count} môn học (và bài học)? Không thể hoàn tác.`;
  };

  const items = [
    { type: 'tasks', icon: '◈', label: 'Công việc', color: 'var(--accent)' },
    { type: 'bugs', icon: '◉', label: 'Bug Tracker', color: 'var(--accent2)' },
    { type: 'learn', icon: '◆', label: 'Ôn luyện', color: 'var(--accent3)' },
  ];

  return (
    <>
      <style>{css}</style>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Cài đặt</h1>
        <p style={{ color: 'var(--text2)', fontSize: 14 }}>Đặt lại dữ liệu từng phần về trạng thái trống.</p>

        <div className="settings-grid">
          {items.map(({ type, icon, label, color }) => {
            const count = getCount(type);
            return (
              <div key={type} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '18px 20px', borderTop: `3px solid ${color}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 16, color }}>{icon}</span>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{label}</span>
                </div>
                <div style={{ fontSize: 36, fontWeight: 800, color, marginBottom: 14 }}>{count}</div>
                <button
                  onClick={() => setConfirming(type)}
                  disabled={count === 0}
                  style={{
                    background: count === 0 ? 'var(--bg3)' : 'rgba(255,107,107,0.15)',
                    color: count === 0 ? 'var(--text3)' : 'var(--accent2)',
                    border: `1px solid ${count === 0 ? 'var(--border)' : 'rgba(255,107,107,0.3)'}`,
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 16px',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: count === 0 ? 'not-allowed' : 'pointer',
                    width: '100%',
                    fontFamily: 'var(--font)',
                    transition: 'all var(--transition)',
                  }}>
                  {count === 0 ? '✅ Đã trống' : '🔄 Reset dữ liệu'}
                </button>
              </div>
            );
          })}
        </div>

        <div style={{ padding: '14px 16px', background: 'var(--bg3)', borderRadius: 'var(--radius)', borderLeft: '3px solid var(--accent)', fontSize: 13, color: 'var(--text2)' }}>
          ⚠️ Dữ liệu sau khi reset không thể khôi phục.
        </div>
      </div>

      {confirming && (
        <ConfirmDialog
          title="Xác nhận reset"
          message={getMessage(confirming)}
          danger
          onConfirm={() => handleReset(confirming)}
          onCancel={() => setConfirming(null)}
        />
      )}
    </>
  );
}
