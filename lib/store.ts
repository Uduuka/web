import { create } from "zustand";
import { User, Location, Filters, ChatHead } from "./types";

interface AppState {
  currency: string;
  user: User | null;
  location: Location | null;
  filters?: Filters;
  chatHeads?: ChatHead[];
  setCurrency: (currency: string) => void;
  setUser: (user: User | null) => void;
  setLocation: (location: Location | null) => void;
  clearLocation: () => void;
  setfilters: (st: Filters) => void;
  setChatHeads?: (heads: ChatHead[]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currency: "",
  user: null,
  location: null,
  filters: undefined,
  chatHeads: [],
  setChatHeads: (chatHeads) => set({ chatHeads }),
  setCurrency: (currency) => set({ currency }),
  setUser: (user) => set({ user }),
  setLocation: (location) => set({ location }),
  clearLocation: () => set({ location: null }),
  setfilters: (st) => set({ filters: st }),
}));
