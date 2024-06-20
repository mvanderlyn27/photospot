drop function if exists "public"."nearby_photoshots"(latt double precision, long double precision);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.nearby_photoshots(latt double precision, long double precision, limit_count bigint)
 RETURNS TABLE(id bigint, name text, photospot_id bigint, photo_paths text[], dist_meters double precision)
 LANGUAGE sql
AS $function$
SELECT ps.id, ps.name, ps.photospot_id, ps.photo_paths,
       st_distance(pst.location::geography, st_point(long, latt)::geography) as dist_meters
FROM photoshots ps
JOIN photospots pst ON ps.photospot_id = pst.id
ORDER BY pst.location::geography <-> st_point(long, latt)::geography
LIMIT limit_count;
$function$
;


