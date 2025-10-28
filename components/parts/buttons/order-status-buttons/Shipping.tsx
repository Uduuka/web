import Popup from "@/components/ui/Popup";
import { Profile, StoreOrder } from "@/lib/types";
import React, { use } from "react";
import Button from "@/components/ui/Button";
import { MessageDialog, ReceiveOrderDialog, TrackOrderDialog } from "./dialogs";
import { Row } from "@tanstack/react-table";
import { useAppStore } from "@/lib/store";

export default function Shipping({
  row,
  profilePromise,
}: {
  row: Row<StoreOrder>;
  rows: StoreOrder[];
  setRows: (rows: StoreOrder[]) => void;
  profilePromise: Promise<{
    data: Profile | null;
    error: { message: string } | null;
  }>;
}) {
  const order = row.original;
  const { data: profile } = use(profilePromise);
  const isBuyer = profile?.user_id === order.buyer_id;
  return (
    <Popup
      className="w-full"
      align="vertical"
      triggerStyle="w-full"
      contentStyle="w-full"
      trigger={
        <Button className="px-2 py-1 rounded-full w-full text-center capitalize text-blue-500 bg-blue-50">
          Shipping
        </Button>
      }
    >
      <div className="w-full space-y-3">
        <TrackOrderDialog order={order} />
        <MessageDialog profilePromise={profilePromise} order={order} />
        {isBuyer && (
          <ReceiveOrderDialog
            profilePromise={profilePromise}
            order={order}
            rows={[order]}
            setRows={() => {}}
          />
        )}
      </div>
    </Popup>
  );
}
