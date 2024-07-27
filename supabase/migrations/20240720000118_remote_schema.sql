set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_all_photospots_with_lat_lng(latt double precision DEFAULT NULL::double precision, lngg double precision DEFAULT NULL::double precision)
 RETURNS TABLE(id bigint, location_name text, address text, neighborhood text, lat double precision, lng double precision, dist_meters double precision, rating double precision)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.location_name,
        p.address,
        p.neighborhood,
        ST_Y(p.location::geometry) as lat,
        ST_X(p.location::geometry) as lng,
        CASE
            WHEN latt IS NOT NULL AND lngg IS NOT NULL THEN ST_Distance(p.location::geography, ST_SetSRID(ST_MakePoint(lngg,latt), 4326))
            ELSE NULL
        END as dist_meters,
        (SELECT pr.rating_average FROM public.photospot_rating_stats pr WHERE pr.id = p.id) as rating
    FROM public.photospots p;
END;
$function$
;


