alter table "public"."profiles" drop column "private";

alter table "public"."profiles" add column "private_profile" boolean not null default false;


