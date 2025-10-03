import { Environment } from "./types";

const env: Environment = {
  currencyOptions: [
    { value: "USD" as const, label: "USD" },
    { value: "UGX" as const, label: "UGX" },
    { value: "KSH" as const, label: "KSH" },
    { value: "TSH" as const, label: "TSH" },
  ],
  pricingSchemes: [
    { value: "fixed", label: "Fixed price" },
    { value: "range" as const, label: "Price Range" },
    { value: "unit" as const, label: "Unit price" },
    { value: "recurring" as const, label: "Recurring price" },
    { value: "menu" as const, label: "Price menu" },
  ],
  subscriptionPlans: {
    hobby: { 
      pricing: "Free", 
      limits: {
        ads: 5,
        stores: 1,
        flashSales: 0,
        adImages: 5,
        storage: 10, // in MB
      },
      features: ["Pro for the first week", "Ad browsing", "Map cruising","In app real time chat", "Upto 5 active ads", "Upto 5 images per ad", "One free store", "Limited POS system" ] 
    },
    pro: {
      pricing: "UGX 30,000", 
      limits: {
        ads: "Unlimited",
        stores: 5,
        flashSales: 5,
        adImages: "Unlimited",
        storage: "Unlimited", // in MB
      },
      features: ["Unlimited active ads", "Upto 5 stores", "Upto 5 flash sales", "One free ad promotion per week", "Pricing promotions", "AI powered mini POS system", "And much more"] 
    },
    entrprise:{ 
      pricing: "Custom", 
      limits: {
        ads: "Unlimited",
        stores: "Unlimited",
        flashSales: "Unlimited",
        adImages: "Unlimited",
        storage: "Unlimited", // in MB
      },
      features: ["Custom features", "Custom pricing", "Priority support", "And much more"] 
    },
  },
  storageUrl: "http://127.0.0.1:54321/storage/v1/object/public/",
  nextUrls: {
    pay: "/dashboard/billing/pay",
    "create-ad": "/dashboard/ads/create",
    "create-store": "/dashboard/stores/create"
  },
  currencies: {
    USD: { symbol: "$", name: "US Dollar", decimal_digits: 2, rounding: 0, code: "USD", name_plural: "US dollars" },
    UGX: { symbol: "USh", name: "Ugandan Shilling", decimal_digits: 0, rounding: 0, code: "UGX", name_plural: "Ugandan shillings" },
    KSH: { symbol: "KSh", name: "Kenyan Shilling", decimal_digits: 2, rounding: 0, code: "KES", name_plural: "Kenyan shillings" },
    TSH: { symbol: "TSh", name: "Tanzanian Shilling", decimal_digits: 0, rounding: 0, code: "TZS", name_plural: "Tanzanian shillings" },
  }
};

export default env;
