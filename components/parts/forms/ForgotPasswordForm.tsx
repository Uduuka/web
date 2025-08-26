"use client";

import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/Input";
import { sendPasswordResetEmail } from "@/lib/actions";
import { CheckCircle, Info, LoaderCircle, Mail } from "lucide-react";
import React, { useState, useTransition } from "react";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [sending, startSending] = useTransition();
  const [success, setSuccess] = useState<boolean>();

  const handleVerify = () => {
    startSending(async () => {
      const { error, data } = await sendPasswordResetEmail(email);

      if (error) {
        console.log({ error, data });
        setError(error.message);
        return;
      }

      setSuccess(true);
    });
  };

  if (success) {
    return (
      <div className="p-5 bg-green-50 text-success rounded-lg">
        <p className="flex gap-2 items-start font-semibold">
          <CheckCircle size={18} />{" "}
          <span>
            Check your inbox <br />
            <span className="text-xs font-light">
              Password reset link has been sent to your rmail address
            </span>
          </span>
        </p>
      </div>
    );
  }
  return (
    <form className="space-y-5" action={handleVerify}>
      {error && (
        <div className="p-5 bg-red-50 text-error rounded-lg text-center">
          {error}
        </div>
      )}
      <FormInput
        value={email}
        icon={
          <span className="px-2">
            <Mail size={15} />
          </span>
        }
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        className="py-2 px-0"
        type="email"
        name="email"
      />
      <Button
        type="submit"
        className="bg-primary text-background hover:bg-primary/90 w-full"
      >
        {sending ? (
          <LoaderCircle className="animate-spin" />
        ) : (
          <>Verify email</>
        )}
      </Button>
    </form>
  );
}
