import Popup from "@/components/ui/Popup";
import { StoreOrder } from "@/lib/types";
import React from "react";
import Button from "@/components/ui/Button";
import { DeleteOrderDialog, MessageDialog } from "./dialogs";
import { Row } from "@tanstack/react-table";
import { useAppStore } from "@/lib/store";

export default function Canceled({
  row,
  rows,
  setRows,
}: {
  row: Row<StoreOrder>;
  rows: StoreOrder[];
  setRows: (rows: StoreOrder[]) => void;
}) {
  const order = row.original;
  const { user } = useAppStore();
  const isBuyer = user?.id === order.buyer_id;
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
        <MessageDialog order={order} />
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
