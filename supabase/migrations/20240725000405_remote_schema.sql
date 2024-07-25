drop function if exists "public"."get_saved_photospots"(user_id uuid, page_size bigint, page_count bigint);

drop function if exists "public"."search_photospots"(tags bigint[], minimumrating double precision, maximumdistance double precision, latt double precision, lngg double precision, photospotname text);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_photospot_reviews(photospotid bigint)
 RETURNS TABLE(created_at timestamp with time zone, created_by uuid, rating real, text text, photospot_id bigint, edited boolean, username text, owner boolean)
 LANGUAGE plpgsql
AS $function$
begin
    return query
    SELECT
        pr.created_at,
        pr.created_by,
        pr.rating,
        pr.text,
        pr.photospot_id,
        pr.edited,
        COALESCE(p.username, '') as username,
        pr.created_by = auth.uid() as owner
    FROM photospot_reviews pr
    LEFT JOIN profiles p ON pr.created_by = p.id
    WHERE pr.photospot_id = photospotid;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_saved_photospots(user_id uuid, page_size bigint DEFAULT 20, page_count bigint DEFAULT 1)
 RETURNS TABLE(id bigint, lat double precision, lng double precision, neighborhood text, location_name text, address text)
 LANGUAGE sql
AS $function$
SELECT
    pst.id,
    ST_Y(pst.location::geometry) AS lat,
    ST_X(pst.location::geometry) AS lng,
    pst.neighborhood,
    pst.location_name,
    pst.address
FROM
    saved_photospots sp
JOIN photospots pst ON sp.photospot = pst.id
WHERE
    sp.id = user_id
ORDER BY
    sp.created_at
LIMIT page_size OFFSET (page_count - 1) * page_size;
$function$
;

CREATE OR REPLACE FUNCTION public.search_photospots(tags bigint[] DEFAULT NULL::bigint[], minimumrating double precision DEFAULT NULL::double precision, maximumdistance double precision DEFAULT NULL::double precision, latt double precision DEFAULT NULL::double precision, lngg double precision DEFAULT NULL::double precision, photospotname text DEFAULT NULL::text)
 RETURNS TABLE(id bigint, created_at timestamp with time zone, neighborhood text, location_name text, address text, lat double precision, lng double precision, dist_meters double precision, rating_average double precision, rating_count bigint)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT p.id, p.created_at, p.neighborhood, p.location_name, p.address,
           ST_Y(p.location::geometry) as lat, ST_X(p.location::geometry) as lng, 
           CASE
               WHEN latt IS NOT NULL AND lngg IS NOT NULL THEN ST_Distance(p.location::geography, ST_SetSRID(ST_MakePoint(lngg,latt), 4326))
               ELSE NULL
           END as dist_meters,
           (SELECT pr.rating_average FROM public.photospot_rating_stats pr WHERE pr.id = p.id) as rating_average,
           (SELECT pr.rating_count FROM public.photospot_rating_stats pr WHERE pr.id = p.id) as rating_count
    FROM public.photospots p
    WHERE
        (tags IS NULL OR p.id IN (
            SELECT ps.id
            FROM public.photoshots ps
            JOIN public.photoshot_tags pt ON ps.id = pt.id
            GROUP BY ps.id
            HAVING array_agg(pt.tag_id) @> tags
        ))
        AND
        (minimumRating IS NULL OR p.id IN (
            SELECT pr.id
            FROM public.photospot_rating_stats pr
            WHERE pr.rating_average >= minimumRating
        ))
        AND
        ((latt IS NULL OR lngg IS NULL) OR (maximumDistance IS NULL OR (ST_Distance(p.location::geography, ST_SetSRID(ST_MakePoint(lngg,latt), 4326)) <= maximumDistance)))
        AND
        (photospotName IS NULL OR p.location_name ILIKE '%' || photospotName || '%');
    END;
$function$
;


