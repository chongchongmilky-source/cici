// src/pages/Settings.jsx
import { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useBugs } from '../hooks/useBugs';
import { useLearn } from '../hooks/useLearn';
import { ConfirmDialog } from '../components/ui';

export default function Settings() {
  const { tasks, resetTasks } = useTasks();
  const { bugs, resetBugs } = useBugs();
  const { subjects, resetLearn } = useLearn();

  const [confirming, setConfirming] = useState(null); // 'tasks', 'bugs', 'learn'

  const handleReset = async (type) => {
    if (type === 'tasks') await resetTasks();
    if (type === 'bugs') await resetBugs();
    if (type === 'learn') await resetLearn();
    setConfirming(null);
  };

  const cards = [
    {
      id: 'tasks',
      title: '📋 Công việc',
      count: tasks.length,
      description: 'Xoá toàn bộ danh sách công việc của bạn.',
      confirmMsg: `Xoá ${tasks.length} công việc? Hành động này không thể hoàn tác.`
    },
    {
      id: 'bugs',
      title: '🐞 Lỗi',
      count: bugs.length,
      description: 'Xoá toàn bộ báo cáo lỗi.',
      confirmMsg: `Xoá ${bugs.length} lỗi? Hành động này không thể hoàn tác.`
    },
    {
      id: 'learn',
      title: '📚 Ôn luyện',
      count: subjects.length,
      description: 'Xoá toàn bộ môn học và bài học (kèm lịch sử ôn tập).',
      confirmMsg: `Xoá ${subjects.length} môn học và tất cả bài học bên trong? Hành động này không thể hoàn tác.`
    }
  ];

  return (
    <div style={{ padding: '24px 32px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Cài đặt hệ thống</h1>
      <p style={{ color: 'var(--text2)', marginBottom: 32 }}>
        Quản lý dữ liệu: đặt lại từng phần về trạng thái trống.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        {cards.map(card => (
          <div key={card.id}
            style={{
              background: 'var(--bg2)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '20px',
              transition: 'all var(--transition)'
            }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>{card.title.split(' ')[0]}</div>
            <div style={{ fontSize: 36, fontWeight: 800, marginBottom: 4 }}>{card.count}</div>
            <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 16 }}>{card.description}</div>
            <button
              onClick={() => setConfirming(card.id)}
              disabled={card.count === 0}
              style={{
                background: card.count === 0 ? 'var(--bg3)' : 'var(--accent2)',
                color: card.count === 0 ? 'var(--text3)' : '#fff',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 16px',
                fontSize: 13,
                fontWeight: 600,
                cursor: card.count === 0 ? 'not-allowed' : 'pointer',
                transition: 'opacity 0.2s'
              }}>
              {card.count === 0 ? '✅ Đã trống' : '🔄 Reset về 0'}
            </button>
          </div>
        ))}
      </div>

      {confirming && (
        <ConfirmDialog
          title="Xác nhận reset"
          message={cards.find(c => c.id === confirming)?.confirmMsg}
          danger
          onConfirm={() => handleReset(confirming)}
          onCancel={() => setConfirming(null)}
        />
      )}

      <div style={{ marginTop: 40, padding: '16px 20px', background: 'var(--bg3)', borderRadius: 'var(--radius)', borderLeft: '4px solid var(--accent)' }}>
        <strong>💡 Lưu ý:</strong> Dữ liệu sau khi reset không thể khôi phục. Bạn có thể tạo lại dữ liệu mẫu bằng cách thêm thủ công từ các trang tương ứng.
      </div>
    </div>
  );
}