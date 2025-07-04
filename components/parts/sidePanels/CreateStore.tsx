"use client";

import Button from "@/components/ui/Button";
import { Plus, X } from "lucide-react";
import React, { useState } from "react";
import CreateStoreForm from "../forms/CreateStoreForm";
import ScrollArea from "../layout/ScrollArea";

export default function CreateStore() {
  const [open, setOpen] = useState(false);

  const openPanel = () => {
    setOpen(true);
  };

  const closePanel = () => {
    setOpen(false);
  };
  return (
    <>
      <Button
        onClick={openPanel}
        className="bg-primary hover:bg-primary/90 text-white text-xs gap-2"
      >
        <Plus size={15} /> Create new store
      </Button>
      {open && (
        <div className="w-screen fixed flex justify-end cursor-not-allowed top-0 right-0 h-screen transition transform z-50">
          <div
            className={`transition-all duration-500 h-screen flex flex-col cursor-auto bg-black/90 text-white ${
              open ? "w-full max-w-sm" : "w-0"
            }`}
          >
            <div className="px-5 py-3 flex justify-between items-center border-b ">
              <h1 className="font-light">Create a new store</h1>
              <Button
                onClick={closePanel}
                className="bg-transparent text-white p-1 hover:bg-white hover:text-accent"
              >
                <X size={20} />
              </Button>
            </div>
            <div className="h-full pb-10">
              <ScrollArea maxHeight="100%" className="h-full">
                <CreateStoreForm />
              </ScrollArea>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
