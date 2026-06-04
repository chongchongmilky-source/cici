import { useState, useEffect, useCallback } from 'react'
import { bugService } from '../services/bugService'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

export function useBugs() {
  const { user } = useAuth()
  const [bugs, setBugs] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!user) return
    try {
      setLoading(true)
      const data = await bugService.getAll(user.id)
      setBugs(data)
    } catch (e) {
      toast.error('Lỗi tải bugs: ' + e.message)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => { load() }, [load])

  const addBug = async (bug) => {
    const data = await bugService.create({ ...bug, user_id: user.id })
    setBugs(prev => [data, ...prev])
    toast.success('Đã thêm bug')
    return data
  }

  const updateBug = async (id, updates) => {
    const resolved = updates.status === 'resolved' && !updates.resolved_at
      ? { resolved_at: new Date().toISOString() } : {}
    const data = await bugService.update(id, { ...updates, ...resolved, updated_at: new Date().toISOString() })
    setBugs(prev => prev.map(b => b.id === id ? data : b))
    toast.success('Đã cập nhật')
    return data
  }

  const removeBug = async (id) => {
    await bugService.remove(id)
    setBugs(prev => prev.filter(b => b.id !== id))
    toast.success('Đã xoá bug')
  }

  return { bugs, loading, reload: load, addBug, updateBug, removeBug }
}
