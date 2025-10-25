import SubscribeDialog from "@/components/parts/dialogs/SubscribeDialog";
import StoreForm from "@/components/parts/forms/StoreForm";
import Button from "@/components/ui/Button";
import { fetchPersonalStores, fetchStores, getProfile } from "@/lib/actions";
import env from "@/lib/env";
import { toNumber } from "@/lib/utils";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

export default async function StoreCreatePage() {
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

  if (!data) {
    return redirect("/dashboard/profile?next=create-store");
  }
  const { data: stores } = await fetchPersonalStores();
  const { subscription } = data;

  const planName = subscription?.plan ?? "hobby";
  const plan = env.subscriptionPlans[planName];
  return (
    <div className="bg-white rounded-lg p-5 space-y-5 max-w-md mx-auto shadow relative">
      <h1 className="text-center">Create a store</h1>
      <StoreForm />
      {planName === "hobby" &&
        toNumber(`${stores?.length ?? 0}`) >=
          toNumber(`${plan.limits?.stores}`) && (
          <SubscribeDialog
            message={`You can only create ${
              plan.limits?.stores ?? "limited"
            } stores with the ${planName} plan. Upgrade your plan to create more stores`}
          />
        )}
    </div>
  );
}
