set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_photoshots_with_highest_likes(limit_count integer)
 RETURNS TABLE(photoshot_id bigint, total_likes bigint, photoshot_name text, photo_paths text[])
 LANGUAGE sql
AS $function$
SELECT pl.photoshot_id, SUM(pl.like_type) as total_likes, ps.name as photoshot_name, ps.photo_paths
FROM photoshot_likes pl
JOIN photoshots ps ON pl.photoshot_id = ps.id
GROUP BY pl.photoshot_id, ps.name, ps.photo_paths
ORDER BY total_likes DESC
LIMIT limit_count;
$function$
;


