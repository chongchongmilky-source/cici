export const taskSchema = () => ({
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  due_date: '',
  note: '',
  tags: [],
  time_spent: 0,
})

export const bugSchema = () => ({
  title: '',
  description: '',
  status: 'open',
  severity: 'medium',
  environment: '',
  steps_to_reproduce: '',
  solution: '',
  note: '',
  tags: [],
  found_at: new Date().toISOString(),
  resolved_at: null,
})

export const subjectSchema = () => ({
  name: '',
  description: '',
  color: '#5b73ff',
  icon: '📚',
  note: '',
})

export const lessonSchema = (subjectId) => ({
  subject_id: subjectId,
  title: '',
  content: '',
  summary: '',
  note: '',
  status: 'not_started',
  order_index: 0,
})
