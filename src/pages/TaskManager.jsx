import { useState, useMemo } from 'react'
import { useTasks } from '../hooks/useTasks.js'
import TaskForm from '../components/tasks/TaskForm.jsx'
import TaskList from '../components/tasks/TaskList.jsx'
import { SearchBar, FilterButtons, EmptyState, Loader, Btn, PageHeader } from '../components/ui/index.jsx'
import { TASK_STATUS, TASK_PRIORITY } from '../utils/constants.js'

const css = `
.task-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 20px;
}
@media (max-width: 480px) {
  .task-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    margin-bottom: 14px;
  }
}
`

const STATUS_FILTERS = [
  { value: 'all', label: 'Tất cả' },
  ...Object.entries(TASK_STATUS).map(([v, d]) => ({ value: v, label: d.label, color: d.color }))
]

const PRIORITY_FILTERS = [
  { value: 'all', label: 'Mọi ưu tiên' },
  ...Object.entries(TASK_PRIORITY).map(([v, d]) => ({ value: v, label: d.label, color: d.color }))
]

export default function TaskManager() {
  const { tasks, loading, addTask, updateTask, removeTask } = useTasks()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')

  const filtered = useMemo(() => {
    return tasks.filter(t => {
      const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description?.toLowerCase().includes(search.toLowerCase()) ||
        t.note?.toLowerCase().includes(search.toLowerCase()) ||
        t.tags?.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
      const matchStatus = statusFilter === 'all' || t.status === statusFilter
      const matchPriority = priorityFilter === 'all' || t.priority === priorityFilter
      return matchSearch && matchStatus && matchPriority
    })
  }, [tasks, search, statusFilter, priorityFilter])

  const statusFiltersWithCount = STATUS_FILTERS.map(f => ({
    ...f,
    count: f.value === 'all' ? tasks.length : tasks.filter(t => t.status === f.value).length
  }))

  const stats = {
    total: tasks.length,
    done: tasks.filter(t => t.status === 'done').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    urgent: tasks.filter(t => t.priority === 'urgent' && t.status !== 'done').length,
  }

  return (
    <>
      <style>{css}</style>
      <div>
        <PageHeader title="Công việc" sub={`${stats.done}/${stats.total} hoàn thành`} accentColor="var(--task)">
          <Btn onClick={() => setShowForm(true)}>+ Thêm công việc</Btn>
        </PageHeader>

        <div className="task-stats">
          {[
            { label: 'Tổng', value: stats.total, color: 'var(--text2)' },
            { label: 'Đang làm', value: stats.inProgress, color: 'var(--accent)' },
            { label: 'Hoàn thành', value: stats.done, color: 'var(--accent3)' },
            { label: 'Khẩn cấp', value: stats.urgent, color: 'var(--accent2)' },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '12px 14px' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Tìm công việc, ghi chú, tags..." />
          <FilterButtons options={statusFiltersWithCount} value={statusFilter} onChange={setStatusFilter} />
          <FilterButtons options={PRIORITY_FILTERS} value={priorityFilter} onChange={setPriorityFilter} />
        </div>

        {loading ? <Loader /> : (
          filtered.length === 0 ? (
            <EmptyState icon="◈" title="Không có công việc nào" sub={search ? 'Thử tìm kiếm khác' : 'Thêm công việc đầu tiên'}
              action={!search && <Btn onClick={() => setShowForm(true)}>+ Thêm công việc</Btn>} />
          ) : (
            <TaskList tasks={filtered} onEdit={t => setEditing(t)} onUpdate={updateTask} onDelete={removeTask} />
          )
        )}

        {showForm && <TaskForm onSave={addTask} onClose={() => setShowForm(false)} />}
        {editing && <TaskForm initial={editing} onSave={d => updateTask(editing.id, d)} onClose={() => setEditing(null)} />}
      </div>
    </>
  )
}
