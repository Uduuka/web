import Popup from "@/components/ui/Popup";
import { Profile, StoreOrder } from "@/lib/types";
import React, { use } from "react";
import Button from "@/components/ui/Button";
import { DeleteOrderDialog, MessageDialog } from "./dialogs";
import { Row } from "@tanstack/react-table";

export default function Canceled({
  row,
  rows,
  setRows,
  profilePromise
}: {
  row: Row<StoreOrder>;
  rows: StoreOrder[];
  setRows: (rows: StoreOrder[]) => void;
  profilePromise: Promise<{data: Profile | null, error: {message: string} | null}>
}) {
  const order = row.original;
  const {data: profile} = use(profilePromise)
  const isBuyer = profile?.user_id === order.buyer_id;
  const handleReOrder = () => {
    // Logic to handle re-ordering
    console.log("Re-ordering", order.id);
  };
  return (
    <Popup
      className="w-full"
      align="vertical"
      triggerStyle="w-full"
      contentStyle="w-full"
      trigger={
        <Button className="px-2 py-1 rounded-full w-full text-center capitalize text-red-500 bg-red-50">
          Canceled
        </Button>
      }
    >
      <div className="w-full space-y-3">
        <MessageDialog profilePromise={profilePromise} order={order} />
        <DeleteOrderDialog order={order} rows={rows} setRows={setRows} />
        {
          // Re-order option only for buyers
          isBuyer && (
            <Button
              className="w-full bg-green-50 text-green-500 border border-green hover:bg-green-500 hover:text-white"
              onClick={handleReOrder}
            >
              Re-order
            </Button>
          )
        }
      </div>
    </Popup>
  );
}
