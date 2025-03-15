-- Drop existing policies to recreate them
drop policy if exists "Usuários podem ver seu próprio perfil" on profiles;
drop policy if exists "Usuários podem atualizar seu próprio perfil" on profiles;

-- Create comprehensive policies for profiles
create policy "Usuários podem ver seu próprio perfil"
    on profiles for select
    using (auth.uid() = id);

create policy "Usuários podem inserir seu próprio perfil"
    on profiles for insert
    with check (auth.uid() = id);

create policy "Usuários podem atualizar seu próprio perfil"
    on profiles for update
    using (auth.uid() = id);

-- Enable RLS if not already enabled
alter table profiles enable row level security;

-- Grant necessary permissions
grant usage on schema public to anon, authenticated;
grant all on profiles to anon, authenticated;

-- Create trigger for updating timestamps
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

-- Create or replace the trigger
drop trigger if exists set_updated_at on profiles;
create trigger set_updated_at
    before update on profiles
    for each row
    execute function handle_updated_at();
