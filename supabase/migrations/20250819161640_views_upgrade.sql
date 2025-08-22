drop view if exists "public"."chat_threads_view";

drop view if exists "public"."users_view";

create or replace view "public"."profile_view" as  SELECT p.user_id,
    u.email,
    u.phone,
    p.username,
    p.full_names,
    p.profile_pic,
    p.about,
    p.default_address
   FROM (auth.users u
     LEFT JOIN profiles p ON ((u.id = p.user_id)));


create or replace view "public"."chat_threads_view" as  SELECT c.id,
    c.created_at,
    c.deleted_at,
    c.buyer_id,
    c.seller_id,
    ( SELECT json_build_object('user_id', s.user_id, 'username', s.username, 'email', s.email, 'phone', s.phone, 'profile_pic', s.profile_pic, 'full_names', s.full_names, 'about', s.about) AS json_build_object
           FROM profile_view s
          WHERE (s.user_id = c.seller_id)
         LIMIT 1) AS seller,
    ( SELECT json_build_object('user_id', b.user_id, 'username', b.username, 'email', b.email, 'phone', b.phone, 'profile_pic', b.profile_pic, 'full_names', b.full_names, 'about', b.about) AS json_build_object
           FROM profile_view b
          WHERE (b.user_id = c.buyer_id)
         LIMIT 1) AS buyer,
    ( SELECT COALESCE(jsonb_agg(jsonb_build_object('id', m.id, 'text', m.text, 'sender_id', m.sender_id, 'thread_id', m.thread_id, 'status', m.status, 'created_at', m.created_at, 'deleted_at', m.deleted_at) ORDER BY m.created_at) FILTER (WHERE (m.id IS NOT NULL)), '[]'::jsonb) AS "coalesce"
           FROM chat_messages m
          WHERE (m.thread_id = c.id)) AS messages
   FROM chat_threads c
  WHERE ((c.seller_id = auth.uid()) OR ((c.buyer_id = auth.uid()) AND (NOT (auth.uid() = ANY (c.deleted_by)))));



