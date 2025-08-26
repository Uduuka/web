"use client";

import { Profile } from "@/lib/types";
import React, { ComponentProps, useState, useTransition } from "react";
import ErrorCard from "../cards/ErrorCard";
import FormGroup from "@/components/ui/FormGroup";
import FormInput from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { createOrUpdateProfile } from "@/lib/actions";
import { redirect, useSearchParams } from "next/navigation";
import { Info, LoaderCircle } from "lucide-react";
import env from "@/lib/env";

export default function ProfileForm({
  currentProfile,
  className,
  ...props
}: {
  currentProfile?: Profile;
} & ComponentProps<"form">) {
  const [profile, setProfile] = useState(currentProfile);
  const [error, setError] = useState<string>();
  const [submiting, startSubmiting] = useTransition();

  const next = useSearchParams().get("next");
  const nextSearchQuery = useSearchParams().get("sq");

  const nextUrl = next
    ? `${env.nextUrls[next]}${nextSearchQuery ? `?${nextSearchQuery}` : ""}`
    : "/dashboard";

  const handleSubmit = () => {
    startSubmiting(async () => {
      if (!profile) {
        setError("The profile data is missing required fields.");

        return;
      }

      const { user_id, full_name, about, name, default_address } = profile;
      const profilData = {
        full_name,
        about,
        name,
        default_address,
      } as Profile;

      if (user_id) {
        profilData.user_id = user_id;
      }
      const { error } = await createOrUpdateProfile(profilData);

      if (error) {
        setError(error.message);
        return;
      }

      redirect(nextUrl);
    });
  };
  return (
    <form
      {...props}
      action={handleSubmit}
      className={cn(
        "w-full max-w-sm mx-auto space-y-5 text-gray-500",
        className
      )}
    >
      {next && (
        <div className="bg-yellow-50 text-yellow-500 p-5 rounded-lg text-xs">
          <p className="flex gap-1 items-start">
            <Info size={15} />{" "}
            <span>You need to create or save your profile to continue</span>
          </p>
        </div>
      )}
      {error && <ErrorCard error={error} />}
      <FormGroup label="name" required>
        <FormInput
          id="name"
          name="name"
          value={profile?.name ?? ""}
          onChange={(e) => {
            setProfile({
              ...(profile ?? ({} as Profile)),
              name: e.target.value,
            });
          }}
          className=" text-sm py-1 px-5 "
          required
          placeholder="Your name"
        />
      </FormGroup>
      <FormGroup label="Full names" required>
        <FormInput
          id="full_name"
          className="capitalize text-sm py-1 px-5 "
          name="full_name"
          value={profile?.full_name ?? ""}
          onChange={(e) => {
            setProfile({
              ...(profile ?? ({} as Profile)),
              full_name: e.target.value,
            });
          }}
          required
          placeholder="Your full names"
        />
      </FormGroup>
      <FormGroup label="About" required>
        <textarea
          id="about"
          name="about"
          value={profile?.about ?? ""}
          onChange={(e) => {
            setProfile({
              ...(profile ?? ({} as Profile)),
              about: e.target.value,
            });
          }}
          autoComplete="false"
          className="resize-none outline-0 focus:outline-0 border hover:border-primary rounded-lg px-5 py-1 border-secondary"
          placeholder="About you"
        />
      </FormGroup>
      <FormGroup label="Address line one" required>
        <textarea
          id="address"
          name="address"
          value={profile?.default_address ?? ""}
          onChange={(e) => {
            setProfile({
              ...(profile ?? ({} as Profile)),
              default_address: e.target.value,
            });
          }}
          autoComplete="false"
          className="resize-none outline-0 focus:outline-0 border hover:border-primary rounded-lg px-5 py-1 border-secondary"
          placeholder="Your shipping address"
        />
      </FormGroup>

      <Button type="submit" className="w-full bg-primary text-background">
        {submiting ? (
          <LoaderCircle className="animate-spin" />
        ) : (
          <>Save changes</>
        )}
      </Button>
    </form>
  );
}
