import { useEffect, useState, useTransition } from "react";
import { Listing } from "../types";
import { fetchAds, fetchStoreAds } from "../actions";
import { useParams, useSearchParams } from "next/navigation";
import { useAppStore } from "../store";

export const useFilteredAds = (storeID?: string ) =>{
    
    const [ads, setAds] = useState<Listing[]>()
    const [error, setError] = useState<string | null>(null)
    const [fetching, startFetching] = useTransition()

    const search = useSearchParams().get('search') as string | undefined
    const {catSlug, subCatSlug} = useParams() as {catSlug?: string, subCatSlug?: string}
    const {location} = useAppStore()
    
    useEffect(()=>{
        startFetching(async()=>{
            const filters = {search, location, category: catSlug, subCategory: subCatSlug, storeID}
            const {error, data} = await fetchAds(filters)
            setAds(( data ?? []) as Listing[])
            setError(error?.message ?? null)
        })
    }, [search, location, catSlug, subCatSlug, storeID])

    return {ads, fetching, error}
}