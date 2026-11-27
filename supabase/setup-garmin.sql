-- Tabelle für Garmin-Aktivitäten (Zusammenfassung + vereinfachte GPS-Route)
create table if not exists public.garmin_activities (
  user_id uuid not null references auth.users(id) on delete cascade,
  id bigint not null,
  start_time timestamptz,
  data jsonb not null,
  track jsonb,
  primary key (user_id, id)
);
alter table public.garmin_activities enable row level security;
create policy "garmin lesen" on public.garmin_activities for select to authenticated
  using ((select auth.uid()) = user_id);
grant select on public.garmin_activities to authenticated;
grant all on public.garmin_activities to service_role;
