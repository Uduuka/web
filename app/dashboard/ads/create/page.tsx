import SubscribeDialog from "@/components/parts/dialogs/SubscribeDialog";
import CreateAdForm from "@/components/parts/forms/CreateAdForm";
import Button from "@/components/ui/Button";
import { getProfile } from "@/lib/actions";
import env from "@/lib/env";
import { toNumber } from "@/lib/utils";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

export default async function CreateAdPage() {
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
    return redirect("/dashboard/profile?next=create-ad");
  }
  const { subscription } = data;
  const plan = env.subscriptionPlans[subscription?.plan ?? "hobby"];

  return (
    <div className="p-5 h-[90vh] relative">
      {toNumber(`${subscription?.usage?.ads}`) >=
        toNumber(`${plan.limits?.ads}`) && (
        <SubscribeDialog message="Oops!, you have reached your free ads limit. Upgrade to pro create more ads." />
      )}
      <div className="w-full max-w-md mx-auto rounded-lg h-full overflow-hidden">
        <CreateAdForm className="bg-white shadow-lg text-foreground" />
      </div>
    </div>
  );
}
