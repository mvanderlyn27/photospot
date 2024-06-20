drop policy "Enable delete by owner" on "public"."photospots";

drop view if exists "public"."photospot_rating_stats";

alter table "public"."photospots" drop column "created_by";

create or replace view "public"."photospot_rating_stats" as  SELECT p.id,
    avg(r.rating) AS rating_average,
    count(r.rating) AS rating_count
   FROM (photospots p
     LEFT JOIN photospot_reviews r ON ((p.id = r.photospot_id)))
  GROUP BY p.id;



