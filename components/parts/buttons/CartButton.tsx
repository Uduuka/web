import Dropdown from "@/components/ui/Dropdown";
import { useAppStore } from "@/lib/store";
import { ShoppingCart as CartIcon } from "lucide-react";
import ShoppingCart from "../cards/ShoppingCart";

export default function CartButton() {
  const {
    cart: { items },
  } = useAppStore();
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
        <ShoppingCart />
      </div>
    </Dropdown>
  );
}
