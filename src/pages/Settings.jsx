import { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useBugs } from '../hooks/useBugs';
import { useLearn } from '../hooks/useLearn';
import { ConfirmDialog } from '../components/ui';

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

  return (
    <div style={{ padding: '24px 32px' }}>
      <h1>Cài đặt hệ thống</h1>
      <p>Đặt lại dữ liệu từng phần về trạng thái trống.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
        {['tasks', 'bugs', 'learn'].map(type => (
          <div key={type} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 }}>
            <div style={{ fontSize: 36, fontWeight: 800 }}>{getCount(type)}</div>
            <div style={{ margin: '8px 0 16px' }}>
              {type === 'tasks' && '📋 Công việc'}
              {type === 'bugs' && '🐞 Lỗi'}
              {type === 'learn' && '📚 Ôn luyện'}
            </div>
            <button
              onClick={() => setConfirming(type)}
              disabled={getCount(type) === 0}
              style={{
                background: getCount(type) === 0 ? 'var(--bg3)' : 'var(--accent2)',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '8px 16px',
                cursor: getCount(type) === 0 ? 'not-allowed' : 'pointer'
              }}>
              {getCount(type) === 0 ? '✅ Đã trống' : '🔄 Reset'}
            </button>
          </div>
        ))}
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

      <div style={{ marginTop: 40, padding: 16, background: 'var(--bg3)', borderRadius: 'var(--radius)', borderLeft: '4px solid var(--accent)' }}>
        💡 Dữ liệu sau khi reset không thể khôi phục.
      </div>
    </div>
  );
}