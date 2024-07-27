alter table "public"."photoshots" drop constraint "photoshots_created_by_fkey";

alter table "public"."photoshots" add constraint "photoshots_created_by_fkey" FOREIGN KEY (created_by) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."photoshots" validate constraint "photoshots_created_by_fkey";


