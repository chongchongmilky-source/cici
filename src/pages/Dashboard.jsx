import { useTasks } from '../hooks/useTasks';
import { useBugs } from '../hooks/useBugs';
import { useLearn } from '../hooks/useLearn';

const css = `
.dash-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 28px;
}
.dash-tip {
  background: var(--bg3);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  padding: 18px 20px;
}
@media (max-width: 480px) {
  .dash-grid { grid-template-columns: 1fr; gap: 12px; }
  .dash-tip { padding: 14px 16px; }
}
`

export default function Dashboard() {
  const { tasks = [] } = useTasks();
  const { bugs = [] } = useBugs();
  const { subjects = [] } = useLearn();

  const stats = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === 'done').length,
    inProgressTasks: tasks.filter(t => t.status === 'in_progress').length,
    totalBugs: bugs.length,
    fixedBugs: bugs.filter(b => b.status === 'resolved').length,
    criticalBugs: bugs.filter(b => b.severity === 'critical' && !['resolved','closed','wont_fix'].includes(b.status)).length,
    totalSubjects: subjects.length,
  };

  return (
    <>
      <style>{css}</style>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Tổng quan</h1>
        <p style={{ color: 'var(--text2)', marginBottom: 24, fontSize: 14 }}>
          Chào mừng đến với Workspace. Chọn mục ở menu để bắt đầu.
        </p>

        <div className="dash-grid">
          <StatCard
            title="Công việc"
            value={stats.totalTasks}
            sub={`${stats.completedTasks} hoàn thành · ${stats.inProgressTasks} đang làm`}
            icon="◈"
            color="var(--accent)"
          />
          <StatCard
            title="Bug Tracker"
            value={stats.totalBugs}
            sub={`${stats.fixedBugs} đã giải quyết · ${stats.criticalBugs} nghiêm trọng`}
            icon="◉"
            color="var(--accent2)"
          />
          <StatCard
            title="Ôn luyện"
            value={stats.totalSubjects}
            sub="Học chủ động với spaced repetition"
            icon="◆"
            color="var(--accent3)"
          />
        </div>

        <div className="dash-tip">
          <div style={{ fontWeight: 600, marginBottom: 10, fontSize: 14 }}>💡 Mẹo nhanh</div>
          <div style={{ color: 'var(--text2)', fontSize: 13, lineHeight: 1.8 }}>
            • Dùng thanh tìm kiếm và bộ lọc để tìm công việc / lỗi nhanh hơn.<br />
            • Dữ liệu tự động lưu vào Supabase — đăng nhập ở bất kỳ đâu.<br />
            • Vào <strong style={{color:'var(--text)'}}>Cài đặt</strong> để reset dữ liệu từng phần.
          </div>
        </div>
      </div>
    </>
  );
}

function StatCard({ title, value, sub, icon, color }) {
  return (
    <div style={{
      background: 'var(--bg2)',
      borderRadius: 'var(--radius)',
      border: '1px solid var(--border)',
      padding: '16px 18px',
      borderLeft: `3px solid ${color}`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <span style={{ fontSize: 18, color }}>{icon}</span>
        <span style={{ fontSize: 30, fontWeight: 800, color }}>{value}</span>
      </div>
      <div style={{ fontWeight: 700, marginBottom: 3, fontSize: 14 }}>{title}</div>
      <div style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.5 }}>{sub}</div>
    </div>
  );
}
