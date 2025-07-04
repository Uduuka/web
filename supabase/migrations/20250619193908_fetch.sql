drop view if exists "public"."ads_with_pricing_and_images";

drop view if exists "public"."ads_list_view";

drop function if exists "public"."fetch_nearby_ads"(lat double precision, lon double precision);

alter table "public"."pricings" add column "mode" text default 'retail'::text;

CREATE INDEX ads_location_index ON public.ads USING gist (location);

CREATE UNIQUE INDEX unique_mode_per_ad ON public.pricings USING btree (ad_id, mode);

alter table "public"."pricings" add constraint "pricings_mode_check" CHECK ((mode = ANY (ARRAY['retail'::text, 'wholesale'::text]))) not valid;

alter table "public"."pricings" validate constraint "pricings_mode_check";

alter table "public"."pricings" add constraint "unique_mode_per_ad" UNIQUE using index "unique_mode_per_ad";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.fetch_ads_in_view(min_lat double precision, min_lon double precision, max_lat double precision, max_lon double precision)
 RETURNS TABLE(id bigint, title text, description text, category_id text, sub_category_id text, store_id bigint, is_new boolean, is_featured boolean, latitude double precision, longitude double precision, seller_id uuid, price json, image json)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        a.id, 
        a.title, 
        a.description, 
        a.category_id, 
        a.sub_category_id, 
        a.store_id, a.is_new, 
        a.is_featured, 
        extensions.st_y(a.location) as latitude, 
        extensions.st_x(a.location) as longitude, 
        a.seller_id, 
        a.pricing, 
        a.image
    FROM public.ads_list_view a
    WHERE location && st_setsrid(
      st_makebox2d(
        st_point(min_lon, min_lat),
        st_point(max_lon, max_lat)
      ),
      4326
    );
END;
$function$
;

create or replace view "public"."test_ads_list_view" as  SELECT a.id,
    a.created_at,
    a.deleted_at,
    a.title,
    a.description,
    a.store_id,
    a.is_new,
    a.is_featured,
    a.location,
    a.seller_id,
    a.specs,
    a.category_id,
    a.sub_category_id,
    jsonb_agg(DISTINCT pricing.*) AS pricing,
    jsonb_agg(DISTINCT image.*) AS image
   FROM ((ads a
     LEFT JOIN ( SELECT pricings.id,
            pricings.created_at,
            pricings.deleted_at,
            pricings.scheme,
            pricings.currency,
            pricings.details,
            pricings.ad_id,
            row_number() OVER (PARTITION BY pricings.ad_id ORDER BY pricings.created_at) AS rn
           FROM pricings) pricing ON ((a.id = pricing.ad_id)))
     LEFT JOIN ( SELECT ad_images.id,
            ad_images.created_at,
            ad_images.deleted_at,
            ad_images.ad_id,
            ad_images.url,
            ad_images.id_defualt,
            row_number() OVER (PARTITION BY ad_images.ad_id ORDER BY ad_images.created_at) AS rn
           FROM ad_images) image ON ((a.id = image.ad_id)))
  GROUP BY a.id;


create or replace view "public"."ads_list_view" as  SELECT a.id,
    a.created_at,
    a.deleted_at,
    a.title,
    a.description,
    a.store_id,
    a.is_new,
    a.is_featured,
    a.location,
    a.seller_id,
    a.specs,
    a.category_id,
    a.sub_category_id,
    ( SELECT json_build_object('id', p.id, 'scheme', p.scheme, 'details', p.details, 'ad_id', p.ad_id) AS json_build_object
           FROM pricings p
          WHERE (p.ad_id = a.id)
         LIMIT 1) AS pricing,
    ( SELECT json_build_object('id', i.id, 'url', i.url, 'ad_id', i.ad_id) AS json_build_object
           FROM ad_images i
          WHERE (i.ad_id = a.id)
         LIMIT 1) AS image
   FROM ads a;


CREATE OR REPLACE FUNCTION public.fetch_nearby_ads(lat double precision, lon double precision)
 RETURNS TABLE(id bigint, title text, description text, category_id text, sub_category_id text, store_id bigint, is_new boolean, is_featured boolean, latitude double precision, longitude double precision, seller_id uuid, price json, image json, distance double precision)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        a.id, 
        a.title, 
        a.description, 
        a.category_id, 
        a.sub_category_id, 
        a.store_id, a.is_new, 
        a.is_featured, 
        extensions.st_y(a.location) as latitude, 
        extensions.st_x(a.location) as longitude, 
        a.seller_id, 
        a.pricing, 
        a.image,
        extensions.st_distance(a.location, extensions.st_makepoint(lon, lat)) as distance
    FROM public.ads_list_view a order by location <-> st_point(lon, lat)::geography;

END;
$function$
;


