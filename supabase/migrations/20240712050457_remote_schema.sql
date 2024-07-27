set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.search_photospots(page_size integer DEFAULT 20, page_count integer DEFAULT 1, tags bigint[] DEFAULT NULL::bigint[], minimumrating double precision DEFAULT NULL::double precision, maximumdistance double precision DEFAULT NULL::double precision, latt double precision DEFAULT NULL::double precision, lngg double precision DEFAULT NULL::double precision, sort text DEFAULT NULL::text)
 RETURNS TABLE(id bigint, created_at timestamp with time zone, neighborhood text, location_name text, address text, lat double precision, lng double precision)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT p.id, p.created_at, p.neighborhood, p.location_name, p.address,
           ST_X(p.location::geometry) as lat, ST_Y(p.location::geometry) as lng
    FROM public.photospots p
    WHERE
        (tags IS NULL OR p.id IN (
            SELECT ps.id
            FROM public.photoshots ps
            JOIN public.photoshot_tags pt ON ps.id = pt.id
            GROUP BY ps.id
            HAVING array_agg(pt.tag_id) @> tags
        ))
        AND
        (minimumRating IS NULL OR p.id IN (
            SELECT pr.id
            FROM public.photospot_rating_stats pr
            WHERE pr.rating_average >= minimumRating
        ))
        AND
        ((latt IS NULL OR lngg IS NULL) OR (maximumDistance IS NULL OR (ST_Distance(p.location::geography, ST_SetSRID(ST_MakePoint(lngg, latt), 4326)) <= maximumDistance)))
    ORDER BY
    COALESCE(
        (
        SELECT
            pr.rating_average
        FROM
            public.photospot_rating_stats pr
        WHERE
            pr.id = p.id
            AND sort = 'rating'
        ),
        (
        SELECT
            ST_Distance (
            p.location::geography,
            ST_SetSRID (ST_MakePoint (lng, lat), 4326)
            )
        FROM
            public.photospots p
        WHERE
            sort = 'nearby'
            AND lat IS NOT NULL
            AND lng IS NOT NULL
        ),
        EXTRACT(
        EPOCH
        FROM
            p.created_at
        ) + 0.0 -- Adding 0.0 to ensure numeric comparison
    ) DESC,
    p.created_at DESC
    LIMIT page_size OFFSET (page_count - 1) * page_size;
END;
$function$
;


