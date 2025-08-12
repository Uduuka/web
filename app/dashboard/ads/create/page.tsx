import SubscribeDialog from "@/components/parts/dialogs/SubscribeDialog";
import CreateAdForm from "@/components/parts/forms/CreateAdForm";
import { fetchSubscriptions } from "@/lib/actions";
import env from "@/lib/env";
import React from "react";

export default async function CreateAdPage() {
  const { adsCount, error, subscription } = await fetchSubscriptions();
  const plan = env.subscriptionPlans[subscription?.plan ?? "hobby"];

  return (
    <div className="p-5 h-[90vh] relative">
      {adsCount && adsCount >= plan.limits.ads && (
        <SubscribeDialog message="Oops!, you have reached your free ads limit. Upgrade to pro create more ads." />
      )}
      <div className="w-full max-w-md mx-auto rounded-lg h-full overflow-hidden">
        <CreateAdForm className="bg-white shadow-lg text-foreground" />
      </div>
    </div>
  );
}
