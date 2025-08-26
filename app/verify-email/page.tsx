"use client";

import Button from "@/components/ui/Button";
import { resendVerificarionEmail } from "@/lib/actions";
import { CheckCircle, Info } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";

export default function VerifyEmailPage() {
  const [resentCount, setResentCount] = useState(0);
  const email = useSearchParams().get("email") as string | undefined;
  const handleResendVerificationLink = async () => {
    setResentCount((c) => c + 1);
    if (!email) {
      return;
    }
    const {} = await resendVerificarionEmail(email);
  };
  return (
    <div className="p-5">
      <div className="p-5 bg-white rounded-lg h-[90vh] w-full flex flex-col gap-5 pt-20 items-center">
        <div className="p-5 bg-green-50 space-y-5 text-success rounded-lg w-full max-w-sm">
          <p className="text-center flex gap-2 items-center w-full justify-center">
            <CheckCircle size={15} />
            Signup was successiful!
          </p>
          <p className="text-center font-thin text-xs">
            Check your email inbox and click the verification link sent. You
            will be authenticated and redirected.
          </p>
        </div>
        <div className="p-5 bg-yellow-50 text-yellow-500 rounded-lg w-full max-w-sm">
          <p className="flex gap-2 w-full  text-xs">
            <Info size={15} />
            Note: The verification link expires in 24 hours and can only be used
            once! You can resend verification emails only twice
          </p>
        </div>
        <Button
          onClick={handleResendVerificationLink}
          disabled={!email || resentCount >= 2}
          className="hover:bg-primary hover:text-background border border-primary text-primary bg-transparent disabled:opacity-40"
        >
          Resent verification link
        </Button>
      </div>
    </div>
  );
}
