drop function if exists "public"."nearby_photospots"(latt double precision, long double precision);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.nearby_photospots(latt double precision, long double precision, page_size bigint, page_count bigint)
 RETURNS TABLE(id bigint, location_name text, address text, neighborhood text, lat double precision, lng double precision, dist_meters double precision)
 LANGUAGE sql
AS $function$
SELECT pst.id, pst.location_name,pst.address, pst.neighborhood,
       st_y(pst.location::geometry) as lat, st_x(pst.location::geometry) as lng,
       st_distance(pst.location, st_point(long, latt)::geography) as dist_meters
FROM photospots pst
ORDER BY pst.location <-> st_point(long, latt)::geography
LIMIT page_size
OFFSET (page_count - 1) * page_size;
$function$
;


