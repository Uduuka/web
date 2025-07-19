import { useEffect, useState, useTransition } from "react";
import { Filters, FlashSale } from "../types";
import { fetchFlashsales } from "../actions";
import { useAppStore } from "../store";
import { useParams, useSearchParams } from "next/navigation";

export const useFilteredFlashSales = () =>{
    
    const [flashSales, setFlashSales] = useState<FlashSale[]>([])
    const [error, setError] = useState<string | null>(null)
    const [fetching, startFetching] = useTransition()

     const search = useSearchParams().get('search') as string | undefined
    const {catSlug, subCatSlug} = useParams() as {catSlug?: string, subCatSlug?: string}
    const {location} = useAppStore()

    
    useEffect(()=>{
        startFetching(async()=>{
            const filters = {search, location, category: subCatSlug, subCategory: subCatSlug}
            const { data} = await fetchFlashsales(filters)
            setFlashSales(( data ?? []) as unknown as FlashSale[])
        })
    }, [location, search, subCatSlug, catSlug])
   

    return {flashSales: flashSales.map(s => ({...s, pricing: {...s.ad.pricing, details: {
        initialPrice: s.ad.pricing.details.price,
        price: s.flash_price
    } }})), fetching, error}
}