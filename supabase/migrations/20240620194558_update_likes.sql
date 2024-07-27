create policy "Everyone can see likes"
on "public"."photoshot_likes"
as permissive
for select
to public
using (true);



