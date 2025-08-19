import ProfileForm from "@/components/parts/forms/ProfileForm";
import ProfilePic from "@/components/parts/forms/ProfilePic";
import { getProfile } from "@/lib/actions";
import { Profile } from "@/lib/types";
import React from "react";

export default async function ProfilePage() {
  const { data: profile } = await getProfile();
  return (
    <div className="rounded-lg p-5 space-y-5 bg-white w-full max-w-sm mx-auto ">
      <ProfilePic
        editable
        picUrl="/placeholder.svg"
        className="bg-transparent"
      />
      <ProfileForm currentProfile={profile as Profile | undefined} />
    </div>
  );
}
