"use client";

import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/Input";
import { getProfile, signup } from "@/lib/actions";
import { useAppStore } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";
import { Profile } from "@/lib/types";
import { getRedirectUrl } from "@/lib/utils";
import {
  Eye,
  EyeOff,
  LoaderCircle,
  Lock,
  Mail,
  User,
  UserSearch,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useState, useTransition } from "react";
import { GrGoogle } from "react-icons/gr";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profile, setProfile] = useState<Profile>();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submiting, startSubmiting] = useTransition();

  const handleSignupWithEmail = () => {
    startSubmiting(async () => {
      const { error } = await signup({
        email,
        password,
        profile,
      });

      if (error) {
        console.log(error);
        setError(error.message);
        return;
      }
      redirect(`/verify-email?email=${email}`);
    });
  };

  const handleSignupWithGoogle = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: getRedirectUrl(),
      },
    });

    if (error) {
      setError(error.message);
      return;
    }
  };

  return (
    <form
      action={handleSignupWithEmail}
      className="w-full max-w-xs space-y-5 bg-white rounded-lg min-h-96 md:-ml-20 p-5"
    >
      <h1 className="text-accent text-xl font-bold">
        Welcome, create an account.
      </h1>
      <p className="text-sm -mt-5 text-gray-500">
        To never miss on a deal near you.
      </p>
      {error && <p className="text-error w-full text-center">{error}</p>}
      <Button
        type="button"
        onClick={handleSignupWithGoogle}
        className="p-0 gap-2 px-5 py-2 text-primary font-bold w-full hover:bg-secondary shadow"
      >
        <GrGoogle size={20} />
        Signup with Google
      </Button>
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
        type="email"
        icon={
          <span className="px-2">
            <Mail size={15} />
          </span>
        }
        required
      />

      <FormInput
        placeholder="name"
        value={profile?.name ?? ""}
        onChange={(e) =>
          setProfile({
            ...(profile ?? ({} as Profile)),
            name: e.target.value,
          })
        }
        className="px-0 pr-3 text-accent py-2"
        type="text"
        icon={
          <span className="px-2">
            <User size={15} />
          </span>
        }
      />

      <FormInput
        placeholder="Full names"
        value={profile?.full_name ?? ""}
        onChange={(e) =>
          setProfile({
            ...(profile ?? ({} as Profile)),
            full_name: e.target.value,
          })
        }
        className="px-0 pr-3 text-accent capitalize py-2"
        type="text"
        icon={
          <span className="px-2">
            <UserSearch size={15} />
          </span>
        }
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
      <FormInput
        placeholder="Confirm password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="px-0 pr-3 text-accent py-2"
        type={showConfirmPassword ? "text" : "password"}
        required
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
        disabled={!email || !(password && password === confirmPassword)}
        className="bg-primary hover:bg-primary/95 text-background w-full py-2 disabled:cursor-not-allowed"
      >
        {submiting ? <LoaderCircle className="animate-spin" /> : <>Signup</>}
      </Button>
      <p className="text-center text-xs text-gray-500">
        Already a member?{" "}
        <Link href="/signin">
          <span className="text-blue-500 hover:underline">Signin</span>
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
