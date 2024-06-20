CREATE TRIGGER after_delete_user AFTER DELETE ON auth.users FOR EACH ROW EXECUTE FUNCTION delete_old_user();

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();


set check_function_bodies = off;

CREATE OR REPLACE FUNCTION storage.extension(name text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
_parts text[];
_filename text;
BEGIN
    select string_to_array(name, '/') into _parts;
    select _parts[array_length(_parts,1)] into _filename;
    -- @todo return the last part instead of 2
    return split_part(_filename, '.', 2);
END
$function$
;

CREATE OR REPLACE FUNCTION storage.filename(name text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
_parts text[];
BEGIN
    select string_to_array(name, '/') into _parts;
    return _parts[array_length(_parts,1)];
END
$function$
;

CREATE OR REPLACE FUNCTION storage.foldername(name text)
 RETURNS text[]
 LANGUAGE plpgsql
AS $function$
DECLARE
_parts text[];
BEGIN
    select string_to_array(name, '/') into _parts;
    return _parts[1:array_length(_parts,1)-1];
END
$function$
;

create policy "Allow authenticated users to insert 1pmf6kr_0"
on "storage"."objects"
as permissive
for insert
to authenticated
with check ((bucket_id = 'profile_pictures'::text));


create policy "Allow users to update/delete their own content 1pmf6kr_0"
on "storage"."objects"
as permissive
for update
to public
using (((bucket_id = 'profile_pictures'::text) AND ((auth.uid())::text = name)));


create policy "Allow users to update/delete their own content 1pmf6kr_1"
on "storage"."objects"
as permissive
for delete
to public
using (((bucket_id = 'profile_pictures'::text) AND ((auth.uid())::text = name)));


create policy "Give users authenticated access to photos 16gedwo_0"
on "storage"."objects"
as permissive
for insert
to public
with check (((bucket_id = 'photoshot_pictures'::text) AND (auth.role() = 'authenticated'::text)));


create policy "Give users authenticated access to photos 16gedwo_1"
on "storage"."objects"
as permissive
for update
to public
using (((bucket_id = 'photoshot_pictures'::text) AND (auth.role() = 'authenticated'::text)));


create policy "Give users authenticated access to photos 16gedwo_2"
on "storage"."objects"
as permissive
for delete
to public
using (((bucket_id = 'photoshot_pictures'::text) AND (auth.role() = 'authenticated'::text)));


create policy "all users can select photos 16gedwo_0"
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'photoshot_pictures'::text));


create policy "allow users to view 1iijvx5_0"
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'website_pictures'::text));


create policy "allow users to view all pictures in profile  1pmf6kr_0"
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'profile_pictures'::text));



