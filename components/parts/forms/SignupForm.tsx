"use client";

import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/Input";
import { getProfile, signup } from "@/lib/actions";
import { useAppStore } from "@/lib/store";
import { redirect, useSearchParams } from "next/navigation";
import React, { useState } from "react";

export default function SignupForm() {
  const { setUser, setProfile } = useAppStore();
  const next = useSearchParams().get("next");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");

  const handleSignup = async () => {
    const { error, data } = await signup({ email, password });

    if (error) {
      console.log({ error });
      setError(error.message);
      return;
    }

    if (data.user) {
      const profile = await getProfile(data.user.id);
      setProfile(profile.data);
      setUser(data.user);
      redirect(next ?? "/");
    }
  };

  return (
    <div className="w-full max-w-xs space-y-5 bg-white rounded-lg min-h-96 md:-ml-20 p-5">
      <h1 className="text-center text-accent">
        Welcome, please create your account.
        <br />
        <span className="text-xs font-thin">
          Never miss on a deal near you.
        </span>
      </h1>
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
      <FormInput
        placeholder="Confirm password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="px-3 text-accent py-2"
        type="password"
      />
      <Button
        onClick={handleSignup}
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
