import React, { useState, useTransition } from "react";
import Model from "../models/Model";
import { Trash } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { Listing } from "@/lib/types";
import { updateAd } from "@/lib/actions";

interface Props {
  ad: Listing;
}

export default function DeleteDialog({ ad }: Props) {
  const [closeModel, setCloseModel] = useState<boolean>();
  const [updating, startUpdating] = useTransition();
  const [error, setError] = useState("");

  const handleDelete = () => {
    startUpdating(async () => {
      const { error, data } = await updateAd(ad.id, { deleted_at: new Date() });
      console.log({ error, data, id: ad.id });
      if (error) {
        setError(error.message);
        return;
      }

      setCloseModel(true);
    });
  };
  return (
    <Model
      triggerStyle="gap-2 text-xs w-30 bg-transparent text-error font-thin justify-start hover:bg-error-background"
      trigger={
        <>
          <Trash size={15} /> Delete ad
        </>
      }
      header={<span className="text-error">Delete ad</span>}
      className="w-full max-w-sm h-fit"
      close={closeModel}
    >
      <div className="w-full p-5">
        {error && <p className="text-error py-5 text-center">{error}</p>}
        <p className="text-accent text-center">
          You are about to delete your ad ({ad.title}), if you are not sure
          about this close the dialog or click delete to continue.
        </p>

        <Button
          onClick={handleDelete}
          className="bg-red-100 mt-5 hover:bg-red-200 w-full max-w-40 mx-auto text-red-500 rounded-sm px-5"
        >
          Delete
        </Button>
      </div>
    </Model>
  );
}
