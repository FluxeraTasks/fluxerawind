-- Create profiles table
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade primary key,
    name text,
    email text unique,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Create workspaces table
create table if not exists public.workspaces (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    owner_id uuid references public.profiles(id) on delete cascade not null,
    image_url text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Create workspace_members table for managing workspace memberships
create table if not exists public.workspace_members (
    id uuid default uuid_generate_v4() primary key,
    workspace_id uuid references public.workspaces(id) on delete cascade not null,
    user_id uuid references public.profiles(id) on delete cascade not null,
    created_at timestamptz default now(),
    unique(workspace_id, user_id)
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;

-- Create policies
create policy "Users can view their own profile"
    on public.profiles for select
    using (auth.uid() = id);

create policy "Users can update their own profile"
    on public.profiles for update
    using (auth.uid() = id);

create policy "Users can view workspaces they own or are members of"
    on public.workspaces for select
    using (
        owner_id = auth.uid() or
        exists (
            select 1 from public.workspace_members
            where workspace_id = id and user_id = auth.uid()
        )
    );

create policy "Users can create workspaces"
    on public.workspaces for insert
    with check (owner_id = auth.uid());

create policy "Owners can update their workspaces"
    on public.workspaces for update
    using (owner_id = auth.uid());

create policy "Owners can delete their workspaces"
    on public.workspaces for delete
    using (owner_id = auth.uid());

create policy "Users can view their workspace memberships"
    on public.workspace_members for select
    using (user_id = auth.uid());

create policy "Workspace owners can manage memberships"
    on public.workspace_members for all
    using (
        exists (
            select 1 from public.workspaces
            where id = workspace_id and owner_id = auth.uid()
        )
    );

-- Create functions
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
    insert into public.profiles (id, email, name)
    values (new.id, new.email, split_part(new.email, '@', 1));
    return new;
end;
$$;

-- Create trigger for new user
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();
