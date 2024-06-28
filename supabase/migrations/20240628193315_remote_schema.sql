create table "public"."user_follows" (
    "follower" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "followee" uuid not null
);


alter table "public"."user_follows" enable row level security;

alter table "public"."profiles_priv" drop column "role";

alter table "public"."profiles_priv" add column "user_role" db_roles not null default 'user'::db_roles;

CREATE UNIQUE INDEX user_followes_pkey ON public.user_follows USING btree (follower, followee);

alter table "public"."user_follows" add constraint "user_followes_pkey" PRIMARY KEY using index "user_followes_pkey";

alter table "public"."user_follows" add constraint "user_followes_followee_fkey" FOREIGN KEY (followee) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."user_follows" validate constraint "user_followes_followee_fkey";

alter table "public"."user_follows" add constraint "user_followes_follower_fkey" FOREIGN KEY (follower) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."user_follows" validate constraint "user_followes_follower_fkey";

grant delete on table "public"."user_follows" to "anon";

grant insert on table "public"."user_follows" to "anon";

grant references on table "public"."user_follows" to "anon";

grant select on table "public"."user_follows" to "anon";

grant trigger on table "public"."user_follows" to "anon";

grant truncate on table "public"."user_follows" to "anon";

grant update on table "public"."user_follows" to "anon";

grant delete on table "public"."user_follows" to "authenticated";

grant insert on table "public"."user_follows" to "authenticated";

grant references on table "public"."user_follows" to "authenticated";

grant select on table "public"."user_follows" to "authenticated";

grant trigger on table "public"."user_follows" to "authenticated";

grant truncate on table "public"."user_follows" to "authenticated";

grant update on table "public"."user_follows" to "authenticated";

grant delete on table "public"."user_follows" to "service_role";

grant insert on table "public"."user_follows" to "service_role";

grant references on table "public"."user_follows" to "service_role";

grant select on table "public"."user_follows" to "service_role";

grant trigger on table "public"."user_follows" to "service_role";

grant truncate on table "public"."user_follows" to "service_role";

grant update on table "public"."user_follows" to "service_role";

create policy "allow admin to always update"
on "public"."profiles_priv"
as permissive
for select
to supabase_admin, supabase_auth_admin, service_role
using (true);



