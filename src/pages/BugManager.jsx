import { useState, useMemo } from 'react'
import { useBugs } from '../hooks/useBugs.js'
import BugForm from '../components/bugs/BugForm.jsx'
import BugList from '../components/bugs/BugList.jsx'
import { SearchBar, FilterButtons, EmptyState, Loader, Btn, PageHeader } from '../components/ui/index.jsx'
import { BUG_STATUS, BUG_SEVERITY } from '../utils/constants.js'

const css = `
.bug-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 20px;
}
@media (max-width: 480px) {
  .bug-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    margin-bottom: 14px;
  }
}
`

const STATUS_FILTERS = [
  { value: 'all', label: 'Tất cả' },
  ...Object.entries(BUG_STATUS).map(([v, d]) => ({ value: v, label: d.label, color: d.color }))
]

const SEVERITY_FILTERS = [
  { value: 'all', label: 'Mọi mức' },
  ...Object.entries(BUG_SEVERITY).map(([v, d]) => ({ value: v, label: d.label, color: d.color }))
]

export default function BugManager() {
  const { bugs, loading, addBug, updateBug, removeBug } = useBugs()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [severityFilter, setSeverityFilter] = useState('all')

  const filtered = useMemo(() => {
    return bugs.filter(b => {
      const matchSearch = !search ||
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.description?.toLowerCase().includes(search.toLowerCase()) ||
        b.note?.toLowerCase().includes(search.toLowerCase()) ||
        b.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()))
      const matchStatus = statusFilter === 'all' || b.status === statusFilter
      const matchSev = severityFilter === 'all' || b.severity === severityFilter
      return matchSearch && matchStatus && matchSev
    })
  }, [bugs, search, statusFilter, severityFilter])

  const stats = {
    open: bugs.filter(b => b.status === 'open').length,
    inProgress: bugs.filter(b => b.status === 'in_progress').length,
    resolved: bugs.filter(b => b.status === 'resolved').length,
    critical: bugs.filter(b => b.severity === 'critical' && !['resolved','closed','wont_fix'].includes(b.status)).length,
  }

  return (
    <>
      <style>{css}</style>
      <div>
        <PageHeader title="Bug Tracker" sub={`${stats.open} đang mở · ${stats.resolved} đã giải quyết`} accentColor="var(--bug)">
          <Btn onClick={() => setShowForm(true)} style={{ background: 'var(--accent2)' }}>+ Báo cáo bug</Btn>
        </PageHeader>

        <div className="bug-stats">
          {[
            { label: 'Đang mở', value: stats.open, color: 'var(--accent2)' },
            { label: 'Đang xử lý', value: stats.inProgress, color: 'var(--accent)' },
            { label: 'Đã giải quyết', value: stats.resolved, color: 'var(--accent3)' },
            { label: 'Nghiêm trọng', value: stats.critical, color: '#ff0000' },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '12px 14px' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Tìm bug, ghi chú, tags..." />
          <FilterButtons options={STATUS_FILTERS.map(f => ({ ...f, count: f.value === 'all' ? bugs.length : bugs.filter(b => b.status === f.value).length }))}
            value={statusFilter} onChange={setStatusFilter} />
          <FilterButtons options={SEVERITY_FILTERS} value={severityFilter} onChange={setSeverityFilter} />
        </div>

        {loading ? <Loader /> : (
          filtered.length === 0 ? (
            <EmptyState icon="◉" title="Không có bug nào" sub={search ? 'Thử tìm kiếm khác' : 'Thêm bug đầu tiên'}
              action={!search && <Btn onClick={() => setShowForm(true)} style={{ background: 'var(--accent2)' }}>+ Báo cáo bug</Btn>} />
          ) : (
            <BugList bugs={filtered} onEdit={setEditing} onUpdate={updateBug} onDelete={removeBug} />
          )
        )}

        {showForm && <BugForm onSave={addBug} onClose={() => setShowForm(false)} />}
        {editing && <BugForm initial={editing} onSave={d => updateBug(editing.id, d)} onClose={() => setEditing(null)} />}
      </div>
    </>
  )
}
