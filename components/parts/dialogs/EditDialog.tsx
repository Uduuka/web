import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import { Pencil } from "lucide-react";
import React from "react";
import CreateAdForm from "../forms/CreateAdForm";

export default function EditDialog() {
  return (
    <Dialog
      trigger={
        <Button className="gap-2 text-xs w-full bg-transparent text-accent font-thin hover:bg-accent/20 justify-start">
          <Pencil size={15} /> Edit ad
        </Button>
      }
      className=""
      contentStyle=""
    >
      <CreateAdForm  />
    </Dialog>
  );
}
