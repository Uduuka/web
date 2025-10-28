"use client";

import Dropdown from "@/components/ui/Dropdown";
import { useAppStore } from "@/lib/store";
import { ShoppingCart as CartIcon } from "lucide-react";
import ShoppingCart from "../cards/ShoppingCart";
import { CartItem } from "@/lib/types";
import { useEffect } from "react";

export default function CartButton() {
  const { cart, setCart } = useAppStore();

  useEffect(() => {
    const cartItems = localStorage.getItem("cart_items");
    if (cartItems) {
      const items: CartItem[] = JSON.parse(cartItems) ?? [];
      setCart?.({ ...cart, items, store: items[0]?.store });
    }
  }, []);

  const { items } = cart;
  return (
    <Dropdown
      trigger={
        <span className="relative">
          <CartIcon size={30} />
          {items.length > 0 && (
            <span className="absolute bg-background text-primary rounded-full -top-1 -right-1 h-4 w-4 flex justify-center items-center text-xs">
              {items.length}
            </span>
          )}
        </span>
      }
      align="right"
    >
      <div className="w-[80vw] max-w-sm max-h-[80vh] flex flex-col overflow-hidden bg-white shadow-lg rounded-lg">
        <ShoppingCart mode="dropdown" />
      </div>
    </Dropdown>
  );
}
