"use client";

import { fetchStoreData } from "@/lib/actions";
import { Store } from "@/lib/types";
import { useParams } from "next/navigation";
import {
  createContext,
  ReactNode,
  useEffect,
  useState,
  useTransition,
} from "react";

interface ContextState {
  store: Store | null;
  error?: string;
  loading: boolean;
}

const defaultStoreState: ContextState = {
  store: null,
  loading: true,
};

export const StoreContext = createContext(defaultStoreState);

export const StoreContextProvider = ({ children }: { children: ReactNode }) => {
  const storeID = useParams().storeID as string | undefined;
  const [store, setStore] = useState<Store | null>(null);
  const [error, setError] = useState<string>();
  const [loading, startLoading] = useTransition();

  useEffect(() => {
    startLoading(async () => {
      if (!storeID) {
        setError("The store id is undefined.");
        return;
      }
      const { error, data } = await fetchStoreData(storeID);
      if (error) {
        setError(error.message);
        return;
      }

      setStore(data as Store);
    });
  }, []);

  return (
    <StoreContext.Provider value={{ store, error, loading }}>
      {children}
    </StoreContext.Provider>
  );
};

export default function WithStoreContext({
  children,
}: {
  children: ReactNode;
}) {
  return <StoreContextProvider>{children}</StoreContextProvider>;
}
