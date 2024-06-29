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

create policy "Public accounts can be accessed by all users"
on "public"."user_follows"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = (current_setting('auth.uid'::text))::uuid) AND (profiles.private_profile = false)))));


create policy "User can do everything to their own entries"
on "public"."user_follows"
as permissive
for all
to public
using ((follower = auth.uid()));


CREATE TRIGGER check_same_id_trigger BEFORE INSERT ON public.user_follows FOR EACH ROW EXECUTE FUNCTION check_same_id();


