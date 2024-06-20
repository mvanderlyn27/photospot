set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.photoshot_like_count(input_id bigint)
 RETURNS bigint
 LANGUAGE plpgsql
AS $function$
DECLARE
    total_likes bigint;
BEGIN
    SELECT COALESCE(SUM(like_type), 0)
    INTO total_likes
    FROM photoshot_likes
    WHERE photoshot_id = input_id;

    RETURN total_likes;
END;
$function$
;


