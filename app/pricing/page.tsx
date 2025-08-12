import Button from "@/components/ui/Button";
import { fetchSubscriptions } from "@/lib/actions";
import { Check, Info } from "lucide-react";
import Link from "next/link";
import React from "react";

export default async function PricingPage() {
  const { subscription } = await fetchSubscriptions();
  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="bg-white rounded-lg p-5 shadow">
        <h1 className="text-xl font-bold">Pricing</h1>
        <p className="text-accent">
          Please choose a pricing that works for you
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="p-5 bg-white shadow hover:shadow-2xl flex flex-col transition-shadow rounded-lg">
          <div className="border-b border-accent/30 pb-5">
            <h1 className="text-lg flex gap-2 items-center line-clamp-1">
              Hobby{" "}
              <Button className="px-3 py-1 text-xs text-accent">
                Current plan
              </Button>
            </h1>
            <h1 className="text-4xl text-primary mt-3 font-[700]">
              Free{" "}
              <span className="text-sm text-accent/50 font-normal">
                Forever
              </span>
            </h1>
            {subscription?.plan === "hobby" ? (
              <p className="text-success line-clamp-1 py-2 text-sm mx-auto mt-5 flex items-center gap-1">
                <Check size={15} />
                You are currently subscribed to this plan.
              </p>
            ) : (
              <Link href="/dashboard/billing/pay?plan=hobby">
                <Button className="px-5 py-2 text-sm mx-auto mt-5">
                  Activate this plan
                </Button>
              </Link>
            )}
          </div>
          <div className="flex-1 border-b border-accent/30 pb-5">
            <h1 className="text-base font-[700] text-accent/50 pt-5">
              Includes
            </h1>
            <p className="flex gap-1 text-accent items-center mb-1">
              <Check size={15} className="text-primary" /> Unlimited ad browsing
            </p>
            <p className="flex gap-1 text-accent items-center mb-1">
              <Check size={15} className="text-primary" /> Map viewing
            </p>
            <p className="flex gap-1 text-accent items-center mb-1">
              <Check size={15} className="text-primary" /> Ad listings upto 5
              ads
            </p>
            <p className="flex gap-1 text-accent items-center mb-1 line-clamp-1">
              <Check size={15} className="text-primary" />{" "}
              <span className="line-clamp-1">
                Up to 5 images per ad (up to 10MB each images)
              </span>
            </p>
            <p className="flex gap-1 text-accent items-center mb-1">
              <Check size={15} className="text-primary" /> In app real time chat
            </p>
            <p className="flex gap-1 text-accent items-center mb-1">
              <Check size={15} className="text-primary" /> Pro for the first
              week
            </p>
          </div>
          <p className="pt-5 text-accent">
            Ads are set to in-active state if they are not browsed in for two
            week
          </p>
          <p className="bg-green-50 flex text-xs items-center gap-1 text-success p-2 rounded-md mt-3">
            <Info className="h-8 w-8" />
            <span className="line-clamp-2 flex-1">
              This plan is auto activated when a user signs up for an account.
            </span>
          </p>
        </div>
        <div className="p-5 bg-white shadow hover:shadow-2xl flex flex-col transition-shadow rounded-lg">
          <div className="border-b border-accent/30 pb-5">
            <h1 className="text-lg">Pro</h1>
            <h1 className="text-4xl text-primary mt-3 font-[700]">
              Ugx 24,900
              <span className="text-sm text-accent/50 font-normal">
                / Month
              </span>
            </h1>
            {subscription?.plan === "pro" ? (
              <p className="text-success line-clamp-1 py-2 text-sm mx-auto mt-5 flex items-center gap-1">
                <Check size={15} />
                You are currently subscribed to this plan.
              </p>
            ) : (
              <Link href="/dashboard/billing/pay?plan=pro">
                <Button className="px-5 py-2 bg-primary hover:bg-primary/90 transition-shadow text-background text-sm mx-auto mt-5">
                  Upgrade to pro
                </Button>
              </Link>
            )}
          </div>
          <div className="flex-1 border-b border-accent/30 pb-5">
            <h1 className="text-base font-[700] text-accent/50 pt-5">
              Everything in hobby plus
            </h1>
            <p className="flex gap-1 text-accent items-center mb-1">
              <Check size={15} className="text-primary" /> Unlimited ads listing
            </p>{" "}
            <p className="flex gap-1 text-accent items-center mb-1">
              <Check size={15} className="text-primary" /> Upto five stores
            </p>{" "}
            <p className="flex gap-1 text-accent items-center mb-1">
              <Check size={15} className="text-primary" /> A mini POS system per
              store
            </p>{" "}
            <p className="flex gap-1 text-accent items-center mb-1">
              <Check size={15} className="text-primary" /> AI tool set
            </p>{" "}
            <p className="flex gap-1 text-accent items-center mb-1">
              <Check size={15} className="text-primary" /> Upto 10 flash sales
            </p>
            <p className="flex gap-1 text-accent items-center mb-1">
              <Check size={15} className="text-primary" /> One free ad promotion
              per week
            </p>
            <p className="flex gap-1 text-accent items-center mb-1">
              <Check size={15} className="text-primary" /> Pricing promotions
            </p>
            <p className="flex gap-1 text-accent items-center mb-1">
              <Check size={15} className="text-primary" /> And much more
            </p>
          </div>
          <p className="pt-5 text-accent line-clamp-2">
            Ads remain active untill they are intensionally deleted or archived
            by the seller
          </p>
          <p className="bg-green-50 flex text-xs items-center gap-1 text-success p-2 rounded-md mt-3">
            <Info className="h-8 w-8" />
            <span className="line-clamp-2 flex-1">
              This plan is maximises sales for sellers with shops or stores.
            </span>
          </p>
        </div>
        <div className="p-5 bg-white shadow hover:shadow-2xl  flex flex-col transition-shadow rounded-lg">
          <div className="border-b border-accent/30 pb-5">
            <h1 className="text-lg">Entreprise</h1>
            <h1 className="text-4xl text-primary mt-3 font-[700]">
              Ugx 99,000
              <span className="text-sm text-accent/50 font-normal">
                / Month
              </span>
            </h1>
            {subscription?.plan === "pro" ? (
              <p className="text-success line-clamp-1 py-2 text-sm mx-auto mt-5 flex items-center gap-1">
                <Check size={15} />
                You are currently subscribed to this plan.
              </p>
            ) : (
              <Link href="/dashboard/billing/pay?plan=entreprise">
                <Button className="px-5 py-2 bg-primary hover:bg-primary/90 transition-shadow text-background text-sm mx-auto mt-5">
                  Go Entreprise
                </Button>
              </Link>
            )}
          </div>
          <div className="flex-1 border-b border-accent/30 pb-5">
            <h1 className="text-base font-[700] text-accent/50 pt-5">
              Everything in pro plus
            </h1>
            <p className="flex gap-1 text-accent items-center mb-1">
              <Check size={15} className="text-primary" /> Unlimited stores
            </p>
            <p className="flex gap-1 text-accent items-center mb-1">
              <Check size={15} className="text-primary" /> AI powered POS system
            </p>
            <p className="flex gap-1 text-accent items-center mb-1">
              <Check size={15} className="text-primary" /> POS system remote
              access
            </p>
            <p className="flex gap-1 text-accent items-center mb-1">
              <Check size={15} className="text-primary" /> AI powered ad
              promotions
            </p>
            <p className="flex gap-1 text-accent items-center mb-1">
              <Check size={15} className="text-primary" /> Custome store domain
              name
            </p>
            <p className="flex gap-1 text-accent items-center mb-1">
              <Check size={15} className="text-primary" /> Custome features
            </p>
          </div>
          <p className="pt-5 text-accent line-clamp-2">
            Ads remain active untill they are intensionally deleted or archived
            by the seller
          </p>
          <p className="bg-green-50 flex text-xs items-center gap-1 text-success p-2 rounded-md mt-3">
            <Info className="h-8 w-8" />
            <span className="line-clamp-2 flex-1">
              This plan is maximises sales for sellers with shops or stores.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
