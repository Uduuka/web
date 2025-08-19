import Button from "@/components/ui/Button";
import { fetchSubscriptions, getProfile, getUser } from "@/lib/actions";
import { ArrowUp, Info, Pencil, Plus, Users } from "lucide-react";
import Link from "next/link";
import React from "react";
import { BiMoney } from "react-icons/bi";
import { TbUsersPlus } from "react-icons/tb";

export default async function DashboardPage() {
  const { data: userData } = await getUser();
  const { data } = await getProfile(userData.user?.id!);
  const { subscription } = await fetchSubscriptions();
  const planName = subscription?.plan ?? "hobby";

  return (
    <div className="p-5 bg-white text-gray-500 rounded-lg gap-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
      <div className="border border-gray-400 rounded-lg">
        <div className="flex items-center justify-between px-5 py-2 border-b">
          <h1 className="text-lg font-bold">Account details</h1>
          <Link href="/dashboard/profile">
            <Button className="bg-transparent text-primary border-primary hover:bg-primary hover:text-background border p-1">
              <Pencil size={15} />
            </Button>
          </Link>
        </div>
        <div className="p-5 space-y-2 w-full">
          {data ? (
            <>
              <p className="text-lg">{data.full_names}</p>
              <p className="">{data.email}</p>
              <p className="">{data.phone}</p>
              <p className="text-gray-400">{data?.about}</p>
            </>
          ) : (
            <>
              <p className="flex gap-2 items-center justify-center w-full">
                <Info size={20} />
                <span>Missing profile</span>
              </p>
              <Link href="/dashboard/profile">
                <Button className="mx-auto mt-4 px-5">
                  Create your profile
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
      <div className="border border-gray-400 rounded-lg">
        <div className="flex items-center justify-between px-5 py-2 border-b">
          <h1 className="text-lg font-bold">Address book</h1>
        </div>
        <div className="p-5">
          <h1 className="text-lg">Your default shipping address</h1>
          <p className="text-gray-400 font-light">
            No default shipping address is available
          </p>
          <Button className="bg-transparent gap-2 p-2 mt-5 px-5 text-primary border-primary hover:bg-primary hover:text-background border">
            <Plus size={15} /> Add a default shippind address
          </Button>
        </div>
      </div>
      <div className="border border-gray-400 rounded-lg">
        <div className="flex items-center justify-between px-5 py-2 border-b">
          <h1 className="text-lg font-bold">Subscription</h1>
        </div>
        <div className="p-5">
          <h1 className="text-lg">Your subscription plan</h1>
          <p className="text-gray-400 font-light">
            Your current subscription plan is {planName} and is{" "}
            {planName === "hobby" ? (
              <>
                <span className="font-bold">Free forever</span>. It's the
                default plan for every user who signs up for an account.
              </>
            ) : planName === "pro" ? (
              ""
            ) : (
              ""
            )}
          </p>
          <div className="flex gap-5">
            <Button className="bg-transparent gap-2 p-2 mt-5 sm:px-5 text-primary border-primary hover:bg-primary hover:text-background border">
              <ArrowUp size={15} /> Upgrade to pro
            </Button>
            <Button className="bg-transparent gap-2 p-2 mt-5 sm:px-5 text-primary border-primary hover:bg-primary hover:text-background border">
              <BiMoney size={15} /> See pricing
            </Button>
          </div>
        </div>
      </div>
      <div className="border border-gray-400 rounded-lg">
        <div className="flex items-center justify-between px-5 py-2 border-b">
          <h1 className="text-lg font-bold">Contacts & Connections</h1>
        </div>
        <div className="p-5">
          <h1 className="text-lg">People you can get in touch</h1>
          <p className="text-gray-400">
            Followers: <span className="font-bold text-gray-500">45</span>
          </p>
          <p className="text-gray-400">
            Following: <span className="font-bold text-gray-500">20</span>
          </p>
          <Button className="bg-transparent gap-2 p-2 mt-5 px-5 text-primary border-primary hover:bg-primary hover:text-background border">
            <TbUsersPlus size={15} /> Find more people
          </Button>
        </div>
      </div>
      <div className="sm:col-span-2 md:col-span-1 lg:col-span-2 border border-gray-400 rounded-lg">
        <div className="flex items-center justify-between px-5 py-2 border-b">
          <h1 className="text-lg font-bold">Settings & prefferences</h1>
        </div>
        <div className="p-5">
          <h1 className="text-lg">
            Adjust your settings and prefferences here.
          </h1>
        </div>
      </div>
    </div>
  );
}
