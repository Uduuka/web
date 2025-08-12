import { useParams, usePathname } from "next/navigation"
import { useEffect, useState, useTransition } from "react"
import { fetchStoreData } from "../actions"
import { Store } from "../types"

export const useDashboardContexts = () => {
    const pathname = usePathname()
    const storeID = useParams()['storeID']

    const [route, setRoute] = useState("")
    const [dashboardData, setDashboardData] = useState()
    

    return {route, dashboardData}
}

export const useStoreData = () => {
    const storeID = useParams()['storeID'] as string

    const [fetching, startFetching] = useTransition()

    const [storeData, setStoreData] = useState<Store>()
    const [error, setError] = useState<string>()

    useEffect(()=>{
        startFetching(async() => {
            const {error, data} = await fetchStoreData(storeID)
            console.log({error, data})
            if(error){
                setError(error.message)
                return
            }

            setStoreData(data)
        })
    }, [storeID])
    
    return {fetching, error, storeData}
}

export const useBradcramps = () => {
    const pathname = usePathname()
    const storeID = useParams()['storeID']

    const [bradcramp, setBradcramp] = useState("")

    useEffect(()=>{
        const page = pathname.split(`dashboard/`)[1]?.split('/')
        setBradcramp(page?.join(" / "))
    }, [pathname])
    
    return { bradcramp}
}