import { User } from "@supabase/supabase-js";


export interface Location {
  coordinates: [number, number];
  latitude: number;
  longitude: number;
}

export interface Listing {
  id: string;
  category_id?: string;
  sub_category_id?: string;
  title: string;
  description?: string;
  image: AdImage;
  images?: AdImage[];
  location: Location
  pricing: Pricing<any>
  latitude?: number
  longitude?: number
  seller_id: string
  seller?: Profile
  views?: number;
  coordinates?: Location;
  distance?: string;
  reviews?: Review[];
  likes?: number;
  dislikes?: number;
  rating?: number;
  ratings?: number;
  storeName?: string;
  storeId?: string;
  isNew?: boolean;
  isFeatured?: boolean;
  store_id?: string;
  store?: Store;
  category?: Category;
  subCategory?: SubCategory;
  specs?: object
}

export interface AdImage {
  url: string,
  ad_id: string
}

export type Currency =  "USD" | "UGX" | "KSH" | "TSH"

export interface Pricing<T> {
  scheme: "fixed" | "recurring" | "range" | "menu" | "unit";
  currency: Currency
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
  address?: string
  location?: Location
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
  pricing: Pricing<FixedPrice>
  info?: string;
  flash_price: string
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  adsCount?: number;
  sub_categories?: SubCategory[];
  default_specs?: string
};

export type SubCategory = {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  category?: Category;
  adsCount?: number;
  default_specs?: string
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
  search?: string;
  category?: string
  subCategory?: string
  location: Location | null
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
  id?: string
  ad_id: string;
  title: string
  seller_id: string;
  seller: Profile
  buyer: Profile
  buyer_id: string;
  messages?: Message[];
  created_ad?: string;
  updated_at?: string;
  trashed_at?: string
  deleted_at?: string;
}

export interface Message {
  id?: string;
  sender_id: string;
  text: string;
  thread_id?: string
  created_at?: string;
  updated_at?: string;
  trashed_at?: string;
  deleted_at?: string;
}

export interface BoundingBox {
  min_lat: number;
  min_lon: number;
  max_lat: number;
  max_lon: number;
}

export interface Profile {
  user_id: string
  email: string
  phone: string | null
  full_names?: string
  username?: string
  profile_pic?: string
  about?: string
}
