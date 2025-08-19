import SubscribeDialog from "@/components/parts/dialogs/SubscribeDialog";
import StoreForm from "@/components/parts/forms/StoreForm";
import { fetchSubscriptions } from "@/lib/actions";
import env from "@/lib/env";
import React from "react";

export default async function StoreCreatePage() {
  const { subscription, usage, error } = await fetchSubscriptions();
  const planName = subscription?.plan ?? "hobby";
  const plan = env.subscriptionPlans[planName];
  return (
    <div className="bg-white rounded-lg p-5 space-y-5 max-w-md mx-auto shadow relative">
      <h1 className="text-center">Create a store</h1>

      <StoreForm />

      {planName === "hobby" && usage.stores >= plan.limits.stores && (
        <SubscribeDialog
          message={`You can only create ${plan.limits.stores} stores with the ${planName} plan. Upgrade your plan to create more stores`}
        />
      )}
    </div>
  );
}
