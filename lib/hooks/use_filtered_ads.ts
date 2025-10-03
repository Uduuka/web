import { useEffect, useState, useTransition } from "react";
import { Listing } from "../types";
import { fetchAds } from "../actions";
import { useParams, useSearchParams } from "next/navigation";
import { useAppStore } from "../store";
import env from "../env";

export const useFilteredAds = (storeID?: string ) =>{
    
    const [ads, setAds] = useState<Listing[]>()
    const [error, setError] = useState<string | null>(null)
    const [fetching, startFetching] = useTransition()

    const search = useSearchParams().get('search') as string | undefined
    const {catSlug, subCatSlug} = useParams() as {catSlug?: string, subCatSlug?: string}
    const {location, currency} = useAppStore()
    
    useEffect(()=>{
        startFetching(async()=>{
            const currency_code = env.currencies[currency].code
           
            const filters = {search, location, category: catSlug, subCategory: subCatSlug, storeID}
            const {error, data} = await fetchAds(filters, currency_code)
            setAds(( data ?? []) as Listing[])
            setError(error?.message ?? null)
        })
    }, [search, location, catSlug, subCatSlug, storeID, currency])
   
    return {ads, fetching, error}
}