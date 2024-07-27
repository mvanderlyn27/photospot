set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.search_photospots(page_size integer DEFAULT 1, page_count integer DEFAULT 20, photospot_name text DEFAULT NULL::text, tags bigint[] DEFAULT NULL::bigint[])
 RETURNS SETOF photospots
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT p.*
    FROM public.photospots p
    WHERE
        (photospot_name IS NULL OR p.name ILIKE '%' || photospot_name || '%')
        AND
        (tags IS NULL OR p.id IN (
            SELECT pt.id
            FROM public.photoshot_tags pt
            WHERE pt.tag_id = ANY(tags)
        ))
    ORDER BY p.created_at DESC
    LIMIT page_size OFFSET (page_count - 1) * page_size;
END;
$function$
;


