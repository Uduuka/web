"use client";

import ScrollArea from "@/components/parts/layout/ScrollArea";
import { ChatThread, Message, Profile } from "@/lib/types";
import { Info } from "lucide-react";
import React, { use, useEffect, useState } from "react";
import ThreadButton from "./ThreadButton";
import FormInput from "@/components/ui/Input";

export default function ThreadsList({
  threadsPromise,
  myPromise
}: {
  threadsPromise: Promise<{
    data: {me: string, you: string, messages: Message[]}[] | null;
    error: { message: string } | null;
  }>;
  myPromise: Promise<{
    data: Profile | null;
    error: { message: string } | null;
  }>;
}) {
  const { data: threads, error } = use(threadsPromise);
  const {data: me, error: myError} = use(myPromise)

  if (error || !me) {
    return (
      <p className="text-error flex items-start gap-1 p-5 bg-red-50 rounded-lg">
        <Info width={100} />
        <span>Error: Failed to fetch your chat threads.</span>
      </p>
    );
  }
  return (
    <>
      <FormInput
        className="w-full px-3 text-xs py-2 text-accent"
        wrapperStyle="border-accent"
        placeholder="Search for chat threads"
      />

      <ScrollArea maxHeight="100%" maxWidth="100%" className="flex-1 pb-0">
        <div className="w-fit sm:w-full h-fit flex sm:flex-col gap-2">
          {(threads?.length ?? 0) > 0 ? (
            threads?.map((t, i) => {
              return <ThreadButton thread={{you: t.you, messages: t.messages, me }} key={i} />;
            })
          ) : (
            <p className="text-gray-400 flex items-start gap-1 p-5">
              <Info width={100} />
              <span>
                You {"don't"} have any chat threads and you {"aren't"} connected
                to any sellers or buyers. Past chat or connections will appear
                here
              </span>
            </p>
          )}
        </div>
      </ScrollArea>
    </>
  );
}
