set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.check_same_id()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF NEW.follower = NEW.followee THEN
        RAISE EXCEPTION 'Follower and followee ids cannot be the same';
    END IF;
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.create_photospot_with_lat_lng(location_namein text, addressin text, neighborhoodin text, locationin geometry)
 RETURNS TABLE(id bigint, location_name text, address text, neighborhood text, lat double precision, lng double precision)
 LANGUAGE plpgsql
AS $function$
DECLARE
    new_id bigint;
BEGIN
    INSERT INTO photospots (location_name, address, neighborhood, location)
    VALUES (location_nameIn, addressIn, neighborhoodIn, locationIn)
    RETURNING photospots.id INTO new_id;

    RETURN QUERY
    SELECT
        photospots.id,
        photospots.location_name,
        photospots.address,
        photospots.neighborhood,
        ST_Y(photospots.location::geometry) as lat,
        ST_X(photospots.location::geometry) as lng
    FROM photospots
    WHERE photospots.id = new_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.delete_old_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  delete from public.profiles where id = old.id;
  delete from public.profiles_priv where id = old.id;
  return old;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.delete_storage_object(bucket text, object text, OUT status integer, OUT content character varying)
 RETURNS record
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  project_url varchar := 'https://vkfbzrfveygdqsqyiggk.supabase.co';
  service_role_key varchar := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrZmJ6cmZ2ZXlnZHFzcXlpZ2drIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY3NDY3NDk1MSwiZXhwIjoxOTkwMjUwOTUxfQ.8yo7eU-Q9OkYb5DjlDBb1qIpBJEyqwwmdU9Ed10WA1M'; --  full access needed
  url varchar := project_url||'/storage/v1/object/'||bucket||'/'||object;
begin
  select
      into status, content
           result.status::int, result.content::varchar
      FROM extensions.http((
    'DELETE',
    url,
    ARRAY[extensions.http_header('authorization','Bearer '||service_role_key)],
    NULL,
    NULL)::extensions.http_request) as result;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.find_photospot_by_lat_lng(latitude double precision, longitude double precision)
 RETURNS TABLE(id bigint, location_name text, address text, neighborhood text, lat double precision, lng double precision)
 LANGUAGE plpgsql
AS $function$ 
begin 
  return query
    SELECT 
      photospots.id, 
      photospots.location_name,
      photospots.address, 
      photospots.neighborhood, 
      ST_Y(photospots.location::geometry) as lat, 
      ST_X(photospots.location::geometry) as lng 
    FROM photospots WHERE
  ST_X(photospots.location::geometry) BETWEEN longitude - 0.0001 AND longitude  + 0.0001
  AND ST_Y(photospots.location::geometry) BETWEEN latitude - 0.0001 AND latitude  + 0.0001; 
END; 
$function$
;

CREATE OR REPLACE FUNCTION public.get_all_photospots_with_lat_lng()
 RETURNS TABLE(id bigint, location_name text, address text, neighborhood text, lat double precision, lng double precision)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT
        photospots.id,
        photospots.location_name,
        photospots.address,
        photospots.neighborhood,
        ST_Y(photospots.location::geometry) as lat,
        ST_X(photospots.location::geometry) as lng
    FROM photospots;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_photoshots_with_highest_likes(time_range interval DEFAULT NULL::interval, page_size integer DEFAULT 20, page_count integer DEFAULT 1)
 RETURNS TABLE(id bigint, like_count bigint, name text, photo_paths text[])
 LANGUAGE sql
AS $function$
SELECT DISTINCT ps.id, SUM(pl.like_type) as like_count, ps.name as photoshot_name, ps.photo_paths
FROM photoshot_likes pl
JOIN photoshots ps ON pl.photoshot_id = ps.id
WHERE 
    CASE
        WHEN time_range IS NOT NULL THEN pl.created_at >= current_timestamp - time_range
        ELSE TRUE
    END
GROUP BY ps.id, ps.name, ps.photo_paths
ORDER BY like_count DESC
LIMIT page_size
OFFSET (page_count - 1) * page_size;
$function$
;

CREATE OR REPLACE FUNCTION public.get_photospot_by_id_lat_lng(input_id bigint)
 RETURNS TABLE(id bigint, location_name text, address text, neighborhood text, lat double precision, lng double precision)
 LANGUAGE plpgsql
AS $function$
begin
    return query
    SELECT
        photospots.id,
        photospots.location_name,
        photospots.address,
        photospots.neighborhood,
        ST_Y(photospots.location::geometry) as lat,
        ST_X(photospots.location::geometry) as lng
    FROM photospots
    WHERE photospots.id = input_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_tags_for_photospot(photospotid bigint)
 RETURNS SETOF text
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT DISTINCT t.name
    FROM tags t
    JOIN photoshot_tags pt ON t.id = pt.tag_id
    JOIN photoshots p ON pt.id = p.id
    WHERE p.photospot_id = photospotid;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.nearby_photoshots(latt double precision, long double precision, page_size bigint DEFAULT 20, page_count bigint DEFAULT 1)
 RETURNS TABLE(id bigint, name text, photospot_id bigint, photo_paths text[], dist_meters double precision)
 LANGUAGE sql
AS $function$
SELECT ps.id, ps.name, ps.photospot_id, ps.photo_paths,
       st_distance(pst.location::geography, st_point(long, latt)::geography) as dist_meters
FROM photoshots ps
JOIN photospots pst ON ps.photospot_id = pst.id
ORDER BY pst.location::geography <-> st_point(long, latt)::geography
LIMIT page_size
OFFSET (page_count - 1) * page_size;
$function$
;

CREATE OR REPLACE FUNCTION public.prevent_role_change()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF OLD.user_role <> 'admin' AND NEW.user_role <> OLD.user_role THEN
        RAISE EXCEPTION 'You are not authorized to change your role';
    END IF;
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.recommend_photoshots(user_id uuid, time_range interval DEFAULT NULL::interval, page_size integer DEFAULT 20, page_count integer DEFAULT 1)
 RETURNS TABLE(id bigint, name text, photospot_id bigint, photo_paths text[], created_at timestamp with time zone)
 LANGUAGE sql
AS $function$
SELECT DISTINCT ps.id, ps.name, ps.photospot_id, ps.photo_paths, ps.created_at
FROM photoshots ps
WHERE ps.id IN (
    SELECT DISTINCT pt.id
    FROM photoshot_tags pt
    WHERE pt.tag_id IN (
        SELECT tag_id
        FROM photoshot_tags
        WHERE id IN (
            SELECT photoshot_id
            FROM photoshot_likes
            WHERE created_by = user_id
        )
    )
    OR ps.photospot_id IN (
        SELECT photospot_id
        FROM saved_photoshots
        WHERE id = user_id
    )
)
AND (
    CASE
        WHEN time_range IS NOT NULL THEN ps.created_at >= current_timestamp - time_range
        ELSE TRUE
    END
)
ORDER BY ps.created_at DESC
LIMIT page_size
OFFSET (page_count - 1) * page_size;
$function$
;

CREATE OR REPLACE FUNCTION public.search_tags(input_text text)
 RETURNS TABLE(id bigint, name text)
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF input_text = '' THEN
        RETURN QUERY
        SELECT tags.id, tags.name
        FROM tags;
    ELSE
        RETURN QUERY
        SELECT tags.id, tags.name
        FROM tags
        WHERE lower(tags.name) LIKE '%' || lower(input_text) || '%'  
        UNION
        SELECT tags.id, tags.name
        FROM tags
        WHERE levenshtein(lower(tags.name), lower(input_text)) <= 2;
    END IF;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_photoshot_tags(photoshot_id bigint, tag_ids bigint[])
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Delete entries not in the tag_ids list
    DELETE FROM photoshot_tags
    WHERE photoshot_tags.id = photoshot_id
    AND photoshot_tags.tag_id NOT IN (SELECT unnest(tag_ids));
    
    -- Insert new entries from the tag_ids list
    INSERT INTO photoshot_tags (id, tag_id)
    SELECT photoshot_id, tag_id
    FROM unnest(tag_ids) AS tag_id
    ON CONFLICT DO NOTHING;
    
END;
$function$
;


