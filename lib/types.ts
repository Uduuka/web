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
  imagesFiles?: File[]
  location: Location
  locationString?: string
  address?: string
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
  quantity?: number;
  units?: string;
  pricings?: Pricing<any>[];
}

export interface AdImage {
  id?: number
  url: string
  ad_id: string
}

export type Scheme = "fixed" | "range" | "menu" | "unit" | "recurring";

export type Currency =  "USD" | "UGX" | "KSH" | "TSH"

export interface Pricing<T> {
  ad_id?: string
  id?: string
  scheme: Scheme
  currency: Currency
  details: T;
  amount: number
  discount?: number
  offers?: any
  flashSale?: FlashPricing
  conversion_rate?: number
}

export interface FixedPrice  {
  
}

export interface UnitPrice {
  units: string;
  conversionFactor: number;
  conversionRatio?: Record<string, string>;
}

export interface PriceRange {
  specs?: Record<string, string>;
  qty: number
}

export interface RecurringPrice {
  period: string;
}

export interface PriceMenu {
  image?: string;
  title: string;
  description?: string;
  qty?: number
}

export type Store = {
  ads: any;
  id: string;
  name: string;
  logo?: string;
  address?: string
  location?: Location
  slug?: string
  is_member?: boolean
  keeper_id: string;
  keeper?: Profile
  phone?: string;
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

export interface FlashSale extends Listing {
    flash_pricings: FlashPricing[]
    expires_at: string
};

export interface FlashPricing {
  amount: number
  expires_at: string
  pricing_id: string
}

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

export interface ChatThread {
  me: Profile
  you: Profile
  messages?: Message[];
}

export interface Message {
  id?: string;
  sender_id: string;
  receiver_id: string
  text: string;
  status?: "sent" | "received" | "read" | "error"
  created_at?: string;
  updated_at?: string;
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
  full_name?: string
  default_address?: string
  location?: Location
  conections?: any[]
  name?: string
  avatar_url?: string
  about?: string
  subscription?: Subscription
}

interface Subscription{
  plan?: "hobby"| "pro"| "entreprise"
  pricing?: "Free" | "UGX 30,000" | "Custom"
  features?: string[]
  expires_at?: string
  usage?: Record<string, number>
  limits?: Record<string, number | string>
}

export interface Unit {
  id: string
  name: string
  abbr: string
  plural: string
  sub_units?: SubUnit[]
}

export interface SubUnit {
  id: string
  name: string
  base_unit?: string
  abbr: string
  plural: string
  conversion_factor: number
}

export interface Environment{
  currencyOptions: Record<string, string>[]
  pricingSchemes: Record<string, string>[]
  subscriptionPlans: Record<string, Subscription>
  storageUrl: string
  nextUrls: Record<string, string>
  currencies: any
}

export interface CartItem{
  id: number
  ad: CartAd
  aqty: number
  qty: number | string
  sn?: string
  units: string
  period?: string
  store: Store
  pricing: Pricing<any>
  subTotal: Pricing<FixedPrice>
  specs: Record<string, any>
}

export interface GroupedResult<T> {
  [key: string]: T[];
}

export interface Cart {
  items: CartItem[]
  store?: Store
  total: number
  clearCart?: ()=> void
  addItem?: (item: CartItem) => void
  deleteItem?: (item: CartItem) => void
  updateItem?: (item: CartItem) => void
 }

export interface CartAd {
    id: string
    title: string,
    description: string
  }

export interface ExchangeRate {
  code: Currency
  rate: number
}

export interface OrderItem{
  pricing_id: string,
  quantity: number,
  units: string,
}

export interface Order {
  p_store_id: string,
  p_received?: number,
  p_desired_currency: Currency,
  p_buyer_id?: string,
  p_phone?: string
  p_method: 'cash'| 'mtn'| 'airtel'
  p_order_items: OrderItem[]
  p_amount: number
  p_type: "local" | "remote"
  p_status: "pending" | "inquiry" | "completed"
  p_message?: string
  p_deliver_to?: any
}

export interface StoreOrder {
  id?: string
  store: Store
  received: number
  currency: Currency
  buyer_id: string
  buyer: Profile
  phone?: string
  method: 'cash' | 'mtn' | 'airtel'
  items: any[]
  amount: number
  type: "local" | "remote"
  date: string
  status: string
  message?: string
  delivery_address?: string
}

export interface AccountProvider{
    account_number: string
    provider_name: string
    account_name: string
    currency: Currency
  }

export interface Account {
  id: string
  user_id: string
  created_at?: string
  updated_at?: string
  user?: Profile
  providers: AccountProvider[]
}
