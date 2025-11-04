import PriceTag from "@/components/parts/cards/PriceTag";
import Button from "@/components/ui/Button";
import { getProfile } from "@/lib/actions";
import {
  ArrowUp,
  Info,
  LocateIcon,
  MapPin,
  Pencil,
  Plus,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { BiMoney } from "react-icons/bi";
import { CiWarning } from "react-icons/ci";
import { TbUsersPlus } from "react-icons/tb";

export default async function DashboardPage() {
  const { data, error } = await getProfile();

  if (error) {
    return (
      <div className="bg-red-50 text-error p-5 text-xs font-thin text-center rounded-lg flex justify-center items-center gap-1">
        <CiWarning size={20} />
        <span>Failed to fetch your profile data!</span>
      </div>
    );
  }

  // if (!data) {
  //   return redirect("/dashboard/profile");
  // }

  const { subscription } = data ?? {
    subscription: {
      plan: "hobby",
      usage: { adImages: 0, ads: 0, storage: 0, stores: 0, flashSales: 0 },
      expires_at: undefined,
    },
  };
  const planName = subscription?.plan ?? "hobby";
  return (
    <div className="rounded-lg gap-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
      <div className="bg-white text-gray-500 shadow rounded-lg p-5">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">Account details</h1>
        </div>
        <div className="space-y-2 w-full">
          {data ? (
            <div className="">
              <p className="text-lg">{data.full_name}</p>
              <p className="">({data.name})</p>
              <p className="">{data.email}</p>
              <p className="">{data.phone ?? "No phone number registered"}</p>
              <p className="text-gray-400">{data?.about}</p>
              <Link href="/dashboard/profile" className="w-fit mt-5 block">
                <Button className="bg-transparent gap-1 text-primary text-xs border-primary hover:bg-primary hover:text-background border px-3 py-1">
                  <Pencil size={15} />
                  Edit profile
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <p className="flex gap-1 items-center mt-5">
                <Info size={20} />
                <span>You {"haven't"} set up your profile</span>
              </p>
              <Link href="/dashboard/profile" className="w-fit mt-2 block">
                <Button className="bg-transparent gap-2 p-1 px-5 text-primary text-xs border-primary hover:bg-primary hover:text-background border">
                  <UserPlus size={15} /> Set profile
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
      <div className="bg-white text-gray-500 shadow rounded-lg p-5">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">Address book</h1>
        </div>
        {data?.default_address ? (
          <>
            <p className="flex gap-1 items-center mt-5">
              <LocateIcon size={20} />
              <span>{data.default_address}</span>
            </p>
            <Link href="/dashboard/profile" className="w-fit mt-2 block">
              <Button className="bg-transparent gap-2 p-1 px-5 text-primary text-xs border-primary hover:bg-primary hover:text-background border">
                <MapPin size={15} /> Change address
              </Button>
            </Link>
          </>
        ) : (
          <>
            <p className="flex gap-1 items-center mt-5">
              <Info size={20} />
              <span>You {"haven't"} set up your shipping address</span>
            </p>
            <Link href="/dashboard/profile" className="w-fit mt-2 block">
              <Button className="bg-transparent gap-2 p-1 px-5 text-primary text-xs border-primary hover:bg-primary hover:text-background border">
                <MapPin size={15} /> Add address
              </Button>
            </Link>
          </>
        )}
      </div>
      <div className="bg-white text-gray-500 shadow rounded-lg p-5">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">Subscription</h1>
        </div>

        <p className="text-gray-400 font-light">
          Your current subscription plan is {planName} and is{" "}
          {planName === "hobby" ? (
            <>
              <span className="font-bold">Free forever</span>. It's the default
              plan for every user who signs up for an account.
            </>
          ) : planName === "pro" ? (
            <>
              charged{" "}
              <span className="font-bold">
                <PriceTag
                  pricing={{
                    currency: "UGX",
                    scheme: "fixed",
                    amount: 30000,
                    details: {},
                  }}
                />{" "}
                per month
              </span>
              .
            </>
          ) : (
            ""
          )}
        </p>
        <div className="flex gap-5">
          <Link
            href={
              planName === "hobby"
                ? `/dashboard/billing/pay?plan=pro`
                : "/support?q=entreprise"
            }
          >
            <Button className="bg-transparent gap-2 p-1 text-xs mt-5 sm:px-5 text-primary border-primary hover:bg-primary hover:text-background border">
              <ArrowUp size={15} />{" "}
              <span>
                {planName === "hobby" ? "Upgrade to pro" : "Go entreprise"}
              </span>
            </Button>
          </Link>
          <Link href="/pricing">
            <Button className="bg-transparent gap-2 p-1 text-xs mt-5 sm:px-5 text-primary border-primary hover:bg-primary hover:text-background border">
              <BiMoney size={15} /> See pricing
            </Button>
          </Link>
        </div>
      </div>
      <div className="bg-white text-gray-500 shadow rounded-lg p-5">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">Contacts & Connections</h1>
        </div>
        <div className="">
          {data ? (
            <>
              {data?.conections ? (
                <>
                  <p className="text-gray-400">
                    Followers:{" "}
                    <span className="font-bold text-gray-500">45</span>
                  </p>
                  <p className="text-gray-400">
                    Following:{" "}
                    <span className="font-bold text-gray-500">20</span>
                  </p>
                  <Button className="bg-transparent gap-2 p-1 text-xs mt-5 px-5 text-primary border-primary hover:bg-primary hover:text-background border">
                    <TbUsersPlus size={15} /> New connection
                  </Button>
                </>
              ) : (
                <>
                  <p className="flex gap-1 items-start mt-5">
                    <Info size={20} />
                    <span>
                      You have no connections. Find and connect with buyers and
                      sellers to enhance your shopping experience
                    </span>
                  </p>
                  <Button className="bg-transparent gap-2 p-1 text-xs mt-2 px-5 text-primary border-primary hover:bg-primary hover:text-background border">
                    <TbUsersPlus size={15} /> Connect
                  </Button>
                </>
              )}
            </>
          ) : (
            <>
              <p className="flex gap-1 items-center mt-5">
                <Info size={20} />
                <span>
                  Mising profile, create a profile to connect to buyers and
                  sellers
                </span>
              </p>
              <Link href="/dashboard/profile" className="w-fit mt-2 block">
                <Button className="bg-transparent gap-2 p-1 px-5 text-primary text-xs border-primary hover:bg-primary hover:text-background border">
                  <UserPlus size={15} /> Create profile
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
      <div className="sm:col-span-2 md:col-span-1 lg:col-span-2 p-5 bg-white text-gray-500 shadow rounded-lg">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">Settings & prefferences</h1>
        </div>
        <div className=""></div>
      </div>
    </div>
  );
}
