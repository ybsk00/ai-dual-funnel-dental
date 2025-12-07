create table if not exists public.dental_flows (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  flow_type text not null,
  answers_json jsonb,
  result_json jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table public.dental_flows enable row level security;

create policy "Users can view their own flows"
  on public.dental_flows for select
  using ((select auth.uid()) = user_id);

create policy "Anyone can insert flows"
  on public.dental_flows for insert
  with check (true);
