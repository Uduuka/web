"use client";

import Select from "@/components/ui/Select";
import { useAppStore } from "@/lib/store";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import env from "@/lib/env";
import Dropdown from "@/components/ui/Dropdown";
import {
  Check,
  LoaderCircle,
  Lock,
  MapPin,
  Menu,
  ShieldQuestion,
  X,
} from "lucide-react";
import SearchBar from "../forms/SearchBar";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Popup from "@/components/ui/Popup";
import { BiBell, BiEnvelope, BiLock, BiPlus, BiUser } from "react-icons/bi";
import { RxDashboard } from "react-icons/rx";
import { signout } from "@/lib/actions";
import { redirect, useParams, usePathname } from "next/navigation";
import { DashboardNav, DefaultNav, StoreNav } from "./SideBar";
import ScrollArea from "./ScrollArea";
import { Currency } from "@/lib/types";

export default function Navbar({ fetchingUser }: { fetchingUser?: boolean }) {
  const {
    currency,
    setCurrency,
    location,
    user,
    profile,
    setUser,
    deviceWidth,
  } = useAppStore();

  const [showMobileNav, setShowMobileNav] = useState(false);
  const pathname = usePathname() as string;
  const storeId = useParams().storeID as string;

  const mobilNavRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        // (event.target as HTMLElement)?.closest("a") !== null ||
        mobilNavRef.current &&
        !mobilNavRef.current.contains(event.target as Node)
      ) {
        setShowMobileNav(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setShowMobileNav(false);
  }, [deviceWidth, pathname]);

  // Handle signout
  const handleSignout = async () => {
    const { error } = await signout();
    if (error) {
      alert(error.message);
      return;
    }
    setUser(null);
    redirect("/");
  };

  return (
    <header className="bg-primary text-background z-20 py-2 shadow-md sticky top-0 left-0">
      <div className="px-5 mx-auto w-full flex justify-between gap-2 items-center">
        {/* Logo and Title */}
        <Link href="/" className="flex items-center">
          <div className="flex items-center">
            <Image
              src="/logos/logo-transparent.png"
              alt="Uduuka Logo"
              width={100}
              height={100}
              priority
              className="rounded-md h-12 w-12"
            />
            <h1 className="ml-2 hidden sm:block text-2xl font-[900]">Uduuka</h1>
          </div>
        </Link>
        <div className="flex flex-1 justify-center items-center gap-2">
          <SearchBar />
        </div>
        <div className="hidden md:flex items-center gap-4">
          <Select
            options={env.currencyOptions as { label: string; value: string }[]}
            className="bg-background text-primary text-xs"
            triggerStyle="text-sm py-2 gap-1"
            value={currency}
            onChange={(c) => {
              setCurrency(c as Currency);
              localStorage.setItem("currency", c);
            }}
            placeholder="Currency"
          />
          <Dropdown
            align="right"
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
                      <strong className="font-bold text-foreground">not</strong>{" "}
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
          <Dropdown trigger={<BiBell size={30} />} align="right">
            <div className="bg-white shadow-lg rounded-lg h-40 w-60"></div>
          </Dropdown>

          {fetchingUser ? (
            <Button className="bg-background text-primary border-2 h-10 w-10 rounded-full p-0">
              <LoaderCircle className="animate-spin" />
            </Button>
          ) : (
            <>
              {user ? (
                <Popup
                  trigger={
                    <Button className="bg-transparent border-2 h-10 w-10 rounded-full p-0">
                      <Image
                        src={profile?.avatar_url ?? "/placeholder.svg"}
                        alt="avatar"
                        height={100}
                        width={100}
                        className="h-full w-full bg-cover rounded-full"
                      />
                    </Button>
                  }
                  align="diagonal-left"
                >
                  <div className="w-54 p-2">
                    <div className="h-20 w-20 bg-secondary rounded-full mx-auto">
                      <Image
                        src={profile?.avatar_url ?? "/placeholder.svg"}
                        alt="avatar"
                        height={100}
                        width={100}
                        className="h-full w-full bg-cover rounded-full"
                      />
                    </div>
                    <div className="py-2 text-accent border-b border-accent/50">
                      <h1 className="text-center py-2">
                        {user.user_metadata.username}
                      </h1>
                      <p className="text-center w-full">({user.email})</p>
                    </div>
                    <div className="space-y-3 pt-5">
                      <Link href="/dashboard/messages">
                        <Button className="bg-transparent hover:bg-secondary/80 text-foreground gap-2 w-full justify-start">
                          <BiEnvelope />
                          Messages
                        </Button>
                      </Link>
                      <Link href="/dashboard/notifications">
                        <Button className="bg-transparent hover:bg-secondary/80 text-foreground w-full justify-start gap-2">
                          <BiBell />
                          Notifications
                        </Button>
                      </Link>
                      <Link href="/dashboard">
                        <Button className="bg-transparent hover:bg-secondary/80 text-foreground w-full justify-start gap-2">
                          <RxDashboard />
                          Dashboard
                        </Button>
                      </Link>
                    </div>
                    <div className="pt-5 space-y-3">
                      <Link href="/dashboard/ads/create" className="block">
                        <Button className="bg-primary gap-2 text-background w-full">
                          <BiPlus />
                          Post Advert
                        </Button>
                      </Link>
                      <Button
                        onClick={handleSignout}
                        className="bg-error-background gap-2 text-error w-full"
                      >
                        <BiLock />
                        Logout
                      </Button>
                    </div>
                  </div>
                </Popup>
              ) : (
                <>
                  <Link href="/signin" className="hover:underline text-xs">
                    Sign In
                  </Link>
                  <div className="w-0.5 h-4 bg-background"></div>
                  <Link href="/signup" className="hover:underline text-xs">
                    Sign Up
                  </Link>
                </>
              )}
            </>
          )}
        </div>
        {/** Mobile nav */}
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
      </div>
      {/** Mobile nav */}
      {/* {showMobileNav && ( */}
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
            {user && (
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
                      {user.email || "No email provided"}
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
            {user ? (
              <Button
                onClick={handleSignout}
                className="hover:underline text-xs border border-background gap-2 bg-error-background px-5 py-1.5 rounded-lg text-error w-full font-bold text-center"
              >
                <Lock size={15} />
                Logout
              </Button>
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
      {/* )} */}
    </header>
  );
}
