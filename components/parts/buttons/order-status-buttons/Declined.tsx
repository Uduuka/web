import Popup from "@/components/ui/Popup";
import { Profile, StoreOrder } from "@/lib/types";
import React from "react";
import Button from "@/components/ui/Button";
import { DeleteOrderDialog, MessageDialog } from "./dialogs";
import { Row } from "@tanstack/react-table";

export default function Declined({
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
  return (
    <Popup
      className="w-full"
      align="vertical"
      triggerStyle="w-full"
      contentStyle="w-full"
      trigger={
        <Button className="px-2 py-1 rounded-full w-full text-center capitalize text-red-500 bg-red-50">
          Declined
        </Button>
      }
    >
      <div className="w-full space-y-3">
        <MessageDialog profilePromise={profilePromise} order={order} />
        <DeleteOrderDialog order={order} rows={rows} setRows={setRows} />
      </div>
    </Popup>
  );
}
