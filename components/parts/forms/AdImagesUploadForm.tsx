import Button from "@/components/ui/Button";
import Image from "next/image";
import React from "react";
import ScrollArea from "../layout/ScrollArea";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { AdImage } from "@/lib/types";
import FileUploadForm from "./FileUploadForm";
import { deleteImages } from "@/lib/actions";

export default function AdImagesUploadForm({
  adImages,
  handleUpload,
  handleBack,
  handleNext,
}: {
  adImages?: AdImage[];
  handleUpload: (files: File[]) => void;
  handleBack?: () => void;
  handleNext?: () => void;
}) {
  const handleDeleteImage = async (url: string) => {
    const index = url.indexOf("/ads");
    if (index !== -1) {
      const path = url.slice(index);
      const { error, data } = await deleteImages([path]);

      console.log({ error, data });
    }
  };
  return (
    <div className="w-full text-center h-full flex flex-col">
      <p className="text-xs font-thin text-accent pt-2">
        Upload clean and clear images of what your selling.
      </p>
      {adImages && (
        <div className="flex flex-wrap gap-2 pt-2 px-5">
          {adImages.map((image, index) => (
            <div
              key={index}
              className="w-20 h-20 rounded-lg group overflow-hidden relative"
            >
              <Button
                onDoubleClick={() => handleDeleteImage(image.url)}
                className="absolute top-1 right-1 p-1 rounded-full text-error bg-secondary hidden group-hover:flex"
              >
                <X size={12} />
              </Button>
              <Image
                src={image.url}
                height={100}
                width={100}
                alt="Image"
                className="object-cover h-full w-full"
              />
            </div>
          ))}
        </div>
      )}
      <ScrollArea maxHeight="100%" className="flex-1">
        <FileUploadForm
          onFilesChange={handleUpload}
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
