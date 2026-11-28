-- Pausen-Timer: ein laufender Timer pro Nutzer
create table if not exists public.rest_timers (
  user_id uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  end_at timestamptz not null,
  label text,
  sent boolean not null default false
);
alter table public.rest_timers enable row level security;
create policy "timer lesen" on public.rest_timers for select to authenticated using ((select auth.uid()) = user_id);
create policy "timer anlegen" on public.rest_timers for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "timer ändern" on public.rest_timers for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "timer löschen" on public.rest_timers for delete to authenticated using ((select auth.uid()) = user_id);
grant select, insert, update, delete on public.rest_timers to authenticated;
grant all on public.rest_timers to service_role;

-- Alle 10 Sekunden prüfen – die Funktion wird nur aufgerufen, wenn wirklich ein Timer gleich endet
select cron.schedule('pausen-timer', '10 seconds', $$
  select net.http_post(
    url := 'https://vnshuumevvdcyukwswgd.supabase.co/functions/v1/water-reminder?rest=1',
    headers := '{"Content-Type":"application/json","x-cron-secret":"CRON_SECRET_HIER_EINSETZEN"}'::jsonb,
    body := '{}'::jsonb)
  where exists (select 1 from public.rest_timers where not sent and end_at <= now() + interval '10 seconds');
$$);
