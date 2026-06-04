import { supabase } from './supabase'

const TABLE = 'bugs'

export const bugService = {
  async getAll(userId) {
    const { data, error } = await supabase
      .from(TABLE).select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async create(bug) {
    const { data, error } = await supabase.from(TABLE).insert(bug).select().single()
    if (error) throw error
    return data
  },

  async update(id, updates) {
    const { data, error } = await supabase.from(TABLE).update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  },

  async remove(id) {
    const { error } = await supabase.from(TABLE).delete().eq('id', id)
    if (error) throw error
  },

  // Thêm phương thức xóa toàn bộ bug của user
  async deleteAll(userId) {
    const { error } = await supabase.from(TABLE).delete().eq('user_id', userId)
    if (error) throw error
  }
}

/*
SQL để tạo bảng bugs trong Supabase (bổ sung cột environment, steps_to_reproduce, solution...):

create table bugs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  description text,
  status text default 'open' check (status in ('open','in_progress','resolved','closed','wont_fix')),
  severity text default 'medium' check (severity in ('low','medium','high','critical')),
  environment text,
  steps_to_reproduce text,
  solution text,
  note text,
  tags text[],
  found_at timestamptz default now(),
  resolved_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table bugs enable row level security;
create policy "user own bugs" on bugs for all using (auth.uid() = user_id);
*/