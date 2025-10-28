import React from "react";
import { getProfile } from "@/lib/actions";
import ClientPage from "./ClientPage";

export default async function OrderPage() {
  const profilePromise = getProfile();
  return <ClientPage profilePromise={profilePromise} />;
}
