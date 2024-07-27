drop function if exists "public"."get_photoshots_with_highest_likes"(limit_count integer, time_range interval);

drop function if exists "public"."nearby_photoshots"(latt double precision, long double precision, limit_count bigint);

drop function if exists "public"."recommend_photoshots"(user_id uuid, limit_count integer, time_range interval);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_photoshots_with_highest_likes(time_range interval DEFAULT NULL::interval, page_size integer DEFAULT 20, page_count integer DEFAULT 1)
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
LIMIT page_size
OFFSET (page_count - 1) * page_size;
$function$
;

CREATE OR REPLACE FUNCTION public.nearby_photoshots(latt double precision, long double precision, page_size bigint DEFAULT 20, page_count bigint DEFAULT 1)
 RETURNS TABLE(id bigint, name text, photospot_id bigint, photo_paths text[], dist_meters double precision)
 LANGUAGE sql
AS $function$
SELECT ps.id, ps.name, ps.photospot_id, ps.photo_paths,
       st_distance(pst.location::geography, st_point(long, latt)::geography) as dist_meters
FROM photoshots ps
JOIN photospots pst ON ps.photospot_id = pst.id
ORDER BY pst.location::geography <-> st_point(long, latt)::geography
LIMIT page_size
OFFSET (page_count - 1) * page_size;
$function$
;

CREATE OR REPLACE FUNCTION public.recommend_photoshots(user_id uuid, time_range interval DEFAULT NULL::interval, page_size integer DEFAULT 20, page_count integer DEFAULT 1)
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
LIMIT page_size
OFFSET (page_count - 1) * page_size;
$function$
;


