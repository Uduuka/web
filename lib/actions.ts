"use server";
import { AuthError } from "@supabase/supabase-js";
import env from "./env";
import { createClient } from "./supabase/server";
import { ChatHead, Currency, Filters, Order, Pricing, Profile } from "./types";

export const signup = async({email, password, profile} : {email: string, password: string, profile?: object}) => {
   return (await createClient()).auth.signUp({email, password, options: {data: profile ?? {}}})
}

export const signin = async({email, password} : {email: string, password: string}) => {
   return (await createClient()).auth.signInWithPassword({email, password})
}

export const resendVerificarionEmail = async(email: string) => {
   return await (await createClient()).auth.resend({
      type: "signup",
      email,
   })
}

export const  sendPasswordResetEmail = async(email: string) => {
   return ( await createClient()).auth.resetPasswordForEmail(
      email,
      {
         redirectTo: "http://localhost:3000/reset-password", // Optional: URL to redirect after clicking the reset link
      }
   );
}

export const updateUserPassword = async(newPassword: string) => {
   return (await createClient()).auth.updateUser({
      password: newPassword,
    });
}

export const getUser = async() =>{
   return (await createClient()).auth.getUser()
}

export const createOrUpdateProfile = async(data: Profile) => {
   return (await createClient()).from("profiles").upsert(data).select().single()
}

export const getProfile = async(uid?: string) => {
   let userID = uid

   const {data: {user}, error: userError} = await getUser()
   if(!userID){
      userID = user?.id
      
   }

   if(!userID){
      return {
         error: {message: "Missing user gredentials"} as AuthError,
         data: null
      }
   }
   
   const {data, error} =  await (await createClient()).from('profiles').select("*, subscription:subscriptions(*)").eq('user_id', userID)

   if(data && data.length === 1){
      return {data: {...data[0], email: user?.email, phone: user?.phone, avatar_url: data[0].avatar_url ?? user?.user_metadata.avatar_url} as Profile, error: null}
   }

   return {error, data: null}
   
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

export const fetchAds = async(filters: any, currency: Currency) => {
   const supabase = createClient()
   
   const {location} = filters

   let query
   if(location){
      query = (await supabase).rpc('fetch_ads_by_currency', {lat: location.latitude, lon: location.longitude, desired_currency: currency})
   }else{
      query = (await supabase).from("ads_list_view").select("*")
   }

   // Filter by search
   if(filters.search){
      query = query.or(`title.ilike.%${filters.search}%, description.ilike.%${filters.search}%, category_id.ilike.%${filters.search}%, sub_category_id.ilike.%${filters.search}%`)
   }

   // Filter by store id
   if(filters.storeID){
      query = query.eq('store_id', filters.storeID)
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

export const fetchPersonalAds = async({store_id}: any)=>{
   const supabase = await createClient();
   const {data} = await supabase.auth.getUser();

   let query = supabase.from("ads_list_view").select("*, pricings(*), images:ad_images(url)").eq("seller_id", data.user?.id)

   if(store_id){
      query = query.eq('store_id', store_id)
   }else if(store_id === null){
      query = query.is("store_id", null)
   }

   return await query;
}

export const fetchAd = async(id: string) => {
   return(await createClient()).from("ads").select("*, seller:profiles(*), pricings(*), images:ad_images(*), store:stores(*)").eq('id', id).single()
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

export const postAd = async(ad: any) => {
   return (await createClient()).from("ads").insert(ad).select("id").single()
}

export const postPricing = async(pricings: Pricing<any>[]) => {
   return (await createClient()).from("pricings").insert(pricings).select()
}

export const uploadFiles = async(files: File[], backetName: string, folderName: string) => {
   const supabase = await createClient()
   const base_url = process.env.NEXT_PUBLIC_SUPABASE_URL
  
      const uploadPromises = Array.from(files).map(async(file) => {
         const filePath = `${folderName}/${file.name}`
         const {data, error} = await supabase.storage.from(backetName).upload(filePath, file,{
            cacheControl: '3600',
            upsert: true
         })

         if(error){
            return {error: `${file.name} failed to upload, ${error.message}`}
         }
         // https://mqistandrulavcbncpwn.supabase.co/storage/v1/object/public/ads/30/online-is-beter.avif
         // http://127.0.0.1:54321/storage/v1/object/public/ads/114/logo-colored.png

         return {url: `${base_url}/storage/v1/object/public/${data.fullPath}`}

      })

      return await Promise.all(uploadPromises)
   
}

// Batch upload helper with progress tracking
type UploadObject = {
   bucketName: string,
   folderPath: string,
   files: File[],
   batchSize: number
}
export const batchUploadFiles = async ({
   bucketName,
   folderPath,
   files,
   batchSize = 3, // Number of concurrent uploads
 }: UploadObject) => {
   // Total files to upload
   const totalFiles = files.length
   let uploadedFiles = 0
   let failedFiles = 0
   const results = []
   const supabase = await createClient()
   
   // Process files in batches
   for (let i = 0; i < totalFiles; i += batchSize) {
     const batch = Array.from(files).slice(i, i + batchSize)
     
     // Create upload promises for this batch
     const batchPromises = batch.map(async file => {
       const filePath = `${folderPath}/${file.name}`
       const result = await supabase
           .storage
           .from(bucketName)
           .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false
           });
        // Track progress
        if (result.error) {
           failedFiles += 1;
         }else{
            uploadedFiles += 1;
        }
        return {
           fileName: file.name,
           fileUrl: result.data?.fullPath ? env.storageUrl + result.data.fullPath : undefined,
           ...result
        };
     })
     
     // Wait for this batch to complete before starting the next
     const batchResults = await Promise.all(batchPromises)
     results.push(...batchResults)
   }
   
   return {
     success: failedFiles === 0,
     totalFiles,
     uploadedFiles,
     failedFiles,
     results
   }
 }

export const createAdImages = async(images: {url: string, ad_id: string, is_default: boolean}[]) => {
return ((await createClient()).from("ad_images").insert(images).select())
}

export const updateAd = async(id: string, fields: object) => {
 return (await createClient()).from("ads").update(fields).eq("id", id)
}

export const updateMultipleAds = async(ids: string[], fields: object) => {
   return (await createClient()).from("ads").update(fields).in("id", ids)
}

export const deleteImages = async(paths: string[]) => {
   return (await createClient()).storage.from('ads').remove(paths)
}

export const fetchUnits = async() => {
   const supabase = await createClient()
   return await supabase.from("base_units").select("id, name, abbr, plural, sub_units(id, name, abbr, conversion_factor)")
}

export const fetchSubscriptions = async()=>{
   const supabase = await createClient()
   const {data: {user}} = await supabase.auth.getUser()
   const subs = await supabase.from("subscriptions").select("plan, expires_at").eq("user_id", user?.id)
   const adsCount = await supabase.from("ads").select("count").eq("seller_id", user?.id)
   
   if(subs.error || adsCount.error){
      return {
         subscription: null,
         adsCount: null,
         usage: {
            ads: 0,
            stores: 0, // Assuming you will fetch stores count later
            flashSales: 0, // Assuming you will fetch flash sales count later 
            adImages: 0, // Assuming you will fetch ad images count later
            storage: 0
         },
         error: subs.error || adsCount.error
      }
   }

   const usage = {
      ads: adsCount.data[0].count,
      stores: 1, // Assuming you will fetch stores count later
      flashSales: 0, // Assuming you will fetch flash sales count later
      adImages: 0, // Assuming you will fetch ad images count later
      storage: 2
   }


   return {
      subscription: subs.data[0],
      adsCount: adsCount.data[0].count,
      usage
   }
   
}

export const requestToPay = async(data: object) => {
      return (await createClient()).from("payement_requests").insert(data).select("id, created_at")
}

export const fetchPersonalStores = async()=>{
   const supabase = await createClient()
   const {data: {user}} = await supabase.auth.getUser()

   return await supabase.from("stores").select("*").eq("keeper_id", user?.id)
}

export const fetchStoreData = async(storeID: string) => {
   return (await createClient()).from("store_data").select('*').eq('id', storeID).single()
}

export const createStore = async(data: object) =>{
   return (await createClient()).from("stores").insert(data)
}

export const fetchStoreAds = async(storeID: string) => {
   return (await createClient()).from("ads_list_view").select("*, pricings(*)").eq("store_id", storeID)
}

export const fetchStores = async() => {
   return (await createClient()).from("store_data").select("*")
}

export const getExcahngeRate = async() => {
   return (await createClient()).from("currency_rates").select("rate, code").in('code', [...env.currencyOptions.map(co => co.value)])
}
 
export const fetchCurrencyRates = async(rates: Currency[]) => {
   return (await createClient()).from("currency_rates").select("code,rate").in('code', rates)
}

export const placeOrder = async(order: Order) => {
   return (await createClient()).rpc('place_order', order)
}

