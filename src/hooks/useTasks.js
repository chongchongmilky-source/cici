import { useState, useEffect, useCallback } from 'react'
import { taskService } from '../services/taskService'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

export function useTasks() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!user) return
    try {
      setLoading(true)
      const data = await taskService.getAll(user.id)
      setTasks(data)
    } catch (e) {
      toast.error('Lỗi tải công việc: ' + e.message)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => { load() }, [load])

  const addTask = async (task) => {
    const data = await taskService.create({ ...task, user_id: user.id })
    setTasks(prev => [data, ...prev])
    toast.success('Đã thêm công việc')
    return data
  }

  const updateTask = async (id, updates) => {
    const data = await taskService.update(id, { ...updates, updated_at: new Date().toISOString() })
    setTasks(prev => prev.map(t => t.id === id ? data : t))
    toast.success('Đã cập nhật')
    return data
  }

  const removeTask = async (id) => {
    await taskService.remove(id)
    setTasks(prev => prev.filter(t => t.id !== id))
    toast.success('Đã xoá công việc')
  }

  return { tasks, loading, reload: load, addTask, updateTask, removeTask }
  // ... trong return object, thêm:
const resetTasks = async () => {
  if (!user) return;
  await taskService.deleteAll(user.id);
  setTasks([]);
  toast.success('Đã xoá toàn bộ công việc');
};

return { tasks, loading, reload: load, addTask, updateTask, removeTask, resetTasks };
}
