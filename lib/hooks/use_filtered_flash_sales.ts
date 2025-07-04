import { useEffect, useState, useTransition } from "react";
import { FlashSale } from "../types";
import { fetchFlashsales } from "../actions";
import { useParams, useSearchParams } from "next/navigation";
import { useAppStore } from "../store";

export const useFilteredFlashSales = () =>{
    const search = useSearchParams().get("search") as string | undefined
    const {catSlug, subCatSlug}: {catSlug?: string, subCatSlug?: string} = useParams()

    const [flashSales, setFlashSales] = useState<FlashSale[]>([])
    const [error, setError] = useState<string | null>(null)
    const [fetching, startFetching] = useTransition()

    const {location} = useAppStore()

    useEffect(()=>{
        startFetching(async()=>{
            const {error, data} = await fetchFlashsales({search, category: catSlug, subCategory: subCatSlug, location})
            setFlashSales(( data ?? []) as unknown as FlashSale[])
            setError(error?.message ?? null)
        })
    }, [search, catSlug, subCatSlug])
   

    return {flashSales: flashSales.map(s => ({...s, pricing: {...s.ad.pricing, details: {
        initialPrice: s.ad.pricing.details.price,
        price: s.flash_price
    } }})), fetching, error}
}