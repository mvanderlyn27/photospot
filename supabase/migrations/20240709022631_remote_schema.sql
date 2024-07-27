set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.search_profiles_by_username(search_query text, page_size bigint DEFAULT 20, page_count bigint DEFAULT 1)
 RETURNS TABLE(id uuid, username text, created_at timestamp with time zone, private_profile boolean, photo_path text, bio text)
 LANGUAGE sql
AS $function$
SELECT id, username, created_at, private_profile, photo_path, bio
FROM profiles
WHERE username ILIKE '%' || search_query || '%'
ORDER BY SIMILARITY(username, search_query) DESC, created_at DESC
LIMIT page_size
OFFSET (page_count - 1) * page_size;
$function$
;


