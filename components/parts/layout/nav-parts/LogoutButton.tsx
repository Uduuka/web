"use client";

import Button from "@/components/ui/Button";
import { signout } from "@/lib/actions";
import { Lock } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";

export default function LogoutButton() {
  const handleSignout = async () => {
    const { error } = await signout();
    if (error) {
      console.log(error.message);
      return;
    }
    redirect("/");
  };
  return (
    <Button
      onClick={handleSignout}
      className="hover:underline text-xs border border-background gap-2 bg-error-background px-5 py-1.5 rounded-lg text-error w-full font-bold text-center"
    >
      <Lock size={15} />
      Logout
    </Button>
  );
}
