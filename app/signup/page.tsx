import SignupForm from "@/components/parts/forms/SignupForm";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import React from "react";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ next: string }>;
}) {
  const { data } = await (await createClient()).auth.getUser();
  const { next } = await searchParams;

  if (data.user) {
    if (next) {
      return redirect(next);
    }
    return redirect("/dashboard");
  }
  return (
    <div className="w-full pt-5 flex min-h-[70vh] justify-center items-center">
      <SignupForm />
    </div>
  );
}
