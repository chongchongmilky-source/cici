export const TASK_STATUS = {
  todo: { label: 'Cần làm', color: '#8b91a8' },
  in_progress: { label: 'Đang làm', color: '#5b73ff' },
  done: { label: 'Xong', color: '#43d9ad' },
  cancelled: { label: 'Huỷ', color: '#555d7a' },
}

export const TASK_PRIORITY = {
  low: { label: 'Thấp', color: '#43d9ad' },
  medium: { label: 'Bình thường', color: '#f5a623' },
  high: { label: 'Cao', color: '#ff6b6b' },
  urgent: { label: 'Khẩn cấp', color: '#ff3333' },
}

export const BUG_STATUS = {
  open: { label: 'Mở', color: '#ff6b6b' },
  in_progress: { label: 'Đang xử lý', color: '#5b73ff' },
  resolved: { label: 'Đã giải quyết', color: '#43d9ad' },
  closed: { label: 'Đóng', color: '#555d7a' },
  wont_fix: { label: 'Không sửa', color: '#8b91a8' },
}

export const BUG_SEVERITY = {
  low: { label: 'Thấp', color: '#43d9ad' },
  medium: { label: 'Vừa', color: '#f5a623' },
  high: { label: 'Cao', color: '#ff6b6b' },
  critical: { label: 'Nghiêm trọng', color: '#ff0000' },
}

export const LESSON_STATUS = {
  not_started: { label: 'Chưa học', color: '#555d7a' },
  learning: { label: 'Đang học', color: '#5b73ff' },
  mastered: { label: 'Nắm rõ', color: '#43d9ad' },
}

export const REVIEW_QUALITY = [
  { value: 0, label: 'Không nhớ gì', color: '#ff3333' },
  { value: 1, label: 'Quá khó', color: '#ff6b6b' },
  { value: 2, label: 'Khó', color: '#f5a623' },
  { value: 3, label: 'Được', color: '#5b73ff' },
  { value: 4, label: 'Tốt', color: '#43d9ad' },
  { value: 5, label: 'Rất tốt', color: '#00ff88' },
]
