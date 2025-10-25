import Popup from "@/components/ui/Popup";
import { StoreOrder } from "@/lib/types";
import React from "react";
import Button from "@/components/ui/Button";
import { DeleteOrderDialog, MessageDialog } from "./dialogs";
import { Row } from "@tanstack/react-table";

export default function Rejected({
  row,
  rows,
  setRows,
}: {
  row: Row<StoreOrder>;
  rows: StoreOrder[];
  setRows: (rows: StoreOrder[]) => void;
}) {
  const order = row.original;
  return (
    <Popup
      className="w-full"
      align="vertical"
      triggerStyle="w-full"
      contentStyle="w-full"
      trigger={
        <Button className="px-2 py-1 rounded-full w-full text-center capitalize text-red-500 bg-red-50">
          Rejected
        </Button>
      }
    >
      <div className="w-full space-y-3">
        <MessageDialog order={order} />
        <DeleteOrderDialog order={order} rows={rows} setRows={setRows} />
      </div>
    </Popup>
  );
}
