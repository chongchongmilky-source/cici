// src/pages/Dashboard.jsx
import { useTasks } from '../hooks/useTasks';
import { useBugs } from '../hooks/useBugs';
import { useLearn } from '../hooks/useLearn';

export default function Dashboard() {
  const { tasks = [] } = useTasks();
  const { bugs = [] } = useBugs();
  const { subjects = [] } = useLearn();

  const stats = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === 'Hoàn thành').length,
    highPriorityTasks: tasks.filter(t => t.priority === 'Cao').length,
    totalBugs: bugs.length,
    fixedBugs: bugs.filter(b => b.status === 'Đã sửa').length,
    seriousBugs: bugs.filter(b => b.severity === 'Nghiêm trọng').length,
    totalSubjects: subjects.length,
  };

  return (
    <div style={{ padding: '24px 32px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Trang chủ</h1>
      <p style={{ color: 'var(--text2)', marginBottom: 32 }}>
        Chào mừng đến với Hệ thống Quản lý. Hãy chọn một mục ở menu bên trái để bắt đầu.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 20,
        marginBottom: 40
      }}>
        <StatCard
          title="Công việc"
          value={stats.totalTasks}
          sub={`${stats.completedTasks} hoàn thành · ${stats.highPriorityTasks} ưu tiên cao`}
          icon="📋"
        />
        <StatCard
          title="Lỗi"
          value={stats.totalBugs}
          sub={`${stats.fixedBugs} đã sửa · ${stats.seriousBugs} nghiêm trọng`}
          icon="🐞"
        />
        <StatCard
          title="Môn học"
          value={stats.totalSubjects}
          sub="Học chủ động với spaced repetition"
          icon="📚"
        />
      </div>

      <div style={{
        background: 'var(--bg3)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border)',
        padding: '20px 24px'
      }}>
        <h3 style={{ fontWeight: 600, marginBottom: 8 }}>💡 Mẹo nhanh</h3>
        <p style={{ color: 'var(--text2)', fontSize: 14 }}>
          • Sử dụng thanh tìm kiếm và bộ lọc để nhanh chóng tìm công việc / lỗi.<br />
          • Dữ liệu được tự động lưu vào Supabase, bạn có thể đăng nhập ở bất kỳ đâu.<br />
          • Trong "Cài đặt", bạn có thể khôi phục dữ liệu mặc định cho từng phần.
        </p>
      </div>
    </div>
  );
}

function StatCard({ title, value, sub, icon }) {
  return (
    <div style={{
      background: 'var(--bg3)',
      borderRadius: 'var(--radius-sm)',
      border: '1px solid var(--border)',
      padding: '18px 20px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 28 }}>{icon}</span>
        <span style={{ fontSize: 32, fontWeight: 700 }}>{value}</span>
      </div>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 13, color: 'var(--text2)' }}>{sub}</div>
    </div>
  );
}