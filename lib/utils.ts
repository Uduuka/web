import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";
import axios from "axios";
import { CartItem, Currency, FixedPrice, GroupedResult, Location, Pricing } from "./types";
import _ from "lodash";
import env from "./env";
import { fetchCurrencyRates } from "./actions";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const responsiveColumns = <T>(arr: T[], containerWidth: number): T[][] => {
  const splitSequentiallyBasedOnWidth = (width: number): T[][] => {
    let cols = toNumber((width/300).toFixed(0))
    cols = cols > 2 ? cols : 2;
    const result: T[][] = Array.from({ length: cols }, () => []);
    for (let i = 0; i < arr.length; i++) {
      result[i % cols].push(arr[i]);
    }
    return result;
  };

  // Initial split on load
  let currentSubArrays = splitSequentiallyBasedOnWidth(containerWidth);

  return currentSubArrays;
};

export const numberOrUndefine = (str?: string) =>
  isNaN(parseInt(str ?? "")) ? undefined : parseInt(str ?? "");

export const toNumber = (st?: string) =>
  isNaN(Number(st)) ? 0 : Number(st);

export function toMoney(money: string, currency?: Currency): string {
  let num = money
  if(currency){
    num = pretifyMoney(Number(`${money}`), currency)
  }
  return Number(num).toLocaleString("en-US");
}

export const prettyDistance = (dist_metters?: number) => {
  if(!dist_metters) return "Unknown distance"
  if(dist_metters < 1000) return `${dist_metters.toFixed(2)} M away`
  return `${(dist_metters/1000).toFixed(2)} km away`
}

export const geoCode = async() => {
  try {
    const res = await axios.get("http://ip-api.com/json/?fields=8450047")
    return res.data
          
  } catch (error) {
    console.log("Failed to reverse geo-code, ", error)
    return 
  }
}

// Haversine formula to calculate distance between two points (in kilometers)
export const calculateDistance = (
  point1: Location,
  point2: Location
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((point2.latitude - point1.latitude) * Math.PI) / 180;
  const dLon = ((point2.longitude - point1.longitude) * Math.PI) / 180;
  const lat1 = (point1.latitude * Math.PI) / 180;
  const lat2 = (point2.latitude * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

// Function to fetch driving distance using Mapbox Directions API
export const fetchDrivingDistance = async (
  start: Location,
  end: Location,
  token?: string | null
): Promise<string | undefined> => {
  try {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?access_token=${token}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.routes && data.routes.length > 0) {
      // Distance is returned in meters, convert to kilometers
      return String((data.routes[0].distance / 1000).toFixed(2));
    }
    return;
  } catch (err) {
    console.error('Error fetching driving distance:', err);
    return;
  }
};

export const getRedirectUrl = () => {
  let redirectTo =
      process.env.NEXT_PUBLIC_SITE_URL ??
      process.env.NEXT_PUBLIC_VERCEL_URL ??
      "http://localhost:3000";
    redirectTo = redirectTo.startsWith("http")
      ? redirectTo
      : `https://${redirectTo}`;
    redirectTo = redirectTo.endsWith("/")
      ? `${redirectTo}auth`
      : `${redirectTo}/auth`;

  return redirectTo
}

export const calcCartItemSubTotal = (pricing: Pricing<any>, quantity?: number) => {

  let qty = quantity
  if(!qty || qty===0){
    qty = 1
  }

  const {scheme, details, currency, flashSale, discount, conversion_rate} = pricing
  // Scheme one of fixed - price, recurying - price, unit - price, menu - price, range - price

  const schemesWithPrice = ["fixed", "recurring", "menu", "unit", "range"]
  if(schemesWithPrice.includes(scheme)){
    const price = pricing.amount
    const discountedAmount = flashSale && flashSale.amount > 0 ? flashSale.amount : discount ?  price - discount : price
    const amount = qty * discountedAmount
    const amountPricing: Pricing<FixedPrice> = {
      currency,
      details,
      scheme: 'fixed',
      amount,
      conversion_rate
    }

    return amountPricing
  }else{
    throw new Error("Unkown pricing scheme")
  }

}

export const calcCartTotal = (items: CartItem[]) => {
  const subTotals = items.map((item) =>
    Number(item.subTotal.amount)
  );
  
  return subTotals?.reduce((t, i) => t + i, 0)
}

// Function to check if a list contains a specific object
export function containsObject<T>(list: T[], target: T): boolean {
  return _.some(list, (item) => _.isEqual(item, target));
}

export const forex = async (pricings: Pricing<any>[], currency: Currency) => {
  
  const ad_currency = env.currencies.find((c: any) => c.code === pricings[0]?.currency || c.symbol === pricings[0]?.currency)?.code;
  const desired_currency = env.currencies.find((c: any) => c.code === currency || c.symbol === currency)?.code;
  
  if (!ad_currency) return pricings;
  if(ad_currency === desired_currency){
    return pricings
  }

  try {
    const { data: ratesData } = await fetchCurrencyRates(
      [ad_currency, desired_currency]
    );
    
    const fromRate =
      (ratesData?.find((r) => r.code === ad_currency)
        ?.rate as number) ?? 1;
    const toRate =
      (ratesData?.find((r) => r.code === desired_currency)
        ?.rate as number) ?? 1;

    const convertedPricings = pricings?.map((pricing) => {
      return {
        ...pricing,
        desired_currency,
        amount: pricing.amount * (toRate / fromRate),
        discount: pricing.discount ? pricing.discount * (toRate / fromRate) : undefined,
        flashSale: pricing.flashSale
          ? {
              ...pricing.flashSale,
              amount: pricing.flashSale.amount * (toRate / fromRate),
            }
          : undefined,
      };
    });

    return convertedPricings
  } catch (error) {
    console.log("Failed to convert currency, ", error)
    return pricings
  }
}

export function groupBy<T>(array: T[], keyFn: (obj: T) => string): GroupedResult<T> {
  return array.reduce((acc, obj) => {
    const key = keyFn(obj);
    acc[key] = acc[key] || [];
    acc[key].push(obj);
    return acc;
  }, {} as GroupedResult<T>);
}

export const pretifyMoney = (money: number, currency: Currency) => {
  const numDp = ["UGX", "TSH"].includes(currency) ? 0 : 2;

  return money.toFixed(numDp);
};

