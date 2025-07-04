"use client";

import Select from "@/components/ui/Select";
import { useAppStore } from "@/lib/store";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import env from "@/lib/env";
import Dropdown from "@/components/ui/Dropdown";
import { Check, MapPin, ShieldQuestion } from "lucide-react";
import SearchBar from "../forms/SearchBar";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Popup from "@/components/ui/Popup";
import { BiBell, BiEnvelope, BiLock, BiPlus, BiUser } from "react-icons/bi";
import { RxDashboard } from "react-icons/rx";
import { signout } from "@/lib/actions";
import { redirect } from "next/navigation";

export default function Navbar({ fetchingUser }: { fetchingUser?: boolean }) {
  const { currency, setCurrency, location, user, setUser } = useAppStore();
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
      <div className="px-5 mx-auto flex justify-between gap-2 items-center">
        <Link href="/" className="flex items-center">
          <div className="w-fit md:w-38 flex items-center">
            <Image
              src="/logos/logo-transparent.png"
              alt="Uduuka Logo"
              width={100}
              height={100}
              priority
              className="rounded-md h-12 w-12"
            />
            <h1 className="ml-2 text-2xl hidden font-[900] md:block">Uduuka</h1>
          </div>
        </Link>
        <div className="flex flex-1 justify-center items-center gap-2">
          <SearchBar />
          <Select
            options={env.currencyOptions}
            className="bg-background text-primary text-xs"
            triggerStyle="text-sm py-2 gap-1"
            value={currency}
            onChange={(c) => {
              setCurrency(c);
              localStorage.setItem("currency", c);
            }}
            placeholder="Currency"
          />
        </div>
        <div className="hidden md:flex items-center gap-4">
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
            <></>
          ) : (
            <>
              {user ? (
                <Popup
                  trigger={
                    <Button className="bg-transparent border-2 rounded-full p-1">
                      <BiUser size={25} />
                    </Button>
                  }
                  align="diagonal-left"
                >
                  <div className="w-54 p-2">
                    <div className="h-20 w-20 bg-secondary rounded-full mx-auto"></div>
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
      </div>
    </header>
  );
}
