import { useState, useEffect, useCallback } from 'react'
import { learnService } from '../services/learnService'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

export function useLearn() {
  const { user } = useAuth()
  const [subjects, setSubjects] = useState([])
  const [lessons, setLessons] = useState({}) // keyed by subjectId
  const [loading, setLoading] = useState(true)
  const [activeSubject, setActiveSubject] = useState(null)

  const loadSubjects = useCallback(async () => {
    if (!user) return
    try {
      setLoading(true)
      const data = await learnService.getSubjects(user.id)
      setSubjects(data)
      if (data.length > 0 && !activeSubject) setActiveSubject(data[0])
    } catch (e) {
      toast.error('Lỗi tải môn học: ' + e.message)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => { loadSubjects() }, [loadSubjects])

  const loadLessons = async (subjectId) => {
    try {
      const data = await learnService.getLessons(subjectId)
      setLessons(prev => ({ ...prev, [subjectId]: data }))
      return data
    } catch (e) {
      toast.error('Lỗi tải bài học: ' + e.message)
    }
  }

  const addSubject = async (subject) => {
    const data = await learnService.createSubject({ ...subject, user_id: user.id })
    setSubjects(prev => [...prev, data])
    setActiveSubject(data)
    toast.success('Đã thêm môn học')
    return data
  }

  const updateSubject = async (id, updates) => {
    const data = await learnService.updateSubject(id, updates)
    setSubjects(prev => prev.map(s => s.id === id ? data : s))
    if (activeSubject?.id === id) setActiveSubject(data)
    toast.success('Đã cập nhật')
    return data
  }

  const removeSubject = async (id) => {
    await learnService.removeSubject(id)
    setSubjects(prev => prev.filter(s => s.id !== id))
    if (activeSubject?.id === id) setActiveSubject(subjects.find(s => s.id !== id) || null)
    toast.success('Đã xoá môn học')
  }

  const addLesson = async (lesson) => {
    const data = await learnService.createLesson({ ...lesson, user_id: user.id })
    setLessons(prev => ({ ...prev, [lesson.subject_id]: [...(prev[lesson.subject_id] || []), data] }))
    toast.success('Đã thêm bài học')
    return data
  }

  const updateLesson = async (id, subjectId, updates) => {
    const data = await learnService.updateLesson(id, updates)
    setLessons(prev => ({
      ...prev,
      [subjectId]: (prev[subjectId] || []).map(l => l.id === id ? data : l)
    }))
    toast.success('Đã cập nhật bài học')
    return data
  }

  const removeLesson = async (id, subjectId) => {
    await learnService.removeLesson(id)
    setLessons(prev => ({
      ...prev,
      [subjectId]: (prev[subjectId] || []).filter(l => l.id !== id)
    }))
    toast.success('Đã xoá bài học')
  }

  const reviewLesson = async (id, subjectId, quality) => {
    const data = await learnService.logReview(id, quality)
    setLessons(prev => ({
      ...prev,
      [subjectId]: (prev[subjectId] || []).map(l => l.id === id ? data : l)
    }))
    return data
  }

  return {
    subjects, lessons, loading, activeSubject, setActiveSubject,
    loadLessons, addSubject, updateSubject, removeSubject,
    addLesson, updateLesson, removeLesson, reviewLesson
  }
}
