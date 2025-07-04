"use client";

import React from "react";
import Table, { Column } from "./Table";
import { Listing } from "@/lib/types";
import FormInput from "@/components/ui/Input";
import PriceTag from "../cards/PriceTag";
import Popup from "@/components/ui/Popup";
import Button from "@/components/ui/Button";
import { Check, Eye, Pencil, Trash } from "lucide-react";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { IoMdFlash } from "react-icons/io";
import Dialog from "@/components/ui/Dialog";
import { useFilteredAds } from "@/lib/hooks/use_filtered_ads";

const adsColumns: Column<Listing>[] = [
  {
    key: "select",
    label: "Select",
    render: () => (
      <FormInput
        type="checkbox"
        className=""
        wrapperStyle="w-fit h-fit border-none p-2"
      />
    ),
  },
  {
    key: "title",
    label: "Title",
    render: (value, ad) => (
      <p className="text-accent line-clamp-1">{ad.title}</p>
    ),
  },
  {
    key: "price",
    label: "Price",
    render: (value, ad) => {
      const { pricing } = ad;
      return <PriceTag pricing={pricing} />;
    },
  },
  {
    key: "views",
    label: "Views",
    render: (value, ad) => (
      <p className="text-accent line-clamp-1">{ad.views ?? 0}</p>
    ),
  },
  {
    key: "likes",
    label: "Likes",
    render: (value, ad) => (
      <p className="text-accent line-clamp-1">{ad.likes ?? 0}</p>
    ),
  },
  {
    key: "dislikes",
    label: "Dislikes",
    render: (value, ad) => (
      <p className="text-accent line-clamp-1">{ad.dislikes ?? 0}</p>
    ),
  },
  {
    key: "actions",
    label: "Actions",
    render: (value, ad) => {
      return (
        <Popup
          trigger={
            <Button className="bg-transparent hover:bg-transparent p-0 text-accent/80 hover:text-accent`">
              <PiDotsThreeOutlineVerticalFill size={18} />
            </Button>
          }
          align="diagonal-left"
        >
          <div className="space-y-1">
            <Button className="gap-2 text-xs w-30 bg-transparent font-thin text-primary justify-start hover:bg-primary/20">
              <IoMdFlash size={15} /> Flash sell
            </Button>
            <Dialog
              trigger={
                <Button className="gap-2 text-xs w-30 bg-transparent text-accent font-thin hover:bg-accent/20 justify-start">
                  <Eye size={15} /> View details
                </Button>
              }
            >
              <div className="py-5">
                <h1 className="text-center border-b pb-2">{ad.title}</h1>
              </div>
            </Dialog>
            <Button className="gap-2 text-xs w-30 bg-transparent font-thin text-blue-500 hover:bg-blue-100 justify-start">
              <Pencil size={15} /> Edit ad
            </Button>
            <Button className="gap-2 text-xs w-30 bg-transparent font-thin text-success justify-start hover:bg-green-100">
              <Check size={15} /> Mark sold
            </Button>

            <Button className="gap-2 text-xs w-30 bg-transparent text-error font-thin justify-start hover:bg-error-background">
              <Trash size={15} /> Delete ad
            </Button>
          </div>
        </Popup>
      );
    },
  },
];

export default function AdsTable() {
  const { ads, error, fetching } = useFilteredAds();
  return (
    <Table
      data={ads}
      columns={adsColumns}
      loading={fetching}
      error={error as string | undefined}
    />
  );
}
