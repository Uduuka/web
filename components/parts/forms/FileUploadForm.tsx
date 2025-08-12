import { useSupabaseUpload } from "@/lib/hooks/use_supabase_upload";
import React from "react";
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "./dropzone";

export default function FileUploadForm({
  onFilesChange,
  options,
}: {
  onFilesChange: (files: File[]) => void;
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
    <div className="w-full mx-auto flex-1 p-5 flex-col">
      <Dropzone {...props}>
        <DropzoneEmptyState />
        <DropzoneContent onFilesChange={onFilesChange} />
      </Dropzone>
    </div>
  );
}
