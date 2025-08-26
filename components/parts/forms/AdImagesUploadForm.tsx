import Button from "@/components/ui/Button";
import React from "react";
import ScrollArea from "../layout/ScrollArea";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FileUploadForm from "./FileUploadForm";

export default function AdImagesUploadForm({
  adImages,
  handleUpload,
  handleBack,
  handleNext,
}: {
  adImages?: string[];
  handleUpload: (files: File[]) => void;
  handleBack?: () => void;
  handleNext?: () => void;
}) {
  return (
    <div className="w-full text-center h-full flex flex-col">
      <p className="text-xs font-thin text-accent pt-2">
        Upload clean and clear images of what your selling.
      </p>
      <ScrollArea maxHeight="100%" className="flex-1">
        <FileUploadForm
          onFilesChange={handleUpload}
          oldImages={adImages}
          options={{
            allowedMimeTypes: ["image/*"],
            bucketName: "ads",
            maxFiles: 5,
            maxFileSize: 1000000,
            path: "/",
          }}
        />
      </ScrollArea>
      <div className="flex justify-between px-5">
        {handleBack && (
          <Button
            type="button"
            onClick={handleBack}
            className=" transform bg-primary/80 text-white p-2 px-5 w-40 gap-5 rounded-full hover:bg-primary transition"
            aria-label="Next step"
          >
            <ChevronLeft size={15} />
            Previous
          </Button>
        )}
        {handleNext && (
          <Button
            type="button"
            onClick={handleNext}
            className=" transform bg-primary/80 text-white p-2 px-5 w-40 gap-5 rounded-full hover:bg-primary transition"
            aria-label="Next step"
          >
            Next
            <ChevronRight size={15} />
          </Button>
        )}
      </div>
    </div>
  );
}
