set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.nearby_photoshots(latt double precision, long double precision, page_size bigint DEFAULT 20, page_count bigint DEFAULT 1)
 RETURNS TABLE(id bigint, name text, photospot_id bigint, photo_paths text[], dist_meters double precision)
 LANGUAGE sql
AS $function$ SELECT DISTINCT ON (pst.id) ps.id, ps.name, ps.photospot_id, ps.photo_paths, st_distance(pst.location::geography, st_point(long, latt)::geography) as dist_meters FROM photoshots ps JOIN photospots pst ON ps.photospot_id = pst.id LEFT JOIN ( SELECT photoshot_id, SUM(like_type) as total_likes FROM photoshot_likes GROUP BY photoshot_id ) pl ON ps.id = pl.photoshot_id ORDER BY pst.id, dist_meters ASC, COALESCE(total_likes, 0) DESC, ps.created_at DESC LIMIT page_size OFFSET (page_count - 1) * page_size; $function$
;


