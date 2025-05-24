"use client";

import Button from "@/components/ui/Button";
import { Plus, X } from "lucide-react";
import React, { useState } from "react";
import CreateAdForm from "../forms/CreateAdForm";

export default function CreateAd() {
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
        <Plus size={15} /> Post new ad
      </Button>
      {open && (
        <div className="w-screen fixed flex justify-end cursor-not-allowed top-0 right-0 h-screen transition transform z-50">
          <div
            className={`transition-all duration-500 h-screen flex flex-col cursor-auto bg-black/90 text-white ${
              open ? "w-full max-w-lg" : "w-0"
            }`}
          >
            <div className="px-5 py-3 h-fit flex justify-between items-center border-b ">
              <h1 className="font-light">Create new advert</h1>
              <Button
                onClick={closePanel}
                className="bg-transparent text-white p-1 hover:bg-white hover:text-accent"
              >
                <X size={20} />
              </Button>
            </div>
            <CreateAdForm />
          </div>
        </div>
      )}
    </>
  );
}
