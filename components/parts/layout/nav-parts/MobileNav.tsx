"use client";

import Button from "@/components/ui/Button";
import Dropdown from "@/components/ui/Dropdown";
import Select from "@/components/ui/Select";
import { setCookie } from "@/lib/actions";
import env from "@/lib/env";
import { useAppStore } from "@/lib/store";
import { Currency, Profile } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Check, MapPin, Menu, ShieldQuestion, X } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { BiBell, BiPlus } from "react-icons/bi";
import ScrollArea from "../ScrollArea";
import Image from "next/image";
import Link from "next/link";
import { RxDashboard } from "react-icons/rx";
import { DashboardNav, DefaultNav, StoreNav } from "../SideBar";
import LogoutButton from "./LogoutButton";

export default function MobileNav({ profile }: { profile: Profile | null }) {
  const { currency, setCurrency, location } = useAppStore();
  const mobilNavRef = useRef<HTMLDivElement>(null);
  const [showMobileNav, setShowMobileNav] = useState(false);

  const pathname = usePathname();
  const storeId = useSearchParams().get("storeID") as string;

  useEffect(() => {
    setShowMobileNav(false);
  }, [pathname]);
  return (
    <>
      <div className="md:hidden flex items-center">
        <Button
          onClick={() => {
            setShowMobileNav(!showMobileNav);
          }}
          className="bg-background text-primary p-1 py-0.5 rounded-md"
        >
          <Menu size={30} />
        </Button>
      </div>
      <div
        ref={mobilNavRef}
        className={`fixed top-0 right-0 h-[100vh] md:hidden flex flex-col transition-all duration-500 max-w-80 bg-primary/95 text-white ${
          showMobileNav
            ? "w-screen opacity-100"
            : "w-0 overflow-hidden opacity-0"
        }`}
      >
        <div className="flex w-full justify-end px-5 py-3 border-b border-background">
          <div className="w-full flex gap-3">
            <Select
              options={
                env.currencyOptions as { label: string; value: string }[]
              }
              className="bg-background text-primary text-xs"
              triggerStyle="text-sm py-2 gap-1"
              value={currency}
              onChange={(c) => {
                setCurrency(c as Currency);
                setCookie("currency", c);
                localStorage.setItem("currency", c);
              }}
              placeholder="Currency"
            />
            <Dropdown
              align="center"
              className=""
              trigger={
                <Button
                  className={cn(
                    "bg-transparent p-0",
                    location ? "" : "text-yellow-400 border-yellow-400"
                  )}
                >
                  <MapPin className="" size={30} />
                </Button>
              }
            >
              <div className="p-4 w-60 shadow-md rounded-md bg-white">
                <div className="text-gray-500">
                  {location ? (
                    <>
                      <p className="w-full flex items-center justify-center pr-2 gap-1 text-green-500 text-xs">
                        <Check size={15} /> Your precise location is in use
                      </p>
                      <p className="py-2 text-xs">
                        This means that all ads are filtered based on your
                        location.
                      </p>

                      <Button className="w-fit gap-1 mx-auto rounded text-xs bg-red-50 text-red-400 hover:bg-red-100">
                        <ShieldQuestion size={15} />
                        Hide location
                      </Button>
                    </>
                  ) : (
                    <>
                      <p className="w-full flex items-center justify-center pr-2 gap-1 text-yellow-500 text-xs">
                        <ShieldQuestion size={15} /> Your location is not being
                        used
                      </p>
                      <p className="py-2 text-xs">
                        This means that ads are{" "}
                        <strong className="font-bold text-foreground">
                          not
                        </strong>{" "}
                        filtered based on your location.
                      </p>

                      <Button className="w-fit gap-1 mx-auto rounded text-xs bg-green-50 text-green-400 hover:bg-green-100">
                        <Check size={15} /> Use location
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Dropdown>
            <Dropdown trigger={<BiBell size={30} />} align="center">
              <div className="bg-white shadow-lg rounded-lg h-40 w-60"></div>
            </Dropdown>
          </div>
          <Button
            onClick={() => setShowMobileNav(false)}
            className="bg-background text-primary p-1 py-0.5 rounded-md"
          >
            <X size={30} />
          </Button>
        </div>
        <ScrollArea maxHeight="100%" className="flex-1 rounded-lg mb-20">
          <div className="h-fit w-full">
            {profile && (
              <div className="space-y-5 p-5 border-b border-background">
                <div className="flex flex-col justify-center items-center gap-3">
                  <div className="h-24 w-24 rounded-full border-background bg-background border">
                    <Image
                      src={profile?.avatar_url ?? "/placeholder.svg"}
                      alt="avatar"
                      height={100}
                      width={100}
                      className="h-full w-full bg-cover rounded-full"
                    />
                  </div>
                  <div className="h-fit text-center">
                    <h1 className="text-lg font-bold">{profile?.full_name}</h1>
                    <p className="text-xs">
                      {profile.email || "No email provided"}
                    </p>
                    <p className="text-xs">
                      {profile?.phone || "No phone number provided"}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Link href="/dashboard" className="block w-full">
                    <Button className="bg-primary hover:bg-secondary hover:text-primary gap-2 text-background border border-background w-full">
                      <RxDashboard />
                      Go to Dashboard
                    </Button>
                  </Link>
                  <Link href="/dashboard/ads/create" className="block w-full">
                    <Button className="bg-background gap-2 text-primary w-full">
                      <BiPlus />
                      Post Advert
                    </Button>
                  </Link>
                </div>
              </div>
            )}
            {pathname.startsWith("/dashboard") ? (
              storeId ? (
                <StoreNav className="px-5" />
              ) : (
                <DashboardNav />
              )
            ) : (
              <DefaultNav className="text-white font-bold" />
            )}
          </div>
        </ScrollArea>
        {showMobileNav && (
          <div className="flex gap-5 border-t border-background bg-primary justify-between items-center w-full p-5 fixed bottom-0 right-0 max-w-80">
            {profile ? (
              <LogoutButton />
            ) : (
              <>
                <Link
                  href="/signin"
                  className="hover:underline text-xs border border-background bg-background px-5 py-2 rounded-lg text-primary w-full font-bold text-center"
                >
                  Sign In
                </Link>
                <div className="w-0.5 h-6 bg-background"></div>
                <Link
                  href="/signup"
                  className="hover:underline text-xs border border-background px-5 py-2 rounded-lg w-full font-bold text-center"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
