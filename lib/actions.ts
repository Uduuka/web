"use server";


import { createClient } from "./supabase/server";
import { ChatHead, Filters } from "./types";

export const signup = async({email, password} : {email: string, password: string}) => {
   return (await createClient()).auth.signUp({email, password})
}

export const signin = async({email, password} : {email: string, password: string}) => {
   return (await createClient()).auth.signInWithPassword({email, password})
}

export const getUser = async() =>{
   return (await createClient()).auth.getUser()
}

export const getProfile = async(uid: string) => {
   return (await createClient()).from('users_view').select().eq('user_id', uid).single()
}

export const signout = async() => {
   return (await createClient()).auth.signOut()
}

export const fetchCategories = async(filters?: {catSlug?: string, subCateSlug?: string}) => {
   if(filters?.subCateSlug){
      return (await createClient()).from('sub_categories').select("name, slug, category:categories(name,slug)").eq('slug', filters.subCateSlug)
   }
   if(filters?.catSlug){
      return (await createClient()).from('categories').select("name,slug, sub_categories(name, slug)").eq("slug", filters.catSlug)
   }
   return (await createClient()).from('categories').select("*, sub_categories(*)")
}

export const fetchAds = async(filters: Filters) => {
   const supabase = createClient()
   
   console.log(filters)
   const {location} = filters

   let query
   if(location){
      query = (await supabase).rpc('fetch_nearby_ads', {lat: location.latitude, lon: location.longitude})
   }else{
      query = (await supabase).from("ads_list_view").select()
   }

   // Filter by search
   if(filters){
      if(filters.search){
         query = query.or(`title.ilike.%${filters.search}%, description.ilike.%${filters.search}%, category_id.ilike.%${filters.search}%, sub_category_id.ilike.%${filters.search}%`)
      }
   }

   // Filter by category slug
   if(filters.category){
      query = query.eq('category_id', filters.category)
   }

   // Filter by sub_category slug
   if(filters.subCategory){
      query = query.eq('sub_category_id', filters.subCategory)
   }

   return await query
}

export const fetchAd = async(id: string) => {
   return(await createClient()).from("ads").select("*, seller:profiles(*), pricing:pricings(*), images:ad_images(*)").eq('id', id).single()
}

export const fetchFlashsales = async(filters: Filters) => {
   const supabase = createClient()
   let query = (await supabase).from("flash_sales").select("id, start:started_at, duration, flash_price, ad:ads(*,pricing:pricings(*), images:ad_images(*))")

    // Filter by search
    if(filters){
      if(filters.search){
         query = query.or(`ad.title.ilike.%${filters.search}%, ad.description.ilike.%${filters.search}%, ad.category_id.ilike.%${filters.search}%, ad.sub_category_id.ilike.%${filters.search}%`)
      }
   }

   // Filter by category slug
   if(filters.category){
      query = query.eq('ad.category_id', filters.category)
   }

   // Filter by sub_category slug
   if(filters.subCategory){
      query = query.eq('ad.sub_category_id', filters.subCategory)
   }

   const res = await query
   console.log(res.data)
   return res
}

export const fetchAdsInView = async(filters: any) => {
   const supabase = createClient()
   const {bounds} = filters

   let query
   query = (await supabase).rpc('fetch_ads_in_view', bounds)

   // Filter by search
   if(filters){
      if(filters.search){
         query = query.or(`title.ilike.%${filters.search}%, description.ilike.%${filters.search}%, category_id.ilike.%${filters.search}%, sub_category_id.ilike.%${filters.search}%`)
      }
   }

   // Filter by category slug
   if(filters.category){
      query = query.eq('category_id', filters.category)
   }

   // Filter by sub_category slug
   if(filters.subCategory){
      query = query.eq('sub_category_id', filters.subCategory)
   }

   console.log(await query)
   return await query
}

export const fetchThread = async({seller, buyer}: {seller: string, buyer: string}) => {
   const supabase = await createClient()

   const {data, error} = await supabase.from("chat_threads_view").select().eq('seller_id', seller).eq('buyer_id', buyer)
   console.log(error)
   if(!data){
      return null
   }

   return data[0] as ChatHead ?? null
}

export const fetchThreads = async() => {
   return (await createClient()).from("chat_threads_view").select()
}

export const createChatThread = async(thread: {buyer_id: string, seller_id: string}) => {
   return (await createClient()).from("chat_threads").insert(thread).select()
}

export const sendMessage = async(message: {text: string, sender_id: string, thread_id: string}) => {
   return (await createClient()).from("chat_messages").insert(message).select()
}