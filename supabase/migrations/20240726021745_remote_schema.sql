set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_saved_photospots(user_id uuid, page_size bigint DEFAULT 20, page_count bigint DEFAULT 1, latt double precision DEFAULT NULL::double precision, lngg double precision DEFAULT NULL::double precision)
 RETURNS TABLE(id bigint, lat double precision, lng double precision, neighborhood text, location_name text, address text, dist_meters double precision, rating_average double precision, rating_count bigint)
 LANGUAGE sql
AS $function$
SELECT
    pst.id,
    ST_Y(pst.location::geometry) AS lat,
    ST_X(pst.location::geometry) AS lng,
    pst.neighborhood,
    pst.location_name,
    pst.address,
    CASE
        WHEN latt IS NOT NULL AND lngg IS NOT NULL THEN ST_Distance(pst.location::geography, ST_SetSRID(ST_MakePoint(lngg, latt), 4326))
        ELSE NULL
    END AS dist_meters,
    ps.rating_average,
    ps.rating_count
FROM
    saved_photospots sp
JOIN photospots pst ON sp.photospot = pst.id
LEFT JOIN photospot_rating_stats ps ON pst.id = ps.id
WHERE
    sp.id = user_id
ORDER BY
    sp.id
LIMIT page_size OFFSET (page_count - 1) * page_size;
$function$
;


