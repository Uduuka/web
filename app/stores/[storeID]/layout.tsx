import WithStoreContext from "@/contexts/store-context/StoreContext";
import React, { ReactNode } from "react";

export default function StoreLayout({ children }: { children: ReactNode }) {
  return <WithStoreContext>{children}</WithStoreContext>;
}
