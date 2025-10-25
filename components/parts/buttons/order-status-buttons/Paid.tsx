import Popup from "@/components/ui/Popup";
import { StoreOrder } from "@/lib/types";
import React from "react";
import Button from "@/components/ui/Button";
import {
  CancelOrderDialog,
  DeliverOrderDialog,
  MessageDialog,
  ReceiveOrderDialog,
} from "./dialogs";
import { Row } from "@tanstack/react-table";
import { useAppStore } from "@/lib/store";

export default function Paid({
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
  return (
    <Popup
      className="w-full"
      align="vertical"
      triggerStyle="w-full"
      contentStyle="w-full"
      trigger={
        <Button className="px-2 py-1 rounded-full w-full text-center capitalize text-emerald-500 bg-emerald-50">
          Paid
        </Button>
      }
    >
      <div className="w-full space-y-3">
        <MessageDialog order={order} />
        {isBuyer ? (
          <>
            <ReceiveOrderDialog order={order} rows={rows} setRows={setRows} />
            <CancelOrderDialog order={order} rows={rows} setRows={setRows} />
          </>
        ) : (
          <>
            <DeliverOrderDialog order={order} rows={rows} setRows={setRows} />
          </>
        )}
      </div>
    </Popup>
  );
}
