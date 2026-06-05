import { supabase } from './supabase'

const TABLE = 'tasks'

function normalizePriority(priority) {
  const mapping = {
    'Thấp': 'low', 'Trung bình': 'medium', 'Cao': 'high', 'Khẩn cấp': 'urgent',
    'low': 'low', 'medium': 'medium', 'high': 'high', 'urgent': 'urgent',
  }
  return mapping[priority] || 'medium'
}

function normalizeStatus(status) {
  const mapping = {
    'Cần làm': 'todo', 'Đang làm': 'in_progress', 'Xong': 'done', 'Huỷ': 'cancelled',
    'todo': 'todo', 'in_progress': 'in_progress', 'done': 'done', 'cancelled': 'cancelled',
  }
  return mapping[status] || 'todo'
}

export const taskService = {
  async getAll(userId) {
    const { data, error } = await supabase
      .from(TABLE).select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async create(task) {
    const normalizedTask = {
      ...task,
      priority: normalizePriority(task.priority),
      status: normalizeStatus(task.status),
    }
    const { data, error } = await supabase
      .from(TABLE).insert(normalizedTask).select().single()
    if (error) throw error
    return data
  },

  async update(id, updates) {
    const normalizedUpdates = {
      ...updates,
      ...(updates.priority ? { priority: normalizePriority(updates.priority) } : {}),
      ...(updates.status ? { status: normalizeStatus(updates.status) } : {}),
    }
    const { data, error } = await supabase
      .from(TABLE).update(normalizedUpdates).eq('id', id).select().single()
    if (error) throw error
    return data
  },

  async remove(id) {
    const { error } = await supabase.from(TABLE).delete().eq('id', id)
    if (error) throw error
  },

  async deleteAll(userId) {
    const { error } = await supabase.from(TABLE).delete().eq('user_id', userId)
    if (error) throw error
  },

  // Tích hoàn thành task hàng ngày — lưu ngày hôm nay
  async completeDailyTask(id) {
    const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
    const { data, error } = await supabase
      .from(TABLE).update({ last_completed_date: today }).eq('id', id).select().single()
    if (error) throw error
    return data
  },

  // Bỏ tích task hàng ngày
  async uncompleteDailyTask(id) {
    const { data, error } = await supabase
      .from(TABLE).update({ last_completed_date: null }).eq('id', id).select().single()
    if (error) throw error
    return data
  },
}