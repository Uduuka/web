import Popup from "@/components/ui/Popup";
import { StoreOrder } from "@/lib/types";
import React from "react";
import Button from "@/components/ui/Button";
import { DeleteOrderDialog, MessageDialog } from "./dialogs";
import { Row } from "@tanstack/react-table";

export default function Completed({ row, rows, setRows }: { row: Row<StoreOrder>, rows: StoreOrder[], setRows: (rows: StoreOrder[]) => void }) {
  const order = row.original;
  return (
    <Popup
      className="w-full pb-0"
      align="vertical"
      triggerStyle="w-full"
      contentStyle="w-full"
      trigger={
        <Button className="px-2 py-1 rounded-full w-full text-center capitalize text-green-500 bg-green-50">
          Completed
        </Button>
      }
    >
      <div className="w-full">
        <MessageDialog order={order} />
        <DeleteOrderDialog order={order} rows={rows} setRows={setRows} />
      </div>
    </Popup>
  );
}
