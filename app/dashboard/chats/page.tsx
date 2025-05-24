import ScrollArea from "@/components/parts/layout/ScrollArea";
import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/Input";
import React from "react";

export default function page() {
  return (
    <div className="p-5 space-y-5">
      <div className="p-5 bg-white rounded-lg ">
        <h1 className="text-accent">My chats</h1>
      </div>
      <div className="flex gap-5">
        <ScrollArea
          maxHeight="30rem"
          className="w-80 h-[40rem] bg-white rounded-lg"
        >
          <div className="h-screen w-full space-y-2">
            <div className="flex w-full h-8 border-b border-accent/30">
              <Button className="w-full bg-white hover:border-accent border-transparent border-b-2 rounded-none h-full text-xs text-accent">
                All
              </Button>
              <Button className="w-full bg-white hover:border-accent border-transparent border-b-2 rounded-none h-full text-xs text-accent">
                Active
              </Button>
              <Button className="w-full bg-white hover:border-accent border-transparent border-b-2 rounded-none h-full text-xs text-accent">
                Search
              </Button>
            </div>
            <div className="px-2 hidden">
              <FormInput
                className="w-full px-3 text-xs py-2 text-accent"
                wrapperStyle="border-accent"
                placeholder="Search the contacts"
              />
            </div>

            <div className="py-2"></div>
          </div>
        </ScrollArea>
        <ScrollArea maxHeight="30rem" className="bg-white w-full rounded-lg">
          <div className="h-screen"></div>
        </ScrollArea>
      </div>
    </div>
  );
}
