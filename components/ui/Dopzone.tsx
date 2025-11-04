import { cn } from "@/lib/utils";
import React, { useCallback, useEffect, useState } from "react";
import { DropzoneProps, useDropzone } from "react-dropzone";

interface Props extends DropzoneProps {
  className: string;
  onFilesChange: (files: { file: File; dataURL: string }[]) => void;
}

export default function Dropzone({ className, onFilesChange }: Props) {
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
        <p className="w-full break-words text-wrap whitespace-normal m-0 p-5 text-center text-gray-400">
          Drag and drop files here, or click to select files
        </p>
      )}
    </div>
  );
}
