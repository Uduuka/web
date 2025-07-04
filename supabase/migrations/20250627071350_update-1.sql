drop view if exists "public"."test_ads_list_view";

drop view if exists "public"."ads_list_view";

drop function if exists "public"."fetch_ads_in_view"(min_lat double precision, min_lon double precision, max_lat double precision, max_lon double precision);

drop function if exists "public"."fetch_nearby_ads"(lat double precision, lon double precision);

set check_function_bodies = off;

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
    ( SELECT json_build_object('id', s.id, 'name', s.name, 'logo', s.logo, 'description', s.description, 'status', s.status, 'keeper_id', s.keeper_id, 'welcome_note', s.welcome_note) AS json_build_object
           FROM stores s
          WHERE (s.id = a.store_id)
         LIMIT 1) AS store,
    ( SELECT json_build_object('id', p.id, 'scheme', p.scheme, 'currency', p.currency, 'details', p.details, 'ad_id', p.ad_id) AS json_build_object
           FROM pricings p
          WHERE (p.ad_id = a.id)
         LIMIT 1) AS pricing,
    ( SELECT json_build_object('id', i.id, 'url', i.url, 'ad_id', i.ad_id) AS json_build_object
           FROM ad_images i
          WHERE (i.ad_id = a.id)
         LIMIT 1) AS image
   FROM ads a;


CREATE OR REPLACE FUNCTION public.fetch_ads_in_view(min_lat double precision, min_lon double precision, max_lat double precision, max_lon double precision)
 RETURNS TABLE(id bigint, title text, description text, category_id text, sub_category_id text, store_id bigint, is_new boolean, is_featured boolean, latitude double precision, longitude double precision, seller_id uuid, pricing json, image json)
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

CREATE OR REPLACE FUNCTION public.fetch_nearby_ads(lat double precision, lon double precision)
 RETURNS TABLE(id bigint, title text, description text, category_id text, sub_category_id text, store_id bigint, is_new boolean, is_featured boolean, latitude double precision, longitude double precision, seller_id uuid, pricing json, image json, store json, distance double precision)
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
        st_y(a.location) as latitude, 
        st_x(a.location) as longitude, 
        a.seller_id, 
        a.pricing, 
        a.image,
        a.store,
        st_distance(a.location::geography, st_makepoint(lon, lat)::geography) as distance
    FROM public.ads_list_view a order by location <-> st_point(lon, lat)::geography;
END;
$function$
;


