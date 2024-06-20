drop function if exists "public"."get_photoshots_with_highest_likes"(limit_count integer, time_range interval);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_photoshots_with_highest_likes(limit_count integer DEFAULT NULL::integer, time_range interval DEFAULT NULL::interval)
 RETURNS TABLE(id bigint, total_likes bigint, name text, photo_paths text[])
 LANGUAGE sql
AS $function$
SELECT ps.id, SUM(pl.like_type) as total_likes, ps.name as photoshot_name, ps.photo_paths
FROM photoshot_likes pl
JOIN photoshots ps ON pl.photoshot_id = ps.id
WHERE 
    CASE
        WHEN time_range IS NOT NULL THEN pl.created_at >= current_timestamp - time_range
        ELSE TRUE
    END
GROUP BY ps.id, ps.name, ps.photo_paths
ORDER BY total_likes DESC
LIMIT COALESCE(limit_count, 1000000);
$function$
;


