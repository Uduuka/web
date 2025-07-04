import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";
import axios from "axios";
import { Location } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const responsiveColumns = <T>(arr: T[]): T[][] => {
  const getScreenWidth = (): number => window.innerWidth;

  const splitSequentiallyBasedOnWidth = (width: number): T[][] => {
    let numSubArrays: number;
    if (width >= 1200) {
      numSubArrays = 4;
    } else if (width >= 768) {
      numSubArrays = 3;
    } else {
      numSubArrays = 2;
    }

    const result: T[][] = Array.from({ length: numSubArrays }, () => []);
    for (let i = 0; i < arr.length; i++) {
      result[i % numSubArrays].push(arr[i]);
    }
    return result;
  };

  // Initial split on load
  let currentSubArrays = splitSequentiallyBasedOnWidth(getScreenWidth());

  return currentSubArrays;
};

export const numberOrUndefine = (str?: string) =>
  isNaN(parseInt(str ?? "")) ? undefined : parseInt(str ?? "");

export const toNumber = (st: string) =>
  isNaN(parseInt(st)) ? 0 : parseInt(st);

export function toMoney(money: string): string {
  const [whole, decimal] = money.split(".");
  if (isNaN(Number(money.replaceAll(",", "")))) return "";
  return `${whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}${
    decimal ? `.${decimal}` : ""
  }`;
}

export const displayCurrencyAndPrice = (
  ad_currency: string,
  currency: string,
  price: string
) => {
  // console.log(ad_currency, currency, price)
  const acceptedCurrencies = ["USD", "UGX", "KSH", "TSH"];
  if (ad_currency?.toUpperCase() in acceptedCurrencies)
    return "Unsupported currency";
  if (currency === ad_currency)
    return `${currency.toUpperCase()} ${toMoney(toNumber(price).toFixed(2))}`;
  const exchangeRate: any = {
    USD: 1,
    UGX: 3720,
    KSH: 124,
    TSH: 2067,
  };
  if (ad_currency === "USD")
    return `${currency} ${toMoney(
      (toNumber(price) * exchangeRate[currency]).toFixed(2)
    )}`;

  return `${currency} ${toMoney(
    (
      (toNumber(price) / exchangeRate[ad_currency]) *
      exchangeRate[currency]
    ).toFixed(2)
  )}`;
};

export const prettyDistance = (dist_metters?: number) => {
  if(!dist_metters) return "Unknown distance"
  if(dist_metters < 1000) return `${dist_metters.toFixed(2)} M away`
  return `${(dist_metters/1000).toFixed(2)} km away`
}

/**
 * Do reverse geo-coding given the coordinates
 */
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
