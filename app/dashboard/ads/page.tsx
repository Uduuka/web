import AdsTable from "@/components/parts/tables/AdsTable";
import Button from "@/components/ui/Button";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function AdsPage() {
  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="p-5 bg-white rounded-lg flex justify-between">
        <h1 className="text-accent">My ads</h1>
        <div className="w-fit">
          <Link href="/dashboard/ads/create">
            <Button className="bg-primary hover:bg-primary/90 text-white text-xs gap-2">
              <Plus size={15} /> Post new ad
            </Button>
          </Link>
        </div>
      </div>
      <div className="p-5 bg-white rounded-lg">
        <AdsTable />
      </div>
    </div>
  );
}
