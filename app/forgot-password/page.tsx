import ForgotPasswordForm from "@/components/parts/forms/ForgotPasswordForm";
import React from "react";

export default function ForgotPasswordPage() {
  return (
    <div className="p-5">
      <div className="p-5 bg-white rounded-lg h-[90vh]">
        <div className="h-96 flex justify-center items-center">
          <div className="w-full space-y-5  max-w-sm mx-auto shadow-2xl rounded-lg p-5">
            <h1 className="text-center text-xl text-gray-500 font-bold">
              Forgot password
            </h1>
            <p className="text-gray-500 font-thin text">
              You can always reset your password as long as you still have
              access to the email address you used while opening your account.
            </p>
            <ForgotPasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
}
