import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { DropzoneProps, useDropzone } from "react-dropzone";
import { types } from "util";

interface Props extends DropzoneProps {
  className: string;
  text?: string;
  types?: string[];
  maxSize?: number;
  onFilesChange: (files: { file: File; dataURL: string }[]) => void;
}

export default function Dropzone({
  className,
  onFilesChange,
  text,
  types,
  maxSize,
}: Props) {
  const [files, setFiles] = useState<{ file: File; dataURL: string }[]>([]);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log(`${file.name} reading was aborted`);
      reader.onerror = () => console.log(`${file.name} reading has failed`);
      reader.onload = () => {
        // Do whatever you want with the file contents
        const dataURL = reader.result as string;
        setFiles([...files, { file, dataURL }]);
      };
      reader.readAsDataURL(file);
    });
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  useEffect(() => {
    onFilesChange(files);
  }, [files]);
  return (
    <div {...getRootProps()} className={cn(className)}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <div className="text-gray-400 flex justify-center items-center flex-col">
          <Upload className="w-8 h-8 mx-auto" />
          <p className="w-full break-words text-wrap whitespace-normal text-center">
            {text ?? "Drag and drop files here, or click to select files"}
          </p>
          <p>
            {types?.join(", ")}. {maxSize && <>Up to {maxSize}MB</>}
          </p>
        </div>
      )}
    </div>
  );
}
