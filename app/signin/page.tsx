import SigninForm from "@/components/parts/forms/SigninForm";
import { getUser } from "@/lib/actions";
import Link from "next/link";
import React from "react";

export default async function page() {
  const { error, data } = await getUser();
  if (data.user) {
    return (
      <div className="p-5 min-h-96 flex flex-col gap-5 justify-center items-center">
        <h1 className="text-base font-thin">You'r already signed in.</h1>
        <Link
          href="/"
          className="w-60 bg-primary text-background px-5 py-2 rounded-lg text-center"
        >
          Continue shopping
        </Link>
        <Link
          href="/dashboard"
          className="w-60 bg-accent text-background px-5 py-2 rounded-lg text-center"
        >
          Go to dashboard
        </Link>
      </div>
    );
  }
  return (
    <div className="p-5 min-h-[70vh] pt-20 flex justify-center items-center">
      <SigninForm />
    </div>
  );
}
