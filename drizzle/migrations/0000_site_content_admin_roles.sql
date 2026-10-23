-- Editable site content, one row per section
create table public.site_content (
  section text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

-- Roles live in their own table, never on profiles
create type public.app_role as enum ('admin');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

alter table public.user_roles enable row level security;

create policy "Users can read their own roles"
  on public.user_roles for select
  to authenticated
  using (user_id = auth.uid());

-- Security definer so RLS checks never recurse
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

-- The first account created becomes the site admin (the owner)
create or replace function public.assign_admin_to_first_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  end if;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.assign_admin_to_first_user();

-- Content grants and policies: everyone reads, only admins write
grant select on public.site_content to anon, authenticated;
grant insert, update, delete on public.site_content to authenticated;
grant all on public.site_content to service_role;

alter table public.site_content enable row level security;

create policy "Anyone can read site content"
  on public.site_content for select
  to anon, authenticated
  using (true);

create policy "Admins can insert site content"
  on public.site_content for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update site content"
  on public.site_content for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete site content"
  on public.site_content for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- Seed the current content
insert into public.site_content (section, data) values
(
  'profile',
  '{"name":"Alaran Mashkur","title":"Mechatronics Engineer","location":"Lagos, Nigeria","email":"mashkur.m2300593@st.futminna.edu.ng","tagline":"I design machines that sense, think and move — blending mechanics, electronics and code.","skills":["Robotics","Embedded C/C++","ROS 2","Control Systems","SolidWorks","PCB Design","Python","Computer Vision"]}'::jsonb
),
(
  'projects',
  '[{"title":"6-DOF Robotic Arm","summary":"Low-cost manipulator with inverse kinematics and a custom servo controller board.","tags":["ROS 2","Kinematics","PCB"],"year":"2026"},{"title":"Line-Following AGV","summary":"Autonomous guided vehicle with PID control for small warehouse logistics.","tags":["PID","STM32","Sensors"],"year":"2025"},{"title":"Smart Irrigation Controller","summary":"Soil-moisture driven IoT system that cut water use in field tests.","tags":["IoT","ESP32","Solar"],"year":"2025"},{"title":"Vision Sorting Conveyor","summary":"Camera-based object sorting using OpenCV and pneumatic actuators.","tags":["OpenCV","Pneumatics","Python"],"year":"2024"},{"title":"Self-Balancing Robot","summary":"Two-wheeled inverted pendulum stabilised with sensor fusion and LQR.","tags":["LQR","IMU","Arduino"],"year":"2024"},{"title":"Prosthetic Hand Prototype","summary":"3D-printed hand driven by EMG signals for grip control.","tags":["EMG","3D Printing","Biomech"],"year":"2023"}]'::jsonb
),
(
  'research',
  '[{"title":"Adaptive PID Tuning for Low-Cost Mobile Robots in Unstructured Terrain","venue":"Final Year Thesis","year":"2026","abstract":"A comparison of fuzzy and gain-scheduled PID approaches for affordable differential-drive robots."},{"title":"Energy-Efficient Actuation for Solar-Powered Agricultural Robots","venue":"Conference Paper (draft)","year":"2025","abstract":"Analysis of motor selection and duty cycling to extend field operation time."},{"title":"EMG Signal Classification for Low-Cost Prosthetics","venue":"Research Project","year":"2024","abstract":"Lightweight feature extraction enabling real-time grip classification on microcontrollers."}]'::jsonb
),
(
  'certifications',
  '[{"title":"Certified SOLIDWORKS Associate (CSWA)","issuer":"Dassault Systèmes","year":"2025"},{"title":"ROS 2 Developer Certificate","issuer":"The Construct","year":"2025"},{"title":"Fundamentals of Digital Manufacturing, Design and Sustainability","issuer":"Autodesk · Coursera","year":"2024"},{"title":"PLC Programming — From Novice to Professional","issuer":"Udemy","year":"2024"},{"title":"Python for Everybody Specialization","issuer":"University of Michigan · Coursera","year":"2023"}]'::jsonb
);

-- Public read for uploaded photos, admin-only upload/delete
create policy "Anyone can view media"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'media');

create policy "Admins can upload media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media' and public.has_role(auth.uid(), 'admin'));

create policy "Admins can update media"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media' and public.has_role(auth.uid(), 'admin'))
  with check (bucket_id = 'media' and public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media' and public.has_role(auth.uid(), 'admin'));
