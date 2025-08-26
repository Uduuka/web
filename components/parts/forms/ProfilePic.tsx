"use client";

import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Camera, User } from "lucide-react";
import Image from "next/image";
import React, { ComponentProps, useState } from "react";

export default function ProfilePic({
  picUrl,
  className,
  editable,
  ...props
}: { picUrl?: string; editable?: boolean } & ComponentProps<"div">) {
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState(picUrl);
  return (
    <div
      className={cn(
        "h-40 w-40 rounded-lg overflow-hidden mx-auto relative bg-white border-primary border flex justify-center items-center",
        className
      )}
      {...props}
    >
      <input
        type="file"
        accept="image/*"
        name="store-logo"
        className="hidden"
        onChange={(e) => {
          setProfilePicFile(e.target.files && e.target.files[0]);
        }}
        id="logo-change"
      />
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt="user"
          height={100}
          width={100}
          className="bg-cover w-full h-full"
        />
      ) : (
        <User className="h-full w-full" color="#f97316" />
      )}

      {editable && (
        <Button
          type="button"
          className="absolute bg-white bottom-1 right-1 text-primary border  rounded-full p-1"
        >
          <Camera
            fill="white"
            size={15}
            onClick={() => {
              document.getElementById("logo-change")?.click();
            }}
          />
        </Button>
      )}
    </div>
  );
}
