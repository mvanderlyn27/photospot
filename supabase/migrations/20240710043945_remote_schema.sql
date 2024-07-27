set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.search_photospots(page_size integer DEFAULT 20, page_count integer DEFAULT 1, photospot_name text DEFAULT NULL::text, tags bigint[] DEFAULT NULL::bigint[])
 RETURNS SETOF photospots
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT *
    FROM public.photospots p
    WHERE
        (photospot_name IS NULL OR p.location_name ILIKE '%' || photospot_name || '%')
        AND
        (
            tags IS NULL
            OR p.id IN (
                SELECT ps.photospot_id
                FROM public.photoshots ps
                WHERE ps.photospot_id = p.id
                AND ps.id IN (
                    SELECT pt.id
                    FROM public.photoshot_tags pt
                    WHERE pt.tag_id = ANY(tags)
                )
            )
        )
 ORDER BY
        CASE
            WHEN photospot_name IS NOT NULL THEN similarity(p.location_name, photospot_name) 
            ELSE NULL
        END DESC,
        CASE
            WHEN photospot_name IS NULL AND tags IS NULL THEN p.created_at
            ELSE NULL
        END DESC,
        p.created_at DESC
    LIMIT page_size OFFSET (page_count - 1) * page_size;
END;
$function$
;


