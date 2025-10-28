import ProfileForm from "@/components/parts/forms/ProfileForm";
import ProfilePic from "@/components/parts/forms/ProfilePic";
import { getProfile, getUser } from "@/lib/actions";
import { Profile } from "@/lib/types";
import React from "react";

export default async function ProfilePage() {
  const { data: profile } = await getProfile();
  const {
    data: { user },
  } = await getUser();
  const data = (profile ?? user?.user_metadata) as Profile;
  return (
    <div className="rounded-lg p-5 space-y-5 bg-white w-full max-w-sm mx-auto ">
      <h1 className="text-center text-lg text-gray-500 font-bold">
        Your profile
      </h1>
      <ProfilePic
        editable
        picUrl={data.avatar_url ?? "/placeholder.svg"}
        className="bg-transparent"
      />
      <ProfileForm currentProfile={data} />
    </div>
  );
}
