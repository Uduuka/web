import { create } from "zustand";
import { Location, Filters, ChatHead, Currency, Profile } from "./types";
import { User } from "@supabase/supabase-js";

interface AppState {
  currency: Currency;
  loading?: boolean,
  user: User | null;
  profile: Profile| null
  location: Location | null;
  filters?: Filters;
  chatHeads?: ChatHead[];
  activeChatHead?: ChatHead
  deviceWidth?: number;
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
  currency: "UGX",
  user: null,
  profile: null,
  location: null,
  filters: undefined,
  loading: false,
  chatHeads: [],
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
}));
