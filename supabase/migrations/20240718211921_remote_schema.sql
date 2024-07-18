set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.search_photospots(tags bigint[] DEFAULT NULL::bigint[], minimumrating double precision DEFAULT NULL::double precision, maximumdistance double precision DEFAULT NULL::double precision, latt double precision DEFAULT NULL::double precision, lngg double precision DEFAULT NULL::double precision)
 RETURNS TABLE(id bigint, created_at timestamp with time zone, neighborhood text, location_name text, address text, lat double precision, lng double precision, dist_meters double precision, rating double precision)
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
           (SELECT pr.rating_average FROM public.photospot_rating_stats pr WHERE pr.id = p.id) as rating
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
        ((latt IS NULL OR lngg IS NULL) OR (maximumDistance IS NULL OR (ST_Distance(p.location::geography, ST_SetSRID(ST_MakePoint(lngg,latt), 4326)) <= maximumDistance)));
    END;
$function$
;


