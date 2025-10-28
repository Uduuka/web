import Link from "next/link";
import React from "react";
import { IoMdFlash, IoMdHome } from "react-icons/io";
import { IoMegaphoneSharp, IoStorefrontSharp } from "react-icons/io5";
import { SiGooglemaps } from "react-icons/si";

export default function BottomNav() {
  return (
    <div className="bg-primary text-background w-full fixed bottom-0 left-0 md:hidden">
      <div className="flex justify-between items-center px-5">
        {/* Home */}
        <Link href="/" className="w-fit block">
          <div className="w-fit h-full justify-between flex flex-col items-center py-2">
            <IoMdHome size={25} />
            <h1 className="text-xs">Home</h1>
          </div>
        </Link>

        {/* Market */}
        <Link href="/ads" className="w-fit block">
          <div className="w-fit h-full justify-between flex flex-col items-center py-2">
            <IoMegaphoneSharp size={25} />
            <h1 className="text-xs">Market</h1>
          </div>
        </Link>

        {/* Map */}
        <Link href="/map" className="w-fit block">
          <div className="w-fit h-full justify-between flex flex-col items-center py-2">
            <SiGooglemaps size={25} />
            <h1 className="text-xs">Map</h1>
          </div>
        </Link>

        {/* Deals */}
        <Link href="/flash-sales" className="w-fit block">
          <div className="w-fit h-full justify-between flex flex-col items-center py-2">
            <IoMdFlash size={25} />
            <h1 className="text-xs">Deals</h1>
          </div>
        </Link>

        {/* POS */}
        <Link href="/dashboard/stores" className="w-fit block">
          <div className="w-fit h-full justify-between flex flex-col items-center py-2">
            <IoStorefrontSharp size={25} />
            <h1 className="text-xs">Sale</h1>
          </div>
        </Link>
      </div>
    </div>
  );
}
