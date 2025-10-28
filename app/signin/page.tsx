import SigninForm from "@/components/parts/forms/SigninForm";
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
    <div className="min-h-[70vh] flex justify-center items-center">
      <SigninForm />
    </div>
  );
}
