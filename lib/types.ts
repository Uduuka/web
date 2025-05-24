export interface User {
  id: string;
  email: string;
  phone?: string;
  avarta?: string;
  username?: string;
  token?: string;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface Listing {
  id: string;
  category_id?: string;
  sub_category_id?: string;
  title: string;
  description?: string;
  price?: number;
  currency: string;
  image: string;
  images?: string[];
  originalPrice?: number;
  pricingScheme?: "fixed" | "recurring" | "range" | "menu" | "unit";
  coordinates?: Location;
  distance?: string;
  period?: "hour" | "day" | "week" | "month" | "year";
  units?: string;
  views?: number;
  reviews?: Review[];
  likes?: number;
  dislikes?: number;
  rating?: number;
  ratings?: number;
  storeName?: string;
  storeId?: string;
  isNew?: boolean;
  isFeatured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  priceMenu?: MenuItem[];
  store_id?: string;
  store?: Store;
  category?: Category;
  subCategory?: SubCategory;
}

export interface Pricing<T> {
  scheme: "fixed" | "recurring" | "range" | "menu" | "unit";
  details: T;
}

export interface FixedPrice {
  price: string;
  initialPrice?: string;
}

export interface UnitPrice {
  price: string;
  initialPrice?: string;
  units: string;
}

export interface PriceRange {
  minPrice: string;
  maxPrice?: string;
  initialMinPrice?: string;
  initialMaxPrice?: string;
}

export interface RecurringPrice {
  price: string;
  initialPrice?: string;
  period: string;
}

export interface PriceMenu {
  items: MenuItem[];
}

export type Store = {
  id: string;
  name: string;
  logo?: string;
  rating?: number;
  ratings?: number;
  description?: string;
  categories?: Category[];
  distance?: number;
  status?: "verified" | "official";
  items?: Listing[];
};

export type Time = {
  hours: string;
  minutes: string;
  seconds: string;
  total: number;
};

export type FlashSale = {
  id: string;
  start: Date;
  duration: number; // in minutes
  ad: Listing;
  flashPrice: number;
  info?: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  adsCount?: number;
  subCategories?: SubCategory[];
};

export type SubCategory = {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  category?: Category;
  adsCount?: number;
};

export interface Error {
  code: string;
  message: string;
}

export interface MenuItem {
  image?: string;
  title: string;
  description?: string;
  price: string;
  initialPrice?: string
}

export interface Filters {
  q?: string; // Search query
  d?: string | number; // Distance
  r?: string; // Price range
  rt?: string | number; // Rating
  c?: string; // Category
  sc?: string; // SubCategory
  search?: string;
}

export type AdDetail = [item: string, value: string];

export interface Review {
  id: string;
  ad_id: string;
  reviewer: User;
  created_ad?: string;
  updated_at?: string;
  trashed_at?: string;
  deleted_at?: string;
  message: string;
  ad?: Listing;
  replies?: ReviewReply[];
}

export interface ReviewReply {
  id: string;
  review_id: string;
  replier_id: string;
  message: string;
  created_ad?: string;
  updated_at?: string;
  trashed_at?: string;
  deleted_at?: string;
}

export interface ChatHead {
  ad_id: string;
  seller_id: string;
  buyer_id: string;
  messages?: Message[];
  created_ad?: string;
  updated_at?: string;
  trashed_at?: string;
  deleted_at?: string;
}

export interface Message {
  id: string;
  sender: string;
  receiver: string;
  text: string;
  created_ad?: string;
  updated_at?: string;
  trashed_at?: string;
  deleted_at?: string;
}
