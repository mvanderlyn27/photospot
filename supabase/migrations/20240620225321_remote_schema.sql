set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.recommend_photoshots(user_id uuid, limit_count integer DEFAULT NULL::integer, time_range interval DEFAULT NULL::interval)
 RETURNS TABLE(id bigint, name text, photospot_id bigint, photo_paths text[], created_at timestamp with time zone)
 LANGUAGE sql
AS $function$
SELECT ps.id, ps.name, ps.photospot_id, ps.photo_paths, ps.created_at
FROM photoshots ps
WHERE ps.id IN (
    SELECT DISTINCT pt.id
    FROM photoshot_tags pt
    WHERE pt.tag_id IN (
        SELECT tag_id
        FROM photoshot_tags
        WHERE id IN (
            SELECT photoshot_id
            FROM photoshot_likes
            WHERE created_by = user_id
        )
    )
    OR ps.photospot_id IN (
        SELECT photospot_id
        FROM saved_photoshots
        WHERE id = user_id
    )
)
AND (
    CASE
        WHEN time_range IS NOT NULL THEN ps.created_at >= current_timestamp - time_range
        ELSE TRUE
    END
)
ORDER BY ps.created_at DESC
LIMIT COALESCE(limit_count, 1000000);
$function$
;


