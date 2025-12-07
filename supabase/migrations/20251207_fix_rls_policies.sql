-- Fix RLS Policies for Reservation System

-- 1. Patients Table
-- Allow public to check if patient exists (needed for reservation form)
create policy "Allow public read access" on public.patients for select using (true);

-- Allow public to register as new patient
create policy "Allow public insert access" on public.patients for insert with check (true);

-- 2. Visits Table
-- Allow public to book appointments
create policy "Allow public insert access" on public.visits for insert with check (true);

-- Allow staff/admin to view all visits
create policy "Allow staff view access" on public.visits for select using (auth.role() = 'authenticated');

-- Allow staff/admin to update visits (e.g., complete/cancel)
create policy "Allow staff update access" on public.visits for update using (auth.role() = 'authenticated');
