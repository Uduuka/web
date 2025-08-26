import ResetPasswordForm from "@/components/parts/forms/ResetPasswordForm";
import React from "react";

export default function ResetPasswordPage() {
  return (
    <div className="p-5">
      <div className="p-5 bg-white rounded-lg h-[90vh]">
        <div className="h-96 flex justify-center items-center">
          <div className="w-full space-y-5  max-w-sm mx-auto shadow-2xl rounded-lg p-5">
            <h1 className="text-center text-xl text-gray-500 font-bold">
              Reset password
            </h1>
            <p className="text-gray-500 font-thin text">
              Provide a new secure password the you will remember.
            </p>
            <ResetPasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
}
