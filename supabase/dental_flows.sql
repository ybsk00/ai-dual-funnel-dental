-- Dental Flows Table
-- Stores results from AI Healthcare tests (Smile, Breath, Teeth Age, etc.)

create table if not exists public.dental_flows (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete set null, -- Nullable for anonymous users
  flow_type text not null, -- 'smile_test', 'breath_mbti', 'teeth_age', 'stain_risk', 'kids_mission'
  answers_json jsonb, -- Raw answers from the user
  result_json jsonb, -- Final result + CTA data
  created_at timestamptz default now()
);

-- RLS Policies
alter table public.dental_flows enable row level security;

-- Users can view their own flows
create policy "Users can view own dental flows" 
  on public.dental_flows for select 
  using (auth.uid() = user_id);

-- Anonymous users can insert (for the session) - practically, we might need to allow public insert 
-- or rely on server-side service role for insertion to avoid abuse.
-- For MVP, we'll allow authenticated users to insert, and for anonymous, 
-- the API (server-side) will handle the insertion using service role, so no specific RLS needed for anon insert if API handles it.
-- But if we want client-side insert (unlikely for this architecture), we'd need more.
-- We will stick to Server-Side insertion via API.

-- Policy for updating: Users can update their own flows (e.g. linking after login)
create policy "Users can update own dental flows" 
  on public.dental_flows for update 
  using (auth.uid() = user_id);
