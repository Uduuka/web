"use client";

import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/Input";
import { signin } from "@/lib/actions";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, LoaderCircle, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { redirect, useSearchParams } from "next/navigation";
import React, { useState, useTransition } from "react";
import { GrGoogle } from "react-icons/gr";

export default function SigninForm() {
  const next = useSearchParams().get("next");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submiting, startSubmiting] = useTransition();

  const handleSignin = () => {
    startSubmiting(async () => {
      const { error, data } = await signin({ email, password });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        redirect(next ?? "/");
      }
    });
  };

  const handleSigninWithGoogle = async () => {
    const supabase = createClient();
    let redirectTo =
      process.env.NEXT_PUBLIC_SITE_URL ??
      process.env.NEXT_PUBLIC_VERCEL_URL ??
      "http://localhost:3000";
    redirectTo = redirectTo.startsWith("http")
      ? redirectTo
      : `https://${redirectTo}`;
    redirectTo = redirectTo.endsWith("/")
      ? `${redirectTo}auth`
      : `${redirectTo}/auth`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });

    if (error) {
      setError(error.message);
      return;
    }
  };

  return (
    <form
      action={handleSignin}
      className="w-full max-w-xs space-y-5 bg-white rounded-lg min-h-96 md:-ml-20 p-5"
    >
      <h1 className="text-accent text-xl font-bold">Welcome back, sign in</h1>
      <p className="text-sm -mt-5 text-gray-500">
        To never miss on a deal near you.
      </p>
      {error && <p className="text-error w-full text-center">{error}</p>}
      <div className="flex gap-5">
        <Button
          onClick={handleSigninWithGoogle}
          type="button"
          className="p-0 gap-2 px-5 py-2 text-primary w-full font-bold hover:bg-secondary shadow"
        >
          <GrGoogle size={20} />
          Signin with Google
        </Button>
      </div>
      <div className="relative mb-10">
        <p className="text-center w-fit mx-auto text-accent/90 bg-white px-2 z-10 top-[50%] left-[50%] translate-y-[50%]">
          Or continue with
        </p>
        <div className="bg-accent/80 w-full h-0.5"></div>
      </div>
      <FormInput
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="px-0 pr-3 text-accent py-2"
        // type="email"
        icon={
          <span className="px-2">
            <Mail size={15} />
          </span>
        }
        required
      />
      <FormInput
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="px-0 pr-3 text-accent py-2"
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
        required
      />
      <Button
        type="submit"
        className="bg-primary hover:bg-primary/95 text-background w-full py-2"
      >
        {submiting ? <LoaderCircle className="animate-spin" /> : <>Signin</>}
      </Button>
      <p className="text-center text-xs text-gray-500">
        Not yet a member?{" "}
        <Link href="/signup">
          <span className="text-blue-500 hover:underline">Signup</span>
        </Link>{" "}
        or{" "}
        <Link href="/forgot-password">
          <span className="text-blue-500 line-clamp-1 hover:underline">
            Forgot password
          </span>
        </Link>
      </p>
    </form>
  );
}
