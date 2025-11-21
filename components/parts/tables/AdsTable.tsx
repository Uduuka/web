"use client";

import { Category, Listing, Pricing, Unit } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./DataTable";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { Check, Info, Plus } from "lucide-react";
import { BiSort } from "react-icons/bi";
import Popup from "@/components/ui/Popup";
import { useParams } from "next/navigation";
import AdsModel from "../models/AdsModel";
import { toNumber } from "@/lib/utils";
import EditAdDialog from "../dialogs/EditAdDialog";
import { Suspense, use, useEffect, useState } from "react";
import EditPricingDialog from "../dialogs/EditPricingDialog";
import { RenderPricings } from "../cards/AdCard";
import { CgMenuGridO } from "react-icons/cg";
import DiscountDialog from "../dialogs/DiscountDialog";
import FlashPriceDialog from "../dialogs/FlashPriceDialog";

export default function AdsTable({
  dataPromise,
  empty,
  showAdd,
  displayColumns,
  onRowSelect,
  categoriresPromise,
  unitsPromise,
}: {
  dataPromise: Promise<{
    data: Listing[] | null;
    error: { message: string } | null;
  }>;
  empty?: string;
  showAdd?: boolean;
  displayColumns?: string[];
  onRowSelect?: (ad: Listing) => void;
  categoriresPromise?: Promise<{
    data: Category[] | null;
    error: { message: string } | null;
  }>;
  unitsPromise?: Promise<{
    data: Unit[] | null;
    error: { message: string } | null;
  }>;
}) {
  const { data } = use(dataPromise);
  const storeID = useParams()["storeID"] as string;
  const handleRowSelect = (selectedRows: Listing[]) => {};
  const { data: categories } = categoriresPromise
    ? use(categoriresPromise)
    : { data: null };
  const { data: units } = unitsPromise ? use(unitsPromise) : { data: null };
  const [ads, setAds] = useState<Listing[]>([]);

  const columns: ColumnDef<Listing>[] = [
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
        <Popup trigger={<CgMenuGridO />}>
          <div className="space-y-2">
            <Button
              onClick={() => {
                row.toggleSelected(!row.getIsSelected());
              }}
              className="bg-gray-200 text-gray-500 hover:bg-gray-500 hover:text-gray-100 text-xs p-1 px-5 w-full justify-start gap-2"
            >
              <Check size={15} /> Select
            </Button>
            <EditAdDialog
              ads={ads}
              ad={row.original}
              categories={categories ?? []}
              setAds={setAds}
            />
            <EditPricingDialog
              ad={row.original}
              ads={ads}
              setAds={setAds}
              units={units ?? []}
            />
            <DiscountDialog ad={row.original} ads={ads} setAds={setAds} />
            <FlashPriceDialog ad={row.original} ads={ads} setAds={setAds} />
          </div>
        </Popup>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      id: "title",
      header: () => <h1 className="font-semibold">Ad title and description</h1>,
      cell: ({ row }) => (
        <div className="relative">
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
        const pricings = row.original.pricings as Pricing<any>[];
        const onFlashSale = pricings?.some(
          (p) =>
            p.flashSale &&
            p.flashSale.amount > 0 &&
            new Date(p.flashSale.expires_at) > new Date()
        );
        return (
          <div className="relative">
            <RenderPricings pricings={pricings ?? []} />
            {onFlashSale && (
              <div className="absolute -top-1 -right-1 p-1 h-2 w-2 rounded-full bg-primary animate-pulse"></div>
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

  useEffect(() => {
    setAds(data ?? []);
  }, [data]);

  return (
    <Suspense fallback={<>Fetching ads...</>}>
      <DataTable
        columns={
          displayColumns?.length
            ? columns.filter((c) => displayColumns.includes(c.id ?? ""))
            : columns
        }
        filterBy="title"
        data={ads ?? []}
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
      />
    </Suspense>
  );
}
