import Button from "@/components/ui/Button";
import { getProfile } from "@/lib/actions";
import env from "@/lib/env";
import { toNumber } from "@/lib/utils";
import { Check } from "lucide-react";
import Link from "next/link";
import React from "react";

export default async function SubscriptionPage() {
  const { data, error } = await getProfile();

  if (error) {
    return (
      <div className="flex flex-col gap-5 text-accent">
        <div className="flex justify-center items-center py-20">
          <div className="bg-red-50 p-5 shadow rounded-lg text-error font-light text-center">
            <p>
              An error occured while fetching subscription data. <br /> Check
              your internet conectivity and try again or contact support.
            </p>
            <Link href="#">
              <Button className="bg-primary text-background mt-3 mx-auto">
                Contact support
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { subscription } = data ?? {
    subscription: {
      plan: "hobby",
      usage: { adImages: 0, ads: 0, storage: 0, stores: 0, flashSales: 0 },
      expires_at: undefined,
    },
  };
  const plan = env.subscriptionPlans[subscription?.plan ?? "hobby"];

  return (
    <div className="flex flex-col gap-5 text-accent">
      <div className="p-5 bg-white shadow rounded-lg">
        <h1 className="text-2xl font-bold">Subscription & Billing</h1>
        <p>
          Manage your subscription, view subscription?.usage?, and billing
          history
        </p>
      </div>
      <div className="flex flex-col lg:flex-row gap-5 w-full">
        <div className="flex flex-col w-full gap-5 lg:w-2/3">
          <div className="bg-white rounded-lg p-5 shadow w-full">
            <div className="flex gap-5 justify-between">
              <p className="line-clamp-1 mb-2">Current plan</p>
              <p className="bg-green-50 text-xs text-success px-3 py-1 rounded-full">
                Active
              </p>
            </div>
            <div className="flex gap-5 justify-between">
              <div className="">
                <p className="text-2xl font-bold">{subscription?.plan}</p>
                <p className="text-primary text-sm font-bold">
                  {plan.pricing}{" "}
                  {plan.pricing === "Free" ? (
                    <span className="text-xs text-gray-500 font-light">
                      - Forever
                    </span>
                  ) : (
                    <span className="text-xs text-gray-500 font-light">
                      {" "}
                      / Month
                    </span>
                  )}
                </p>
              </div>
              <div className="text-xs mt-2">
                <p className="font-bold">Next billing</p>
                <p className="">
                  {subscription?.expires_at
                    ? new Date(subscription.expires_at).toDateString()
                    : "Never"}
                </p>
              </div>
            </div>
            <div className="">
              <h1 className="text-base font-[700] text-accent/50">
                {!subscription?.plan
                  ? "Includes"
                  : subscription.plan === "pro"
                  ? "Everything in hobby plus"
                  : "Everything in pro plus"}
              </h1>
              {plan.features?.map((feature: string, index: number) => (
                <p
                  key={index}
                  className="flex gap-1 text-accent items-center mb-1"
                >
                  <Check size={15} className="text-primary" /> {feature}
                </p>
              ))}
            </div>
            <div className="flex gap-5">
              <Link
                href={
                  subscription?.plan === "entreprise"
                    ? "/support"
                    : "/dashboard/billing/pay?plan=pro"
                }
              >
                <Button className="bg-primary w-full text-background">
                  {subscription?.plan === "entreprise"
                    ? "Contact support"
                    : "Upgrade plan"}
                </Button>
              </Link>
              {subscription?.plan && subscription.plan !== "hobby" && (
                <Button className="bg-transparent border border-error text-error hover:bg-error hover:text-background">
                  Cancel subscription
                </Button>
              )}
              <Link href="/pricing">
                <Button className="bg-transparent border border-primary text-primary hover:bg-primary hover:text-background">
                  See all plans
                </Button>
              </Link>
            </div>
          </div>
          <div className="bg-white flex-1 rounded-lg shadow p-5 flex flex-col gap-5 col-span-3">
            <h1 className="text-lg font-bold">Billing history</h1>
            <p className="text-accent/50">
              No billing records available. <br /> Your billing history will
              appear here once you make any payments.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-5 w-full lg:w-1/3">
          {subscription?.usage && (
            <div className="bg-white col-span-2 rounded-lg shadow p-5 flex flex-col gap-5">
              <h1 className="text-lg font-bold">Usage</h1>
              <div className="space-y-3 flex-1 pb-5">
                <div className="">
                  <p className="text-accent flex justify-between">
                    <span>Ads</span>
                    <span>
                      {subscription?.usage?.ads}/{plan.limits!["ads"]}
                    </span>
                  </p>
                  <div className="w-full border rounded-full border-primary">
                    <div
                      className="h-2 bg-primary rounded-full"
                      style={{
                        width:
                          (subscription.usage.ads ??
                            0 / toNumber(`${plan.limits!["ads"]}`)) *
                            100 +
                          "%",
                      }}
                    />
                  </div>
                </div>

                <div className="">
                  <p className="text-accent flex justify-between">
                    <span>Stores</span>
                    <span>
                      {subscription?.usage?.stores}/{plan.limits!["stores"]}
                    </span>
                  </p>
                  <div className="w-full border rounded-full border-primary">
                    <div
                      className="h-2 bg-primary rounded-full"
                      style={{
                        width:
                          (subscription.usage.stores ??
                            0 / toNumber(`${plan.limits!["stores"]}`)) *
                            100 +
                          "%",
                      }}
                    />
                  </div>
                </div>

                <div className="">
                  <p className="text-accent flex justify-between">
                    <span>Flash sales</span>
                    <span>
                      {subscription.usage.flashSales}/
                      {plan.limits!["flashSales"]}
                    </span>
                  </p>
                  <div className="w-full border rounded-full border-primary">
                    <div
                      className="h-2 bg-primary rounded-full"
                      style={{
                        width:
                          (subscription.usage.flashSales ??
                            0 / toNumber(`${plan.limits!["flashSales"]}`)) *
                            100 +
                          "%",
                      }}
                    />
                  </div>
                </div>

                <div className="">
                  <p className="text-accent flex justify-between">
                    <span>Ad images</span>
                    <span>{subscription.usage.storage}/25</span>
                  </p>
                  <div className="w-full border rounded-full border-primary">
                    <div
                      className="h-2 bg-primary rounded-full"
                      style={{
                        width:
                          (subscription.usage.storage ?? 0 / 25) * 100 + "%",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="bg-white p-5 col-span-2 sm:col-span-1 lg:col-span-2 rounded-lg shadow space-y-5">
            <h1 className="text-lg font-bold">Payment methods</h1>
            <p className="text-accent/50">
              The payment method you use for your subscriptions will be
              automatically added here.
            </p>
          </div>
          <div className="bg-white p-5 col-span-2 sm:col-span-1 lg:col-span-2 rounded-lg shadow space-y-5">
            <h1 className="text-lg font-bold">Support</h1>
            <p className="text-accent/50">
              Our 24/7 support team is ready to answer your questions and help
              you with any issues you may have.
            </p>
            <Button className="bg-primary text-background">
              Contact support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
