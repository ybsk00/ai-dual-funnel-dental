-- Add user_id to patients table
alter table public.patients add column if not exists user_id uuid references auth.users(id) on delete set null;

-- Add unique constraint to ensure one patient record per user (optional but recommended)
alter table public.patients add constraint patients_user_id_key unique (user_id);

-- Update RLS policies for patients
-- Allow users to view their own patient record
create policy "Users can view own patient record" on public.patients for select using (auth.uid() = user_id);

-- Allow users to update their own patient record
create policy "Users can update own patient record" on public.patients for update using (auth.uid() = user_id);

-- Allow users to insert their own patient record
create policy "Users can insert own patient record" on public.patients for insert with check (auth.uid() = user_id);
