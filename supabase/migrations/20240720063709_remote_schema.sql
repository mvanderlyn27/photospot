set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_photospot_reviews(input_photospot_id bigint, current_user_id uuid)
 RETURNS TABLE(created_at timestamp with time zone, created_by uuid, rating bigint, text text, photospot_id bigint, edited boolean, username text, owner boolean)
 LANGUAGE plpgsql
AS $function$
begin
    return query
    SELECT
        pr.created_at,
        pr.created_by,
        pr.rating,
        pr.text,
        pr.photospot_id,
        pr.edited,
        COALESCE(p.username, '') as username,
        pr.created_by = current_user_id as owner
    FROM photospot_reviews pr
    LEFT JOIN profiles p ON pr.created_by = p.id
    WHERE pr.photospot_id = input_photospot_id;
END;
$function$
;


