"use client";

import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/Input";
import { useAppStore } from "@/lib/store";
import React from "react";

export default function SigninForm() {
  const { setUser } = useAppStore();
  const handleSignin = () => {
    setUser({
      id: "1",
      email: "davy.kyute@gmail.com",
      avarta: "",
      username: "Egessa",
    });
  };
  return (
    <div className="w-full max-w-xs space-y-5 bg-white rounded-lg min-h-96 md:-ml-20 p-5">
      <h1 className="text-center text-accent">Welcome back, please sign in</h1>
      <FormInput
        placeholder="Username or email"
        className="px-3 text-accent py-2"
        type="text"
      />
      <FormInput
        placeholder="Password"
        className="px-3 text-accent py-2"
        type="text"
      />
      <Button
        onClick={handleSignin}
        className="bg-primary text-background w-full py-2"
      >
        Submit
      </Button>

      <div className="relative">
        <p className="text-center w-fit mx-auto text-accent/90 bg-white px-2 z-10 top-[50%] left-[50%] translate-y-[50%]">
          Or continue with
        </p>
        <div className="bg-accent/80 w-full h-0.5"></div>
      </div>

      <Button className="bg-accent text-background w-full py-2">Google</Button>
      <Button className="bg-secondary w-full py-2">Facebook</Button>
    </div>
  );
}
