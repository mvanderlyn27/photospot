drop function if exists "public"."search_photospots"(page_size integer, page_count integer, photospot_name text, tags bigint[]);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.search_nearby_photospots(latt double precision, lngg double precision, page_size integer DEFAULT 20, page_count integer DEFAULT 1, photospot_name text DEFAULT NULL::text, tags bigint[] DEFAULT NULL::bigint[])
 RETURNS TABLE(id bigint, created_at timestamp with time zone, neighborhood text, location_name text, address text, lat double precision, lng double precision, distance double precision)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT p.id, p.created_at, p.neighborhood, p.location_name, p.address,
           ST_X(p.location::geometry) as lat, ST_Y(p.location::geometry) as lng,
           ST_Distance(p.location::geography, ST_MakePoint(lngg, latt)::geography) as distance
    FROM public.photospots p
    WHERE
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
        CASE
            WHEN photospot_name IS NULL AND tags IS NULL THEN ST_Distance(p.location::geography, ST_MakePoint(lng, lat)::geography)
            ELSE NULL
        END,
        p.created_at DESC
    LIMIT page_size OFFSET (page_count - 1) * page_size;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.search_photospots(page_size integer DEFAULT 20, page_count integer DEFAULT 1, photospot_name text DEFAULT NULL::text, tags bigint[] DEFAULT NULL::bigint[])
 RETURNS TABLE(id bigint, created_at timestamp with time zone, neighborhood text, location_name text, address text, lat double precision, lng double precision)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT p.id, p.created_at, p.neighborhood, p.location_name, p.address,
           ST_X(p.location::geometry) as lat, ST_Y(p.location::geometry) as lng
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


