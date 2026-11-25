-- Tabelle für Push-Abos (ein Eintrag pro Gerät)
create table if not exists public.push_subs (
  endpoint text primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  sub jsonb not null,
  created_at timestamptz not null default now()
);
alter table public.push_subs enable row level security;
create policy "subs lesen" on public.push_subs for select to authenticated using ((select auth.uid()) = user_id);
create policy "subs anlegen" on public.push_subs for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "subs ändern" on public.push_subs for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "subs löschen" on public.push_subs for delete to authenticated using ((select auth.uid()) = user_id);

-- Rechte für die App (angemeldete Nutzer) und die Edge Function
grant select, insert, update, delete on public.push_subs to authenticated;
grant select, insert, update, delete on public.gymlog_state to authenticated;
grant all on public.push_subs, public.gymlog_state to service_role;

-- Aufruf jede Minute (die Funktion entscheidet selbst, welche Erinnerungen fällig sind)
create extension if not exists pg_cron;
create extension if not exists pg_net;
select cron.schedule('wasser-erinnerung', '* * * * *', $$
  select net.http_post(
    url := 'https://vnshuumevvdcyukwswgd.supabase.co/functions/v1/water-reminder',
    headers := '{"Content-Type":"application/json","x-cron-secret":"CRON_SECRET_HIER_EINSETZEN"}'::jsonb,
    body := '{}'::jsonb
  );
$$);
