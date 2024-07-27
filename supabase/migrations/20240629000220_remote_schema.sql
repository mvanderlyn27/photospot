drop trigger if exists "update_role" on "public"."profiles_priv";

set check_function_bodies = off;

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

CREATE TRIGGER prevent_role_change_trigger BEFORE UPDATE ON public.profiles_priv FOR EACH ROW EXECUTE FUNCTION prevent_role_change();


