import { create } from "zustand";
import { Location, Currency, Cart, CartItem, ChatThread } from "./types";
import _ from "lodash";
import { calcCartTotal } from "./utils";

interface AppState {
  currency: Currency;
  location: Location | null;
  chatThreads?: ChatThread[];
  threads: ChatThread[];
  activechatThread?: ChatThread
  cart: Cart
  setCart?: (cart: Cart)=>void
  setCurrency: (currency: Currency) => void;
  setLocation: (location: Location | null) => void;
  clearLocation: () => void;
  setChatThreads: (heads?: ChatThread[]) => void;
  setThreads: (heads?: ChatThread[]) => void;
  setActivechatThread: (head?: ChatThread) => void
}

export const useAppStore = create<AppState>((set) => ({
  currency: "UGX",
  location: null,
  chatThreads: [],
  threads: [],
  cart: {
     items: [],
     total: 0,
     addItem: (item: CartItem)=>{
      set(prev => {
        
        if(prev.cart.store && (prev.cart.store?.id !== item.store.id)){
          console.log(`Different carts, cart store id: ${prev.cart.store.id}, item cart id: ${item.store.id}`)
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
      set(prev => ({...prev, cart: {...prev.cart, items: [], total: 0, store: undefined}}))
     },
  },
  setChatThreads: (chatThreads) => set({ chatThreads }),
  setCurrency: (currency) => set({ currency }),
  setLocation: (location) => set({ location }),
  clearLocation: () => set({ location: null }),
  setActivechatThread: (activechatThread) => set({activechatThread}),
  setCart: (cart)=>set({cart}),
  setThreads: (threads) => set({ threads })
}));
