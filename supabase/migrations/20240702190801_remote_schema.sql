set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_saved_photospots(user_id uuid, page_size bigint DEFAULT 20, page_count bigint DEFAULT 1)
 RETURNS TABLE(top_photoshot_id bigint, top_photoshot_path text, photospot_id bigint, lat double precision, lng double precision, neighborhood text, location_name text, address text)
 LANGUAGE sql
AS $function$
SELECT DISTINCT ON (sp.id) 
       ps.photoshot_id AS top_photoshot_id,
       ps.photo_paths[1] AS top_photoshot_path,
       pst.id AS photospot_id,
       ST_Y(pst.location::geometry) AS lat,
       ST_X(pst.location::geometry) AS lng,
       pst.neighborhood,
       pst.location_name,
       pst.address
FROM saved_photospots sp
JOIN photospots pst ON sp.photospot = pst.id
LEFT JOIN LATERAL (
    SELECT photoshot_id, ps.photo_paths, pl.total_likes, created_at
    FROM photoshots ps
    LEFT JOIN LATERAL (
        SELECT photoshot_id, SUM(like_type) AS total_likes
        FROM photoshot_likes
        WHERE photoshot_id = ps.id
        GROUP BY photoshot_id
        ORDER BY total_likes DESC
        LIMIT 1
    ) pl ON true
    WHERE ps.photospot_id = pst.id
    ORDER BY ps.created_at DESC
    LIMIT 1
) ps ON true
WHERE sp.id = user_id
ORDER BY sp.id, COALESCE((ps.total_likes), 0) DESC, ps.created_at DESC
LIMIT page_size
OFFSET (page_count - 1) * page_size;
$function$
;


