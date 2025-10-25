"use client";

import { Listing, Pricing } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./DataTable";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { Info, Plus } from "lucide-react";
import PriceTag from "../cards/PriceTag";
import { BiSort } from "react-icons/bi";
import Popup from "@/components/ui/Popup";
import { useParams } from "next/navigation";
import AdsModel from "../models/AdsModel";
import { toNumber } from "@/lib/utils";

export const columns: ColumnDef<Listing>[] = [
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
    accessorKey: "title",
    id: "title",
    header: () => <h1 className="font-semibold">Title</h1>,
    cell: ({ row }) => (
      <div className="">
        <p className="w-full line-clamp-1">{row.getValue("title")}</p>
        <p className="text-xs w-full  text-gray-500 line-clamp-1">
          {row.original.description}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "Price",
    id: "price",
    header: () => <h1 className="font-semibold">Pricing</h1>,
    cell: ({ row }) => {
      const pricing = row.original.pricing as Pricing<any>;
      const pricings = row.original.pricings as Pricing<any>[];

      return (
        <div className="flex gap-5 justify-between items-center">
          <PriceTag className="text-accent" pricing={pricing} />
          {pricings && pricings.length > 1 && (
            <Popup
              align="vertical"
              contentStyle="mt-1 p-0"
              trigger={<Button>+{pricings.length - 1}</Button>}
            >
              <div className="flex flex-col gap-2">
                <h1 className="font-thin text-xs px-5 pt-2 pb-0.5 border-b border-gray-200">
                  Other Pricing Options
                </h1>
                <ul className="flex flex-col">
                  {pricings.map((p, i) => (
                    <li
                      key={i}
                      className="flex px-3 justify-between items-center"
                    >
                      <PriceTag pricing={p} />
                    </li>
                  ))}
                  <li className="flex p-3 justify-between items-center">
                    <Button className="bg-primary text-xs text-background w-full">
                      Edit Pricing
                    </Button>
                  </li>
                </ul>
              </div>
            </Popup>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "quantity",
    id: "quantity",
    header: () => <h1 className="font-semibold">Quantity</h1>,
    cell: ({ row }) => {
      const quantity =
        row.original.quantity ??
        row.original.pricings
          ?.map((r) => {
            if (r.details.qty) {
              return toNumber(r.details.qty);
            }
            return 1;
          })
          .reduce((a, b) => a + b, 0);
      return (
        <div className="">
          <p className="w-full">{quantity}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    id: "created_at",
    header: ({ column }) => (
      <h1
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-semibold flex justify-between items-center hover:bg-orange-50 px-5 py-2 rounded-lg transition-colors"
      >
        <span>Date</span>
        <BiSort />
      </h1>
    ),
    cell: ({ row }) => {
      return (
        <p className="">
          {new Date(row.getValue("created_at")).toDateString()}
        </p>
      );
    },
  },
  {
    accessorKey: "views",
    id: "views",
    header: () => <h1 className="font-semibold">Views</h1>,
    cell: ({ row }) => {
      return <p className="">{row.getValue("views")}</p>;
    },
  },
  {
    accessorKey: "likes",
    id: "likes",
    header: () => <h1 className="font-semibold">Likes</h1>,
    cell: ({ row }) => {
      return <p className="">{row.getValue("likes")}</p>;
    },
  },
  {
    accessorKey: "rating",
    id: "rating",
    header: () => <h1 className="font-semibold">Rating</h1>,
    cell: ({ row }) => {
      const rating = row.getValue("rating")
        ? `${row.getValue("rating")} (${row.original.ratings})`
        : "No ratings";
      return <p className="">{rating}</p>;
    },
  },
];

export default function AdsTable({
  data,
  empty,
  error,
  showAdd,
  displayColumns,
  onRowSelect,
}: {
  data?: Listing[];
  error?: string;
  empty?: string;
  showAdd?: boolean;
  displayColumns?: string[];
  onRowSelect?: (ad: Listing) => void;
}) {
  const storeID = useParams()["storeID"] as string;
  const handleRowSelect = (selectedRows: Listing[]) => {};
  return (
    <DataTable
      columns={
        displayColumns?.length
          ? columns.filter((c) => displayColumns.includes(c.id ?? ""))
          : columns
      }
      filterBy="title"
      data={data ?? []}
      onRowsSelect={handleRowSelect}
      onRowClicked={onRowSelect}
      emptyMessage={
        <div className="text-gray-500 h-full w-full bg-gray-50 p-5">
          <h1 className="flex gap-3 items-center justify-center">
            <Info /> {empty ?? "No ads found."}
          </h1>
          {showAdd && storeID && (
            <div className="flex gap-5 justify-center items-center pt-5">
              <Link
                href={`/dashboard/stores/${storeID}/ads/create`}
                className="inline-block w-fit"
              >
                <Button className="bg-primary py-1 gap-1 text-xs text-background">
                  <Plus size={15} />
                  Post new ad
                </Button>
              </Link>
              <AdsModel />
            </div>
          )}
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
