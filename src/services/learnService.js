import { supabase } from './supabase'

export const learnService = {
  // ── Subjects ──────────────────────────────────────
  async getSubjects(userId) {
    const { data, error } = await supabase
      .from('subjects').select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
    if (error) throw error
    return data
  },

  async createSubject(subject) {
    const { data, error } = await supabase.from('subjects').insert(subject).select().single()
    if (error) throw error
    return data
  },

  async updateSubject(id, updates) {
    const { data, error } = await supabase.from('subjects').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  },

  async removeSubject(id) {
    const { error } = await supabase.from('subjects').delete().eq('id', id)
    if (error) throw error
  },

  // ── Lessons ───────────────────────────────────────
  async getLessons(subjectId) {
    const { data, error } = await supabase
      .from('lessons').select('*')
      .eq('subject_id', subjectId)
      .order('order_index', { ascending: true })
    if (error) throw error
    return data
  },

  async createLesson(lesson) {
    const { data, error } = await supabase.from('lessons').insert(lesson).select().single()
    if (error) throw error
    return data
  },

  async updateLesson(id, updates) {
    const { data, error } = await supabase.from('lessons').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single()
    if (error) throw error
    return data
  },

  async removeLesson(id) {
    const { error } = await supabase.from('lessons').delete().eq('id', id)
    if (error) throw error
  },

  // ── Review sessions ──────────────────────────────
  async logReview(lessonId, quality) {
    const now = new Date().toISOString()
    // Simple SM-2 spaced repetition
    const { data: lesson } = await supabase.from('lessons').select('*').eq('id', lessonId).single()
    const { repetitions = 0, ease_factor = 2.5, interval = 1 } = lesson

    let newEF = ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    if (newEF < 1.3) newEF = 1.3
    let newRep = quality < 3 ? 0 : repetitions + 1
    let newInterval = newRep <= 1 ? 1 : newRep === 2 ? 6 : Math.round(interval * newEF)
    const nextDate = new Date()
    nextDate.setDate(nextDate.getDate() + newInterval)

    const { data, error } = await supabase.from('lessons').update({
      repetitions: newRep,
      ease_factor: newEF,
      interval: newInterval,
      next_review: nextDate.toISOString().split('T')[0],
      last_reviewed: now,
      review_count: (lesson.review_count || 0) + 1,
      updated_at: now,
    }).eq('id', lessonId).select().single()
    if (error) throw error
    return data
  }
}

/*
SQL để tạo bảng subjects và lessons trong Supabase:

create table subjects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  description text,
  color text default '#5b73ff',
  icon text default '📚',
  note text,
  created_at timestamptz default now()
);

create table lessons (
  id uuid default gen_random_uuid() primary key,
  subject_id uuid references subjects on delete cascade not null,
  user_id uuid references auth.users not null,
  title text not null,
  content text,
  summary text,
  note text,
  order_index integer default 0,
  status text default 'not_started' check (status in ('not_started','learning','mastered')),
  -- Spaced repetition fields
  repetitions integer default 0,
  ease_factor numeric default 2.5,
  interval integer default 1,
  next_review date default current_date,
  last_reviewed timestamptz,
  review_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table subjects enable row level security;
create policy "user own subjects" on subjects for all using (auth.uid() = user_id);

alter table lessons enable row level security;
create policy "user own lessons" on lessons for all using (auth.uid() = user_id);
*/
