import { useEffect, useState } from "react";
import { Unit } from "../types";

export default function useConversionFactor(filteredUnit?: Unit, adUnits?: string, newUnits?: string) {
  
 const [conversionFactor, setConversionFactor] = useState<number>();

 useEffect(()=>{
    
    // If no filtered unit or adUnits or newUnits, reset conversion factor
    if (!filteredUnit || !adUnits || !newUnits) {
        setConversionFactor(undefined);
        return;
    }

    // If adUnits and newUnits are the same, set conversion factor to 1
    if(adUnits === newUnits) {
        setConversionFactor(1);
        return;
    }

    // If filtered unit's abbreviation matches newUnits, find the sub-unit with adUnits as abbreviation
    if(filteredUnit.abbr === newUnits ){
        const subUnit = filteredUnit.sub_units?.find(sub => sub.abbr === adUnits);
        setConversionFactor(subUnit?.conversion_factor);
        return;
    }
    
    // Otherwise, find the sub-unit with newUnits as abbreviation
    const subUnit = filteredUnit.sub_units?.find(sub => sub.abbr === newUnits);
    setConversionFactor(subUnit?.conversion_factor);

 }, [filteredUnit, adUnits, newUnits]);
 
 return {conversionFactor}
}