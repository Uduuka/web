import { useEffect, useState, useTransition } from "react";
import { Listing } from "../types";
import { fetchAds } from "../actions";
import { useParams, useSearchParams } from "next/navigation";
import env from "../env";

export const useFilteredAds = (storeID?: string ) =>{
    
    const [ads, setAds] = useState<Listing[]>()
    const [error, setError] = useState<string | null>(null)
    const [fetching, startFetching] = useTransition()

    const search = useSearchParams().get('search') as string | undefined
    const {catSlug, subCatSlug} = useParams() as {catSlug?: string, subCatSlug?: string}

    
    useEffect(()=>{
        startFetching(async()=>{
            const currency_code = env.currencies['UGX'].code
           
            const filters = {search, location, category: catSlug, subCategory: subCatSlug, storeID}
            const {error, data} = await fetchAds(filters, currency_code)
            setAds(( data ?? []) as Listing[])
            setError(error?.message ?? null)
        })
    }, [search, catSlug, subCatSlug, storeID])
   
    return {ads, fetching, error}
}