"use client";

import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/Input";
import { updateUserPassword } from "@/lib/actions";
import { Eye, EyeOff, LoaderCircle, Lock } from "lucide-react";
import React, { useState, useTransition } from "react";

export default function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState<string>();
  const [sending, startSending] = useTransition();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleReset = () => {
    startSending(async () => {
      const { error, data } = await updateUserPassword(newPassword);

      if (error) {
        console.log({ error, data });
        setError(error.message);
        return;
      }
    });
  };

  return (
    <form className="space-y-5" action={handleReset}>
      {error && (
        <div className="p-5 bg-red-50 text-error rounded-lg text-center">
          {error}
        </div>
      )}
      <FormInput
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="Your new password"
        className="px-3 py-2"
        type={showPassword ? "text" : "password"}
        icon={
          <span className="px-2">
            <Lock size={15} />
          </span>
        }
        actionBtn={
          <span
            className="px-1 text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {!showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </span>
        }
      />
      <FormInput
        value={confirmNewPassword}
        onChange={(e) => setConfirmNewPassword(e.target.value)}
        placeholder="Confirm your new password"
        className="px-3 py-2"
        type={showConfirmPassword ? "text" : "password"}
        icon={
          <span className="px-2">
            <Lock size={15} />
          </span>
        }
        actionBtn={
          <span
            className="px-1 text-gray-600"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {!showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </span>
        }
      />
      <Button
        type="submit"
        className="bg-primary text-background hover:bg-primary/90 w-full"
      >
        {sending ? (
          <LoaderCircle className="animate-spin" />
        ) : (
          <>Reset password</>
        )}
      </Button>
    </form>
  );
}
