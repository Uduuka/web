"use client";

import React from "react";
import Table, { Column } from "./Table";
import { Listing } from "@/lib/types";
import FormInput from "@/components/ui/Input";
import PriceTag from "../cards/PriceTag";
import Popup from "@/components/ui/Popup";
import Button from "@/components/ui/Button";
import { Eye, Pencil } from "lucide-react";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { IoMdFlash } from "react-icons/io";
import Link from "next/link";
import DeleteDialog from "../dialogs/DeleteDialog";
import MarkSoldDialog from "../dialogs/MarkSoldDialog";
import Model from "../models/Model";
import CreateAdForm from "../forms/CreateAdForm";
import { usePersonalAds } from "@/lib/hooks/use_personal_ads";
import AdForm from "../forms/AdForm";

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
      return (
        <div className="">
          <PriceTag pricing={pricing} />
        </div>
      );
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
            <Model className="w-full max-w-lg h-[80%] flex flex-col">
              <AdForm initailData={ad} setter={() => {}} />
            </Model>
            <Link href={`/ads/${ad.id}`}>
              <Button className="gap-2 text-xs w-30 bg-transparent font-thin text-blue-500 hover:bg-blue-100 justify-start">
                <Eye size={15} /> View details
              </Button>
            </Link>
            <MarkSoldDialog ad={ad} />
            <DeleteDialog ad={ad} />
          </div>
        </Popup>
      );
    },
  },
];

export default function AdsTable() {
  const { ads, error, fetching } = usePersonalAds();
  return (
    <Table
      data={ads}
      columns={adsColumns}
      loading={fetching}
      error={error as string | undefined}
    />
  );
}
