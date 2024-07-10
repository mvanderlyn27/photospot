set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.search_photospots(page_size integer DEFAULT 20, page_count integer DEFAULT 1, photospot_name text DEFAULT NULL::text, tags bigint[] DEFAULT NULL::bigint[])
 RETURNS SETOF photospots
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT p.*
    FROM public.photospots p
    WHERE
        (photospot_name IS NULL OR p.location_name ILIKE '%' || photospot_name || '%')
        AND
        (
            tags IS NULL
            OR p.id IN (
                SELECT ps.id
                FROM public.photoshots ps
                JOIN public.photoshot_tags pt ON ps.id = pt.id
                GROUP BY ps.id
                HAVING array_agg(pt.tag_id) @> tags
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


