"use client";

import Button from "@/components/ui/Button";
import Popup from "@/components/ui/Popup";
import { Profile } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import React, { use } from "react";
import LogoutButton from "./LogoutButton";
import { LiaUserLockSolid } from "react-icons/lia";
import { User } from "lucide-react";
import Modal from "../../models/Modal";
import { useParams, usePathname } from "next/navigation";
import { DashboardNav, StoreNav } from "../SideBar";
import { RxDashboard } from "react-icons/rx";
import { BiPlus } from "react-icons/bi";

export default function UserProfile({
  profilePromise,
}: {
  profilePromise: Promise<{
    data: Profile | null;
    error: { message: string } | null;
  }>;
}) {
  const { data: profile } = use(profilePromise);
  const pathName = usePathname();
  const storeID = useParams()["storeID"] as string;
  return (
    <>
      {profile ? (
        <Popup
          trigger={
            <Button className="bg-transparent flex border-2 h-10 w-10 rounded-full p-0">
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
              <h1 className="text-center py-2">{profile.full_name}</h1>
              <p className="text-center w-full">({profile.email})</p>
            </div>
            <div className="space-y-3 pt-5 md:hidden">
              {pathName.startsWith("/dashboard") ? (
                storeID && pathName.includes(storeID) ? (
                  <StoreNav className="text-gray-500" />
                ) : (
                  <DashboardNav className="text-gray-500" />
                )
              ) : null}
            </div>
            <div className="pt-5 space-y-3">
              {!pathName.startsWith("/dashboard") && (
                <Link href="/dashboard" className="block">
                  <Button className="bg-secondary/80 hover:bg-secondary text-foreground w-full justify-start gap-2">
                    <RxDashboard className="" />
                    Dashboard
                  </Button>
                </Link>
              )}
              <Link href="/dashboard/ads/create" className="block">
                <Button className="bg-primary gap-2 text-background w-full">
                  <BiPlus />
                  Post Advert
                </Button>
              </Link>
              <LogoutButton />
            </div>
          </div>
        </Popup>
      ) : (
        <Modal
          trigger={<LiaUserLockSolid size={32} className="-mt-1" />}
          triggerStyle="bg-transparent p-0"
          header="Welcome"
        >
          <form
            method="dialog"
            className="text-center p-5 flex flex-col gap-5 justify-center w-full items-center text-gray-500"
          >
            <div className="w-20 h-20 bg-secondary rounded-full flex justify-center items-center">
              <User size={40} />
            </div>
            <h1 className="text-base text-primary font-bold">
              Doline marketplace
            </h1>
            <p className="font-ligth">
              Sign in or create an account to access your account and enjoy
              personalized shopping experience
            </p>
            <Link href="/signin" className="block w-full">
              <Button className="bg-primary text-background border-primary border font-bold hover:bg-orange-400 w-full">
                Signin
              </Button>
            </Link>
            <Link href="/signup" className="block w-full">
              <Button className="bg-transparent text-primary font-bold hover:bg-orange-50 border-primary border w-full">
                Create account
              </Button>
            </Link>
            <div className="w-full h-0.5 bg-secondary my-5"></div>
            <div className="pb-10">
              <Button>Contact support</Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
