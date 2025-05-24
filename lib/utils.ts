import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

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
  if (ad_currency.toUpperCase()! in acceptedCurrencies)
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
