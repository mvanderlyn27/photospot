create extension if not exists "pg_trgm" with schema "extensions";


drop policy "Public accounts can be accessed by all users" on "public"."user_follows";

drop policy "User can do everything to their own entries" on "public"."user_follows";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.search_profiles_by_username(search_query text, page_size bigint DEFAULT 20, page_count bigint DEFAULT 1)
 RETURNS TABLE(id uuid, username text, created_at timestamp with time zone, private_profile boolean, photo_path text, bio text)
 LANGUAGE sql
AS $function$
SELECT id, username, created_at, private_profile, photo_path, bio
FROM profiles
WHERE username ILIKE '%' || search_query || '%'
ORDER BY SIMILARITY(username, search_query) DESC
LIMIT page_size
OFFSET (page_count - 1) * page_size;
$function$
;

create policy "user can remove followers to their account"
on "public"."user_follows"
as permissive
for delete
to public
using ((( SELECT auth.uid() AS uid) = follower));


create policy "Public accounts can be accessed by all users"
on "public"."user_follows"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = ( SELECT auth.uid() AS uid)) AND (profiles.private_profile = false)))));


create policy "User can do everything to their own entries"
on "public"."user_follows"
as permissive
for all
to public
using ((follower = ( SELECT auth.uid() AS uid)));



