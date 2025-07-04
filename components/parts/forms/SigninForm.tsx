"use client";

import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/Input";
import { getProfile, signin } from "@/lib/actions";
import { useAppStore } from "@/lib/store";
import { redirect, useSearchParams } from "next/navigation";
import React, { useState } from "react";

export default function SigninForm() {
  const { setUser, setProfile } = useAppStore();
  const next = useSearchParams().get("next");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleSignin = async () => {
    const { error, data } = await signin({ email, password });

    if (error) {
      setError(error.message);
      return;
    }

    if (data.user) {
      const profile = await getProfile(data.user.id);
      setUser(data.user);
      setProfile(profile.data);
      redirect(next ?? "/");
    }
  };

  return (
    <div className="w-full max-w-xs space-y-5 bg-white rounded-lg min-h-96 md:-ml-20 p-5">
      <h1 className="text-center text-accent">Welcome back, please sign in</h1>
      {error && <p className="text-error w-full text-center">{error}</p>}
      <FormInput
        placeholder="Username or email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="px-3 text-accent py-2"
        type="text"
      />
      <FormInput
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="px-3 text-accent py-2"
        type="password"
      />
      <Button
        onClick={handleSignin}
        className="bg-primary hover:bg-primary/95 text-background w-full py-2"
      >
        Submit
      </Button>

      <div className="relative mb-10">
        <p className="text-center w-fit mx-auto text-accent/90 bg-white px-2 z-10 top-[50%] left-[50%] translate-y-[50%]">
          Or continue with
        </p>
        <div className="bg-accent/80 w-full h-0.5"></div>
      </div>

      <Button className="bg-accent hover:bg-accent/95 text-background w-full py-2">
        Google
      </Button>
      <Button className="bg-secondary hover:bg-secondary/95 w-full py-2">
        Facebook
      </Button>
    </div>
  );
}
