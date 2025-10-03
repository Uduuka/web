import { PlaceOrder } from "@/components/parts/cards/PlaceOrder";
import ShoppingCart from "@/components/parts/cards/ShoppingCart";

export default function OrderPage() {
  return (
    <div className="p-5 flex gap-5 flex-col-reverse sm:flex-row md:flex-col-reverse lg:flex-row">
      <div className="w-full h-[80vh] flex flex-col overflow-hidden bg-white rounded-lg">
        <ShoppingCart mode="page" />
      </div>
      <div className="w-full sm:max-w-[24rem] md:max-w-full lg:max-w-[24rem] bg-white h-fit p-5 rounded-lg">
        <PlaceOrder />
      </div>
    </div>
  );
}
