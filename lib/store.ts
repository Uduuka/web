import { create } from "zustand";
import { Location, Filters, ChatHead, Currency, Profile, Cart, CartItem, ExchangeRate, Store } from "./types";
import { User } from "@supabase/supabase-js";
import _ from "lodash";
import { calcCartTotal } from "./utils";

interface AppState {
  currency: Currency;
  loading?: boolean,
  user: User | null;
  profile: Profile| null
  location: Location | null;
  filters?: Filters;
  chatHeads?: ChatHead[];
  activeChatHead?: ChatHead
  deviceWidth?: number
  cart: Cart
  setCart?: (cart: Cart)=>void
  setDeviceWidth: (width: number) => void;
  setCurrency: (currency: Currency) => void;
  setLoading: (loading: boolean) => void,
  setUser: (user: User | null) => void;
  setProfile: (profile:Profile | null) => void
  setLocation: (location: Location | null) => void;
  clearLocation: () => void;
  setfilters: (st: Filters) => void;
  setChatHeads: (heads?: ChatHead[]) => void;
  setActiveChatHead: (head?: ChatHead) => void
}

export const useAppStore = create<AppState>((set) => ({
  currency: "USD",
  user: null,
  profile: null,
  location: null,
  filters: undefined,
  loading: false,
  chatHeads: [],
  cart: {
     items: [],
     total: 0,
     addItem: (item: CartItem)=>{
      set(prev => {
        
        if(prev.cart.store && !_.isEqual(prev.cart.store, item.store)){
          return prev
        }
        localStorage.setItem('cart_items', JSON.stringify([...prev.cart.items, item]))
        return {
          ...prev, 
          cart: {
            ...prev.cart, 
            items: [
              ...prev.cart.items, 
              item
            ], 
            total: calcCartTotal([
              ...prev.cart.items, 
              item
            ]),
            store: item.store,
          }
        }
      })
     },
     updateItem: (item: CartItem) => {
      set(prev => {
        const cleanItems = prev.cart.items.filter(i => i.sn !== item.sn)
        localStorage.setItem('cart_items', JSON.stringify([...cleanItems, item].sort((a,b) => a.id - b.id)))
        return {...prev, cart: {...prev.cart, items: [...cleanItems, item].sort((a,b) => a.id - b.id), total: calcCartTotal([...cleanItems, item])}}
      })
     },
     deleteItem: (item: CartItem)=>{
      set(prev=>{
        localStorage.setItem('cart_items', JSON.stringify(prev.cart.items.filter(i => i.sn!=item.sn)))
        return {...prev, cart: {...prev.cart, items: prev.cart.items.filter(i => i!=item), total: calcCartTotal(prev.cart.items.filter(i => i!=item))}}
      })
     },
     clearCart: () => {
      localStorage.removeItem('cart_items')
      set(prev => ({...prev, cart: {...prev.cart, items: [], total: 0}}))
     },
  },
  setChatHeads: (chatHeads) => set({ chatHeads }),
  setLoading: (loading)=>set({loading}),
  setCurrency: (currency) => set({ currency }),
  setUser: (user) => set({ user }),
  setProfile: (p)=> set({profile: p}),
  setLocation: (location) => set({ location }),
  clearLocation: () => set({ location: null }),
  setfilters: (st) => set({ filters: st }),
  setActiveChatHead: (activeChatHead) => set({activeChatHead}),
  setDeviceWidth: (deviceWidth) => set({ deviceWidth }),
  setCart: (cart)=>set({cart})
}));
