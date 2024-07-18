set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.search_saved_photospots(page_size integer DEFAULT 20, page_count integer DEFAULT 1, photospot_name text DEFAULT NULL::text, tags bigint[] DEFAULT NULL::bigint[], user_id uuid DEFAULT auth.uid())
 RETURNS TABLE(id bigint, created_at timestamp with time zone, neighborhood text, location_name text, address text, lat double precision, lng double precision)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT p.id, p.created_at, p.neighborhood, p.location_name, p.address,
           ST_X(p.location::geometry) as lat, ST_Y(p.location::geometry) as lng
    FROM public.photospots p
    WHERE
        p.id IN (
            SELECT sp.photospot_id
            FROM public.saved_photospots sp
            WHERE sp.id = user_id
        )
        AND
        (photospot_name IS NULL OR p.location_name ILIKE '%' || photospot_name || '%')
        AND
        (
            tags IS NULL
            OR p.id IN (
                SELECT ps.id
                FROM public.photoshots ps
                WHERE ps.photospot_id = p.id
                AND array_agg(pt.tag_id) @> tags
            )
        )
    ORDER BY
        CASE
            WHEN photospot_name IS NOT NULL THEN similarity(p.location_name, photospot_name) 
            ELSE NULL
        END DESC,
        p.created_at DESC
    LIMIT page_size OFFSET (page_count - 1) * page_size;
END;
$function$
;


