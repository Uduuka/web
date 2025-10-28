"use client";

import { CartItem, Profile, StoreOrder } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import React, { use, useRef, useState } from "react";
import { DataTable } from "./DataTable";
import { Info, X } from "lucide-react";
import Image from "next/image";
import { calcCartItemSubTotal, toMoney } from "@/lib/utils";
import { BiSort } from "react-icons/bi";
import Button from "@/components/ui/Button";
import PriceTag from "../cards/PriceTag";
import ScrollArea from "../layout/ScrollArea";
import Pending from "../buttons/order-status-buttons/Pending";
import Completed from "../buttons/order-status-buttons/Completed";
import Declined from "../buttons/order-status-buttons/Declined";
import Canceled from "../buttons/order-status-buttons/Canceled";
import Inquiry from "../buttons/order-status-buttons/Inquiry";
import Failed from "../buttons/order-status-buttons/Failed";
import Delivered from "../buttons/order-status-buttons/Delivered";
import Paid from "../buttons/order-status-buttons/Paid";
import Rejected from "../buttons/order-status-buttons/Rejected";
import Shipping from "../buttons/order-status-buttons/Shipping";
import Received from "../buttons/order-status-buttons/Received";

export default function OrdersTable({
  empty,
  error,
  displayColumns,
  onRowSelect,
  profilePromise,
  ordersPromise,
}: {
  error?: string;
  empty?: string;
  displayColumns?: string[];
  onRowSelect?: (order: StoreOrder) => void;
  profilePromise: Promise<{
    data: Profile | null;
    error: { message: string } | null;
  }>;
  ordersPromise: Promise<{
    data: StoreOrder[] | null;
    error: { message: string } | null;
  }>;
}) {
  const { data } = use(ordersPromise);
  const [rows, setRows] = useState(data || []);

  const columns: ColumnDef<StoreOrder>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={Boolean(
            table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
          )}
          onChange={(value) =>
            table.toggleAllPageRowsSelected(!!value.target.checked)
          }
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={(value) => row.toggleSelected(!!value.target.checked)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      id: "id",
      header: () => <h1 className="font-semibold text-gray-600">Order ID</h1>,
      cell: ({ row }) => {
        const order = row.original;

        return (
          <div className="text-gray-500">
            <OrderButton order={order} />
          </div>
        );
      },
    },
    {
      accessorKey: "amount",
      id: "amount",
      header: () => <h1 className="font-semibold text-gray-600">Amount</h1>,
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div className="text-primary font-bold">
            <span>
              {order.currency}{" "}
              {toMoney(order.amount.toString(), order.currency)}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "client",
      id: "client",
      header: () => <h1 className="font-semibold text-gray-600">Client</h1>,
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div className="text-gray-500">
            {order.buyer ? (
              <p className="w-full flex gap-2 items-center">
                <Image
                  src={order.buyer.avatar_url ?? "/placeholder.svg"}
                  alt=""
                  height={100}
                  width={100}
                  className="h-8 w-8 rounded-full"
                />
                <span className="capitalize">{order.buyer.full_name}</span>
              </p>
            ) : order.type === "local" ? (
              <p className="w-full flex gap-2 items-center">
                <Image
                  src={order.store.logo ?? "/placeholder.svg"}
                  alt=""
                  height={100}
                  width={100}
                  className="h-8 w-8 rounded-full"
                />
                <span className="capitalize">{order.store.name}</span>
              </p>
            ) : (
              <p className="text-error">Invalid client</p>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "date",
      id: "date",
      header: ({ column }) => (
        <h1
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-semibold text-gray-600 flex justify-between items-center hover:bg-gray-300 px-3 cursor-pointer py-1 rounded-lg transition-colors"
        >
          <span>Date</span>
          <BiSort />
        </h1>
      ),
      cell: ({ row }) => {
        return (
          <div className="text-gray-500">
            <p className="w-full">
              <span>{new Date(row.getValue("date")).toDateString()}</span>
            </p>
            <p className="w-full text-xs text-gray-400">
              <span>{new Date(row.getValue("date")).toLocaleTimeString()}</span>
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      id: "status",
      header: () => (
        <h1 className="font-semibold text-gray-600 w-24">Status</h1>
      ),
      cell: ({ row }) => {
        const order = row.original;
        const Component = () => {
          switch (order.status) {
            case "pending":
              return (
                <Pending
                  profilePromise={profilePromise}
                  row={row}
                  rows={rows}
                  setRows={setRows}
                />
              );

            case "completed":
              return (
                <Completed
                  profilePromise={profilePromise}
                  row={row}
                  rows={rows}
                  setRows={setRows}
                />
              );

            case "declined":
              return (
                <Declined
                  profilePromise={profilePromise}
                  row={row}
                  rows={rows}
                  setRows={setRows}
                />
              );

            case "canceled":
              return (
                <Canceled
                  profilePromise={profilePromise}
                  row={row}
                  rows={rows}
                  setRows={setRows}
                />
              );

            case "inquiry":
              return (
                <Inquiry
                  profilePromise={profilePromise}
                  row={row}
                  rows={rows}
                  setRows={setRows}
                />
              );

            case "shipping":
              return (
                <Shipping
                  profilePromise={profilePromise}
                  row={row}
                  rows={rows}
                  setRows={setRows}
                />
              );

            case "failed":
              return (
                <Failed
                  profilePromise={profilePromise}
                  row={row}
                  rows={rows}
                  setRows={setRows}
                />
              );

            case "delivered":
              return (
                <Delivered
                  profilePromise={profilePromise}
                  row={row}
                  rows={rows}
                  setRows={setRows}
                />
              );

            case "paid":
              return (
                <Paid
                  profilePromise={profilePromise}
                  row={row}
                  rows={rows}
                  setRows={setRows}
                />
              );

            case "rejected":
              return (
                <Rejected
                  profilePromise={profilePromise}
                  row={row}
                  rows={rows}
                  setRows={setRows}
                />
              );

            case "received":
              return (
                <Received
                  profilePromise={profilePromise}
                  row={row}
                  rows={rows}
                  setRows={setRows}
                />
              );

            default:
              return null;
          }
        };
        return (
          <div className="w-full">
            <Component />
          </div>
        );
      },
    },
  ];

  const handleRowSelect = () => {};

  return (
    <DataTable
      columns={
        displayColumns?.length
          ? columns.filter((c) => displayColumns.includes(c.id ?? ""))
          : columns
      }
      data={rows}
      onRowsSelect={handleRowSelect}
      viewOptions={["all", ...Array.from(new Set(rows?.map((d) => d.status)))]}
      onRowClicked={onRowSelect}
      emptyMessage={
        <div className="text-gray-500 h-full w-full bg-gray-50 p-5">
          <h1 className="flex gap-3 items-center justify-center">
            <Info /> {empty ?? "No orders found."}
          </h1>
        </div>
      }
      errorMessage={
        error && (
          <div className="text-error h-full w-full bg-red-100 p-5">
            <h1 className="flex gap-3 items-center justify-center">
              <Info /> {error}.
            </h1>
          </div>
        )
      }
    />
  );
}

const OrderButton = ({ order }: { order: StoreOrder }) => {
  const id = order.type === "local" ? `LC${order.id}` : `RMT${order.id}`;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openDialog = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };

  const carttItems: CartItem[] = order?.items?.map((a) => ({
    ad: { ...a.ad, ...a.pricing.details },
    qty: a.quantity,
    aqty: 0,
    id: a.id,
    pricing: a.pricing,
    specs: a.specs,
    store: order.store,
    subTotal: calcCartItemSubTotal(a.pricing, a.quantity),
    units: a.pricing.details?.units ?? a.pricing.details.period,
    period: a.period,
    sn: a.sn,
  }));
  return (
    <>
      <div className="" onClick={openDialog}>
        <p className="w-full line-clamp-1">{id}</p>
        <p className="text-xs text-gray-400">{order?.items?.length} ads</p>
      </div>
      <dialog
        ref={dialogRef}
        className="backdrop:bg-black/75 w-screen p-5 bg-transparent m-auto mt-10 outline-0"
      >
        <div className="w-full max-w-md h-fit max-h-[90vh] flex flex-col bg-white shadow mx-auto rounded-lg overflow-hidden">
          <div className="w-full bg-orange-50 flex justify-between px-5 pt-3 pb-1 border-b border-primary text-primary">
            <div className="space-y-2">
              <h1 className="flex gap-3">
                <span>{id}</span>
              </h1>
              <p className="text-xs text-orange-400">
                {new Date(order.date).toDateString()} |{" "}
                {new Date(order.date).toLocaleTimeString()}
              </p>
            </div>
            <form method="dialog">
              <Button className="p-1 outline-0 text-gray-500 hover:text-error hover:bg-red-50">
                <X />
              </Button>
            </form>
          </div>
          <ScrollArea maxHeight="100%" maxWidth="100%" className="flex-1">
            {order.message && (
              <div className={`p-5 w-full text-gray-500 bg-orange-50`}>
                <p className="w-full m-0 break-words text-wrap whitespace-normal">
                  {order.message}
                </p>
              </div>
            )}
            {carttItems.map((ci, i) => (
              <OrderItemCard item={ci} key={i} />
            ))}
          </ScrollArea>
          <div className="px-5 bg-orange-50 border-t border-primary py-2">
            <div className="flex justify-end py-1 gap-5 items-center text-primary">
              <span className="text-xl font-bold">Total:</span>
              <PriceTag
                className="text-xl font-bold"
                pricing={{
                  currency: order.currency,
                  details: { price: order.amount },
                  scheme: "fixed",
                }}
              />
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
};

const OrderItemCard = ({ item }: { item: CartItem }) => {
  return (
    <div className="hover:bg-gray-50 p-3 cursor-pointer">
      <div className="flex">
        <div className="px-2 w-full">
          <p className="font-bold text-gray-500">{item.ad.title}</p>
          <p className="text-gray-400 line-clamp-1 text-xs ">
            {item.ad.description}
          </p>
          <div className="flex flex-wrap gap-2 items-center text-gray-500 text-xs border-t pt-1 mt-1 border-gray-200">
            <PriceTag
              className="font-normal text-xs text-gray-500 pr-0"
              pricing={item.pricing}
            />

            <div className="flex gap-2 items-center">
              {item.qty ? (
                <>
                  |
                  <div className="flex gap-2 capitalize">
                    {String(item.qty).length < 2
                      ? `0${item.qty} ${
                          item.period
                            ? `${item.period}s`
                            : item?.units ?? "units"
                        }`
                      : `${item.qty} ${
                          item.period
                            ? `${item.period}s`
                            : item?.units ?? "units"
                        }`}
                  </div>
                </>
              ) : null}
            </div>
            {Array.from(Object.entries(item?.specs ?? {})).map(
              ([s, val], i) => (
                <div key={i} className="flex gap-2 items-center">
                  |
                  <div className="flex gap-2 items-center">
                    <span>
                      {s}
                      {val.length > 1 ? "s" : ""}:{" "}
                    </span>
                    {val.length ? (
                      <>
                        {(val as any[]).map((v, i) => (
                          <span
                            key={i}
                            className="bg-gray-100 px-2 py-0.5 rounded line-clamp-1"
                          >
                            {v}
                          </span>
                        ))}
                      </>
                    ) : (
                      <span>{val}</span>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
          <div className="flex flex-wrap gap-2"></div>
        </div>
      </div>

      <div className="w-full flex gap-2 items-center justify-end px-2 pt-1 text-gray-500 border-t mt-2 border-gray-200">
        <div className="self-end flex gap-2 items-center">
          <span className="text-xs text-gray-400">Sub-total:</span>
          <PriceTag pricing={item.subTotal} />
        </div>
      </div>
    </div>
  );
};
