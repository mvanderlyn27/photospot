drop function if exists "public"."get_photoshots_with_highest_likes"(time_range interval, page_size integer, page_count integer);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_photoshots_with_highest_likes(time_range interval DEFAULT NULL::interval, page_size integer DEFAULT 20, page_count integer DEFAULT 1)
 RETURNS TABLE(id bigint, like_count bigint, name text, photo_paths text[])
 LANGUAGE sql
AS $function$
SELECT ps.id, SUM(pl.like_type) as like_count, ps.name as photoshot_name, ps.photo_paths
FROM photoshot_likes pl
JOIN photoshots ps ON pl.photoshot_id = ps.id
WHERE 
    CASE
        WHEN time_range IS NOT NULL THEN pl.created_at >= current_timestamp - time_range
        ELSE TRUE
    END
GROUP BY ps.id, ps.name, ps.photo_paths
ORDER BY like_count DESC
LIMIT page_size
OFFSET (page_count - 1) * page_size;
$function$
;


