const env = {
  currencyOptions: [
    { value: "USD" as const, label: "USD" },
    { value: "UGX" as const, label: "UGX" },
    { value: "KSH" as const, label: "KSH" },
    { value: "TSH" as const, label: "TSH" },
  ],
  pricingSchemes: [
    { value: "fixed" as const, label: "Fixed price" },
    { value: "range" as const, label: "Price Range" },
    { value: "unit" as const, label: "Unit price" },
    { value: "recurring" as const, label: "Recurring price" },
    { value: "menu" as const, label: "Price menu" },
  ],
};

export default env;
