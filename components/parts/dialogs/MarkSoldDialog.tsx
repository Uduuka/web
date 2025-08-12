import React, { useEffect, useState, useTransition } from "react";
import Model from "../models/Model";
import { Check, Trash } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { Listing } from "@/lib/types";
import { updateAd } from "@/lib/actions";

interface Props {
  ad: Listing;
}

export default function MarkSoldDialog({ ad }: Props) {
  const [closeModel, setCloseModel] = useState<boolean>();
  const [updating, startUpdating] = useTransition();
  const [error, setError] = useState("");

  const handleMarkSold = () => {
    startUpdating(async () => {
      const { error } = await updateAd(ad.id, { status: "sold", quantity: 0 });
      if (error) {
        setError(error.message);
        return;
      }

      setError("");
      setCloseModel(true);
    });
  };

  return (
    <Model
      triggerStyle="gap-2 text-xs w-30 bg-transparent text-success font-thin justify-start hover:bg-green-100"
      trigger={
        <>
          <Check size={15} /> Mark sold
        </>
      }
      header={<span className="text-success">Mark sold</span>}
      className="w-full max-w-sm h-fit"
      close={closeModel}
    >
      <div className="w-full p-5">
        {error && <p className="text-error pb-5 text-center">{error}</p>}
        <p className="text-accent text-center">
          You are about to mark your ad ({ad.title}) as sold, if you are not
          sure about this close the dialog or click mark sold to continue.
        </p>

        <Button
          onClick={handleMarkSold}
          className="gap-2 text-xs w-30 mx-auto mt-5 bg-transparent border border-green-400 font-thin text-green-500 hover:bg-green-200"
        >
          <Check size={15} /> Mark sold
        </Button>
      </div>
    </Model>
  );
}
