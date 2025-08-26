import { useSupabaseUpload } from "@/lib/hooks/use_supabase_upload";
import React from "react";
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "./dropzone";

export default function FileUploadForm({
  onFilesChange,
  options,
  oldImages
}: {
  onFilesChange: (files: File[]) => void;
  oldImages?: string[];
  options: {
    bucketName: string;
    path: string;
    allowedMimeTypes: string[];
    maxFiles: number;
    maxFileSize: number;
  };
}) {
  const props = useSupabaseUpload(options);
  return (
    <div className="w-full h-full flex mx-auto flex-1 p-5 flex-col">
      <Dropzone {...props}>
        <DropzoneEmptyState />
        <DropzoneContent oldImages={oldImages} onFilesChange={onFilesChange} />
      </Dropzone>
    </div>
  );
}
