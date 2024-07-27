drop function if exists "public"."get_photospot_by_id_lat_lng"(input_id bigint, input_lat double precision, input_lng double precision);

drop function if exists "public"."search_photospots"(tags bigint[], minimumrating double precision, maximumdistance double precision, latt double precision, lngg double precision, photospotname text);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_photospot_by_id_lat_lng(input_id bigint, latt double precision DEFAULT NULL::double precision, lngg double precision DEFAULT NULL::double precision)
 RETURNS TABLE(id bigint, location_name text, address text, neighborhood text, lat double precision, lng double precision, rating_average double precision, rating_count bigint, dist_meters double precision)
 LANGUAGE plpgsql
AS $function$
begin
    return query
    SELECT
        p.id,
        p.location_name,
        p.address,
        p.neighborhood,
        ST_Y(p.location::geometry) as lat,
        ST_X(p.location::geometry) as lng,
        prs.rating_average,
        prs.rating_count,
        ST_Distance(p.location::geography, ST_SetSRID(ST_MakePoint(lngg, latt), 4326)) as distance
    FROM photospots p
    LEFT JOIN photospot_rating_stats prs ON p.id = prs.id
    WHERE p.id = input_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.search_photospots(tags bigint[] DEFAULT NULL::bigint[], minimumrating double precision DEFAULT NULL::double precision, maximumdistance double precision DEFAULT NULL::double precision, latt double precision DEFAULT NULL::double precision, lngg double precision DEFAULT NULL::double precision, photospotname text DEFAULT NULL::text)
 RETURNS TABLE(id bigint, created_at timestamp with time zone, neighborhood text, location_name text, address text, lat double precision, lng double precision, dist_meters double precision, rating_average double precision, rating_count double precision)
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
           (SELECT pr.rating_average, pr.rating_count FROM public.photospot_rating_stats pr WHERE pr.id = p.id)
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


