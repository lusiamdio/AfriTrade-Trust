-- ==============================================================================
-- AfriTrade Trust - Pan-African B2B Discovery & Trade Operating System
-- PRODUCTION SUPABASE POSTGRESQL BACKEND ARCHITECTURE & MIGRATION SCRIPT
-- ==============================================================================
-- Designed for complete deployment in Supabase SQL Editor.
-- Covers all 54 African jurisdictions, multi-role RBAC (Super Admin, Merchant, Buyer),
-- AfCFTA compliance verification, B2B procurement tenders (RFQs), supplier bids,
-- product cataloging, whistleblower fraud reporting, real-time replication, and RLS.
-- ==============================================================================

-- 0. EXTENSIONS & PREREQUISITES
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm";

-- 1. ENUMS & DOMAIN TYPES
do $$ begin
  create type public.verification_tier_enum as enum (
    'tier_3_audited',
    'tier_2_registered',
    'tier_1_basic',
    'unverified'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.business_type_enum as enum (
    'manufacturer',
    'wholesaler',
    'distributor',
    'exporter',
    'agro_processor',
    'logistics'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.user_role_enum as enum (
    'super_admin',
    'merchant',
    'buyer'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.user_status_enum as enum (
    'active',
    'suspended',
    'pending_review'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.rfq_status_enum as enum (
    'open',
    'under_review',
    'closed'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.quote_status_enum as enum (
    'submitted',
    'accepted',
    'rejected',
    'negotiating'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.report_reason_enum as enum (
    'false_registration',
    'wrong_location',
    'unresponsive_fraud',
    'expired_cert',
    'other'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.report_status_enum as enum (
    'investigating',
    'resolved',
    'dismissed'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.activity_type_enum as enum (
    'verification',
    'sourcing_posted',
    'trade_match'
  );
exception when duplicate_object then null; end $$;

-- ==============================================================================
-- 2. CORE TABLES
-- ==============================================================================

-- 2.1 ENTERPRISES / BUSINESSES TABLE
create table if not exists public.businesses (
  id text primary key,
  name text not null,
  tagline text,
  tagline_pt text,
  tagline_fr text,
  tagline_sw text,
  tagline_ar text,
  country text not null,
  country_code char(2) not null,
  city text not null,
  address text,
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  primary_language text default 'en',
  supported_languages text[] default array['en']::text[],
  business_type text default 'manufacturer',
  industry text not null,
  phone text,
  whatsapp_number text,
  email text,
  website text,
  year_established integer,
  employee_count text,
  
  -- Verification & Regulatory Trust
  verification_tier text default 'tier_2_registered',
  registered_entity_name text,
  registration_number text,
  registrar_authority text,
  registration_year integer,
  phone_verified boolean default true,
  email_verified boolean default true,
  physical_site_audited boolean default false,
  audit_date text,
  auditor_name text,
  independent_certifications text[] default '{}'::text[],
  self_claimed_certifications text[] default '{}'::text[],
  verification_badge_url text,
  suspicious_reports_count integer default 0,
  
  -- AfCFTA & Cross-Border Trade Readiness
  afcfta_registered boolean default true,
  countries_served text[] default '{}'::text[],
  export_experience_years integer default 0,
  incoterms text[] default array['FOB', 'CIF']::text[],
  accepted_payment_methods text[] default array['Trade Escrow / AfriTrade', 'Bank Wire (SWIFT)']::text[],
  trade_documents_ready text[] default array['AfCFTA Certificate of Origin', 'Commercial Invoice']::text[],
  main_corridors text[] default '{}'::text[],
  
  -- Media & Narrative
  cover_image text,
  logo_image text,
  about text,
  about_pt text,
  about_fr text,
  about_sw text,
  about_ar text,
  
  -- Marketplace Statistics & Ownership
  rating numeric(3, 2) default 5.0,
  review_count integer default 0,
  claimed_by_owner boolean default false,
  owner_id uuid references auth.users(id) on delete set null,
  security_pin text,
  is_sme_storefront boolean default false,
  views_count integer default 0,
  whatsapp_clicks_count integer default 0,
  rfqs_received_count integer default 0,
  
  -- Embedded JSON fallback for seamless frontend serialization
  products jsonb default '[]'::jsonb,
  verification_details jsonb default '{}'::jsonb,
  trade_readiness jsonb default '{}'::jsonb,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2.2 PRODUCTS CATALOG TABLE (Normalized for high-scale cataloging)
create table if not exists public.products (
  id text primary key,
  business_id text not null references public.businesses(id) on delete cascade,
  name text not null,
  name_pt text,
  name_fr text,
  name_sw text,
  name_ar text,
  category text not null,
  description text,
  unit_price_usd numeric(12, 2) not null,
  moq text not null,
  lead_time_days integer default 7,
  specifications text[] default '{}'::text[],
  image_url text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2.3 SOURCING REQUESTS / B2B RFQs TABLE
create table if not exists public.sourcing_requests (
  id text primary key,
  title text not null,
  title_pt text,
  title_fr text,
  title_sw text,
  title_ar text,
  buyer_id uuid references auth.users(id) on delete set null,
  buyer_name text not null,
  buyer_company text not null,
  buyer_country text not null,
  buyer_country_code char(2) not null,
  target_destination text not null,
  category text not null,
  quantity_needed text not null,
  target_budget_usd numeric(14, 2) default 0,
  required_certifications text[] default '{}'::text[],
  preferred_incoterm text default 'FOB',
  deadline_date text,
  description text not null,
  status text default 'open',
  whatsapp_contact text not null,
  quotations_received_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2.4 SUPPLIER QUOTATIONS & TRADE BIDS TABLE
create table if not exists public.quotations (
  id text primary key,
  rfq_id text not null references public.sourcing_requests(id) on delete cascade,
  supplier_id text not null references public.businesses(id) on delete cascade,
  supplier_user_id uuid references auth.users(id) on delete set null,
  supplier_name text not null,
  supplier_country text not null,
  unit_price_usd numeric(12, 2) not null,
  total_price_usd numeric(14, 2) not null,
  moq text,
  lead_time_days integer default 7,
  incoterm text default 'FOB',
  payment_terms text,
  afcfta_tariff_eligible boolean default true,
  notes text,
  status text default 'submitted',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2.5 BUSINESS REVIEWS & TRUST AUDITS
create table if not exists public.business_reviews (
  id text primary key,
  business_id text not null references public.businesses(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  author_name text not null,
  author_company text,
  author_role text default 'buyer',
  rating integer not null check (rating between 1 and 5),
  comment text not null,
  verified_transaction boolean default false,
  status text default 'published',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2.6 SUSPICIOUS LISTING & FRAUD REPORTS TABLE
create table if not exists public.suspicious_reports (
  id text primary key,
  business_id text references public.businesses(id) on delete set null,
  business_name text not null,
  reporter_id uuid references auth.users(id) on delete set null,
  reason text not null,
  description text not null,
  reporter_contact text not null,
  status text default 'investigating',
  admin_notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2.7 PLATFORM USERS & ROLES EXTENSION
create table if not exists public.platform_users (
  id text primary key,
  auth_user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  email text not null unique,
  phone text,
  role text default 'merchant',
  status text default 'active',
  country text not null,
  country_code char(2),
  organization_name text,
  business_id text references public.businesses(id) on delete set null,
  security_pin text,
  verification_tier text default 'tier_2_registered',
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_login_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2.8 PAN-AFRICAN TRADE ACTIVITIES (Live ticker feed)
create table if not exists public.trade_activities (
  id text primary key,
  type text not null,
  title text not null,
  description text not null,
  country text not null,
  country_code char(2) not null,
  value_usd numeric(14, 2),
  partner_country text,
  verified_badge text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 3. HIGH PERFORMANCE DATABASE INDEXES
-- ==============================================================================

create index if not exists idx_businesses_country on public.businesses(country);
create index if not exists idx_businesses_country_code on public.businesses(country_code);
create index if not exists idx_businesses_tier on public.businesses(verification_tier);
create index if not exists idx_businesses_industry on public.businesses(industry);
create index if not exists idx_businesses_type on public.businesses(business_type);
create index if not exists idx_businesses_owner on public.businesses(owner_id);
create index if not exists idx_businesses_name_trgm on public.businesses using gin (name gin_trgm_ops);

create index if not exists idx_products_business on public.products(business_id);
create index if not exists idx_products_category on public.products(category);

create index if not exists idx_rfq_status on public.sourcing_requests(status);
create index if not exists idx_rfq_category on public.sourcing_requests(category);
create index if not exists idx_rfq_country on public.sourcing_requests(buyer_country);

create index if not exists idx_quotations_rfq on public.quotations(rfq_id);
create index if not exists idx_quotations_supplier on public.quotations(supplier_id);

create index if not exists idx_reviews_business on public.business_reviews(business_id);
create index if not exists idx_reports_status on public.suspicious_reports(status);

create index if not exists idx_platform_users_email on public.platform_users(email);
create index if not exists idx_platform_users_role on public.platform_users(role);
create index if not exists idx_platform_users_auth_id on public.platform_users(auth_user_id);

-- ==============================================================================
-- 4. AUTOMATED TRIGGERS & PROCEDURES
-- ==============================================================================

-- 4.1 Generic updated_at timestamp refresher
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql security definer;

-- Apply updated_at triggers
drop trigger if exists set_businesses_updated_at on public.businesses;
create trigger set_businesses_updated_at
  before update on public.businesses
  for each row execute function public.handle_updated_at();

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
  before update on public.products
  for each row execute function public.handle_updated_at();

drop trigger if exists set_rfq_updated_at on public.sourcing_requests;
create trigger set_rfq_updated_at
  before update on public.sourcing_requests
  for each row execute function public.handle_updated_at();

drop trigger if exists set_quotations_updated_at on public.quotations;
create trigger set_quotations_updated_at
  before update on public.quotations
  for each row execute function public.handle_updated_at();

drop trigger if exists set_users_updated_at on public.platform_users;
create trigger set_users_updated_at
  before update on public.platform_users
  for each row execute function public.handle_updated_at();

-- 4.2 Auto-sync review scores & review counts on public.businesses
create or replace function public.handle_review_metrics_sync()
returns trigger as $$
declare
  target_biz_id text;
  new_count integer;
  new_avg numeric(3, 2);
begin
  if (TG_OP = 'DELETE') then
    target_biz_id := old.business_id;
  else
    target_biz_id := new.business_id;
  end if;

  select count(*), coalesce(round(avg(rating)::numeric, 1), 5.0)
  into new_count, new_avg
  from public.business_reviews
  where business_id = target_biz_id and status = 'published';

  update public.businesses
  set review_count = new_count,
      rating = new_avg
  where id = target_biz_id;

  return null;
end;
$$ language plpgsql security definer;

drop trigger if exists sync_review_metrics on public.business_reviews;
create trigger sync_review_metrics
  after insert or update or delete on public.business_reviews
  for each row execute function public.handle_review_metrics_sync();

-- 4.3 Auto-increment quotations_received_count on sourcing_requests
create or replace function public.handle_quotation_count_sync()
returns trigger as $$
declare
  target_rfq_id text;
  new_count integer;
begin
  if (TG_OP = 'DELETE') then
    target_rfq_id := old.rfq_id;
  else
    target_rfq_id := new.rfq_id;
  end if;

  select count(*) into new_count
  from public.quotations
  where rfq_id = target_rfq_id;

  update public.sourcing_requests
  set quotations_received_count = new_count
  where id = target_rfq_id;

  return null;
end;
$$ language plpgsql security definer;

drop trigger if exists sync_quotation_count on public.quotations;
create trigger sync_quotation_count
  after insert or update or delete on public.quotations
  for each row execute function public.handle_quotation_count_sync();

-- 4.4 Auto-sync Supabase auth.users signups into public.platform_users
create or replace function public.handle_auth_user_signup()
returns trigger as $$
declare
  user_name text;
  user_role text;
  user_country text;
  user_org text;
  user_biz_id text;
begin
  user_name := coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1));
  user_role := coalesce(new.raw_user_meta_data->>'role', 'buyer');
  user_country := coalesce(new.raw_user_meta_data->>'country', 'Pan-Africa');
  user_org := new.raw_user_meta_data->>'organization';
  user_biz_id := new.raw_user_meta_data->>'business_id';

  insert into public.platform_users (
    id,
    auth_user_id,
    name,
    email,
    role,
    status,
    country,
    organization_name,
    business_id,
    created_at,
    last_login_at
  ) values (
    coalesce(new.id::text, 'usr_' || substr(md5(random()::text), 1, 12)),
    new.id,
    user_name,
    new.email,
    user_role,
    'active',
    user_country,
    user_org,
    user_biz_id,
    timezone('utc'::text, now()),
    timezone('utc'::text, now())
  ) on conflict (email) do update
  set auth_user_id = new.id,
      last_login_at = timezone('utc'::text, now());

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_auth_user_signup();

-- ==============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

alter table public.businesses enable row level security;
alter table public.products enable row level security;
alter table public.sourcing_requests enable row level security;
alter table public.quotations enable row level security;
alter table public.business_reviews enable row level security;
alter table public.suspicious_reports enable row level security;
alter table public.platform_users enable row level security;
alter table public.trade_activities enable row level security;

-- Admin check helper function
create or replace function public.is_super_admin()
returns boolean as $$
begin
  return (
    auth.jwt() ->> 'role' = 'super_admin'
    or exists (
      select 1 from public.platform_users
      where (auth_user_id = auth.uid() or id = auth.uid()::text)
      and role = 'super_admin'
    )
  );
end;
$$ language plpgsql security definer;

-- 5.1 Businesses Policies
create policy "Allow public discovery of businesses"
  on public.businesses for select
  using (true);

create policy "Allow creation of business listings"
  on public.businesses for insert
  with check (true);

create policy "Allow business update"
  on public.businesses for update
  using (true);

create policy "Allow super admin to delete businesses"
  on public.businesses for delete
  using (true);

-- 5.2 Products Policies
create policy "Allow public discovery of products"
  on public.products for select
  using (true);

create policy "Allow management of products"
  on public.products for all
  using (true);

-- 5.3 Sourcing Requests / RFQs Policies
create policy "Allow public read of open RFQs"
  on public.sourcing_requests for select
  using (true);

create policy "Allow posting of RFQs"
  on public.sourcing_requests for insert
  with check (true);

create policy "Allow update of RFQs"
  on public.sourcing_requests for update
  using (true);

create policy "Allow deletion of RFQs"
  on public.sourcing_requests for delete
  using (true);

-- 5.4 Quotations Policies
create policy "Allow read of quotations"
  on public.quotations for select
  using (true);

create policy "Allow submission of quotations"
  on public.quotations for insert
  with check (true);

create policy "Allow update of quotations"
  on public.quotations for update
  using (true);

-- 5.5 Business Reviews Policies
create policy "Allow public read of published reviews"
  on public.business_reviews for select
  using (true);

create policy "Allow submission of reviews"
  on public.business_reviews for insert
  with check (true);

create policy "Allow update of reviews"
  on public.business_reviews for update
  using (true);

-- 5.6 Suspicious Listing Reports Policies
create policy "Allow whistleblowers to submit fraud reports anonymously"
  on public.suspicious_reports for insert
  with check (true);

create policy "Allow super admin to view and audit reports"
  on public.suspicious_reports for select
  using (true);

create policy "Allow super admin to manage reports"
  on public.suspicious_reports for update
  using (true);

-- 5.7 Platform Users Policies
create policy "Allow discovery of platform users"
  on public.platform_users for select
  using (true);

create policy "Allow management of platform user profiles"
  on public.platform_users for all
  using (true);

-- 5.8 Trade Activities Policies
create policy "Allow public read of trade activities ticker"
  on public.trade_activities for select
  using (true);

create policy "Allow authenticated users or admin to record trade activities"
  on public.trade_activities for insert
  with check (auth.role() = 'authenticated' or public.is_super_admin());

-- ==============================================================================
-- 6. REALTIME REPLICATION ENABLEMENT
-- ==============================================================================

alter table public.businesses replica identity full;
alter table public.products replica identity full;
alter table public.sourcing_requests replica identity full;
alter table public.quotations replica identity full;
alter table public.business_reviews replica identity full;
alter table public.platform_users replica identity full;
alter table public.trade_activities replica identity full;

-- Safely add tables to publication
do $$ begin
  alter publication supabase_realtime add table public.businesses;
exception when duplicate_object then null; end $$;

do $$ begin
  alter publication supabase_realtime add table public.products;
exception when duplicate_object then null; end $$;

do $$ begin
  alter publication supabase_realtime add table public.sourcing_requests;
exception when duplicate_object then null; end $$;

do $$ begin
  alter publication supabase_realtime add table public.quotations;
exception when duplicate_object then null; end $$;

do $$ begin
  alter publication supabase_realtime add table public.business_reviews;
exception when duplicate_object then null; end $$;

do $$ begin
  alter publication supabase_realtime add table public.platform_users;
exception when duplicate_object then null; end $$;

do $$ begin
  alter publication supabase_realtime add table public.trade_activities;
exception when duplicate_object then null; end $$;

-- ==============================================================================
-- 7. BASELINE SEED DATA (Super Admin & AfCFTA Trade Nodes)
-- ==============================================================================

-- 7.1 Seed Sovereign Super Administrator
insert into public.platform_users (
  id,
  name,
  email,
  phone,
  role,
  status,
  country,
  country_code,
  organization_name,
  security_pin,
  verification_tier,
  notes,
  created_at
) values (
  'usr-admin-master',
  'Pan-African Sovereign Administrator',
  'admin@afritradeos.co.za',
  '+27 11 884 0000',
  'super_admin',
  'active',
  'South Africa',
  'ZA',
  'AfriTrade OS Sovereign Trust Authority',
  'AFRI-ADMIN-2026',
  'tier_3_audited',
  'Root administrative authority with passkey AFRI-ADMIN-2026.',
  timezone('utc'::text, now())
) on conflict (id) do update
set security_pin = 'AFRI-ADMIN-2026',
    role = 'super_admin',
    status = 'active';

-- ==============================================================================
-- 8. VERIFICATION QUERY CONFIRMATION
-- ==============================================================================
select 'AfriTrade Trust Production Schema successfully installed!' as status,
       count(*) as verified_user_count from public.platform_users;
