import { useEffect, useState, useTransition } from "react";
import { Listing } from "../types";
import { fetchAds } from "../actions";
import { useParams, useSearchParams } from "next/navigation";
import { useAppStore } from "../store";

export const useFilteredAds = () =>{
    const search = useSearchParams().get("search") as string | undefined
    const {catSlug, subCatSlug}: {catSlug?: string, subCatSlug?: string} = useParams()

    const [ads, setAds] = useState<Listing[]>([])
    const [error, setError] = useState<string | null>(null)
    const [fetching, startFetching] = useTransition()

    const {location} = useAppStore()

    useEffect(()=>{
        startFetching(async()=>{
            const {error, data} = await fetchAds({search, category: catSlug, subCategory: subCatSlug, location})
            setAds(( data ?? []) as Listing[])
            setError(error?.message ?? null)
        })
    }, [search, catSlug, subCatSlug, location])

    return {ads, fetching, error}
}