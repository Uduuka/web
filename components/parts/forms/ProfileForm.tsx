"use client";

import { Profile } from "@/lib/types";
import React, { ComponentProps, useState, useTransition } from "react";
import ErrorCard from "../cards/ErrorCard";
import FormGroup from "@/components/ui/FormGroup";
import FormInput from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { createOrUpdateProfile } from "@/lib/actions";
import { redirect } from "next/navigation";

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

  const handleSubmit = () => {
    startSubmiting(async () => {
      if (!profile) {
        setError("The profile data is missing required fields.");

        return;
      }

      const { user_id, full_names, about, username, default_address } = profile;
      const profilData = {
        full_names,
        about,
        username,
        default_address,
      } as Profile;

      if (user_id) {
        profilData.user_id = user_id;
      }
      const { error, data } = await createOrUpdateProfile(profilData);

      if (error) {
        setError(error.message);
        return;
      }

      redirect("/dashboard");
    });
  };
  return (
    <form
      {...props}
      action={handleSubmit}
      className={cn("w-full max-w-sm mx-auto space-y-5", className)}
    >
      {error && <ErrorCard error={error} />}
      <FormGroup label="Username" required>
        <FormInput
          id="username"
          name="username"
          value={profile?.username ?? ""}
          onChange={(e) => {
            setProfile({
              ...(profile ?? ({} as Profile)),
              username: e.target.value,
            });
          }}
          className=" text-sm py-2 px-5 "
          autoComplete="false"
          placeholder="Your username"
        />
      </FormGroup>
      <FormGroup label="Full names" required>
        <FormInput
          id="full_names"
          className="capitalize text-sm py-2 px-5 "
          name="full_names"
          value={profile?.full_names ?? ""}
          onChange={(e) => {
            setProfile({
              ...(profile ?? ({} as Profile)),
              full_names: e.target.value,
            });
          }}
          autoComplete="false"
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
          className="resize-none outline-0 focus:outline-0 border hover:border-primary rounded-lg px-5 py-2 border-secondary"
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
          className="resize-none outline-0 focus:outline-0 border hover:border-primary rounded-lg px-5 py-2 border-secondary"
          placeholder="Your shipping address"
        />
      </FormGroup>

      <Button type="submit" className="w-full bg-primary text-background">
        Save changes
      </Button>
    </form>
  );
}
