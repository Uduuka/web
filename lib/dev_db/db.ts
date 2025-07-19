
import { createClient as old } from "@supabase/supabase-js";
import { AdImage, Category, Message, Store, SubCategory } from "../types";
import { fetchCategories } from "../actions";
import { createClient } from "../supabase/client";


export const stores: Store[] = [
  {
    id: "1",
    name: "Best electronics Store 1",
    description:
      "A really really long description of the store describing its products and services.",
    logo: "",
  },
  {
    id: "2",
    name: "A realy realy long store name like, Store 1",
    logo: "",
  },
  {
    id: "3",
    name: "Store 1",
    logo: "",
  },
  {
    id: "4",
    name: "Store 1",
    logo: "",
  },
  {
    id: "5",
    name: "Store 1",
    logo: "",
  },
  {
    id: "6",
    name: "Store 1",
    logo: "",
  },
  {
    id: "7",
    name: "Store 1",
    logo: "",
  },
];

export const messages: Message[] = [
 
];

export const fetchAds = async() => {
  const supabase  = old(
    "https://sqcidocbglgivrlysuhq.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxY2lkb2NiZ2xnaXZybHlzdWhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY5ODMwODMsImV4cCI6MjAyMjU1OTA4M30.XeNd2mZiexnISYKXKh8vzq3QRIsdL6QbV1dTHACfXpQ"
  )

  const {error, data} = await supabase.from('ads').select("*, ad_images(url), category:categories(name, slug), sub_category:sub_categories(name, slug)")

  if(!data){
    console.log(error)
    return
  }

  data.forEach(async(ad) => {
    
    const {id, name, description, price, pricing_scheme, min_price, max_price, status, ad_details, category, sub_category, location, address, default_currency, ad_images} = ad
    const {error, data} = await fetchCategories()
    if(!data){
      console.log("failed to fetch categories")
      return
    }
    let cate: Category | null, sub_cate: SubCategory | null
    if(category){
      cate = data.find(cat => cat.slug === category.slug) ?? null
      sub_cate = cate?.sub_categories!.find(sb => sb.slug === sub_category?.slug) ?? cate?.sub_categories!.find(sb => sb.slug) ?? null
    }else if(sub_category){
      cate = data.find(cat => {
        const slugs = (cat.sub_categories as SubCategory[]).map((sb) => sb.slug)
        return slugs.includes(sub_category.slug)
      })
      sub_cate = cate?.sub_categories?.find(sb => sb.slug === sub_category.slug) ?? null
    }else{
      cate = null
      sub_cate = null
    }

    if(!cate || !sub_cate){
      console.log("Missing category or sub_category", {cate, sub_cate})
      return
    }

    let pricing: any = {
      
    }

    switch(pricing_scheme){
      case 'fixed price':
        pricing= {
          scheme: "fixed",
          currency: default_currency,
          details: {
            price
          }

        } 
        break;

      case 'price range':
        pricing= {
          scheme: "range",
          currency: default_currency,
          details: {
            min_price,
            max_price
          }

        }
        
        break;

      case "price menu":
        pricing = {
          scheme: "menu",
          currency: default_currency,
          details: {
            items: (await supabase.from("menu_items").select().eq('ad_id', id)).data
          }

        }

        break;

      case "periodic price":
        pricing = {
          scheme: "recurring",
          currency: default_currency,
          details: {
            price,
            period: "Month"
          }

        }

        break;

      default: break;
    }
  
    const newAd = {
      title: name,
      description,
      category_id: cate?.slug,
      sub_category_id: sub_cate?.slug,
      location: location ? `POINT(${location.coordinates[0]} ${location.coordinates[1]})`: null,
      // address,
      // status,
      specs: ad_details ? JSON.parse((ad_details as string).replaceAll(" ", "")) : {}
    }

    const insert = await createClient().from("ads").insert(newAd).select("id")
    console.log({insert})
    if(!insert.data){
      return
    }

    const newAdId = insert.data[0].id

    const pricingInsert = await createClient().from("pricings").insert({...pricing, ad_id: newAdId})
    console.log({pricingInsert})

    const imagesIsert = await createClient().from("ad_images").insert(((ad_images as AdImage[]).map(img => ({url: img.url.startsWith("/images/ads") ?`https://uduuka.com${img.url}`: img.url, ad_id: newAdId}))))
    console.log({imagesIsert})
  })
}

export const testView = async() => {
  navigator.geolocation.getCurrentPosition(async(pos)=>{
    console.log(pos)
    if(!pos.coords){
      return
    }
    const res = await createClient().rpc('test_view', {lat: pos.coords.latitude, lon: pos.coords.longitude})
    console.log(res)
  }, (err)=>{
    console.log(err)
  })
}

