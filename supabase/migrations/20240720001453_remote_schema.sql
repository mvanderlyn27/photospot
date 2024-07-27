set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_photospot_by_id_lat_lng(input_id bigint, input_lat double precision DEFAULT NULL::double precision, input_lng double precision DEFAULT NULL::double precision)
 RETURNS TABLE(id bigint, location_name text, address text, neighborhood text, lat double precision, lng double precision, rating_average double precision, rating_count bigint, distance double precision)
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
        ST_Distance(p.location::geography, ST_SetSRID(ST_MakePoint(input_lng, input_lat), 4326)) as distance
    FROM photospots p
    LEFT JOIN photospot_rating_stats prs ON p.id = prs.id
    WHERE p.id = input_id;
END;
$function$
;


