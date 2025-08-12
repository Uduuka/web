"use client";

import { cn } from "@/lib/utils";
import { type UseSupabaseUploadReturn } from "@/lib/hooks/use_supabase_upload";
import { CheckCircle, File, Loader2, Upload, X } from "lucide-react";
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
} from "react";
import Button from "@/components/ui/Button";
import Image from "next/image";
import ScrollArea from "../layout/ScrollArea";

export const formatBytes = (
  bytes: number,
  decimals = 2,
  size?: "bytes" | "KB" | "MB" | "GB" | "TB" | "PB" | "EB" | "ZB" | "YB"
) => {
  const k = 1000;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  if (bytes === 0 || bytes === undefined)
    return size !== undefined ? `0 ${size}` : "0 bytes";
  const i =
    size !== undefined
      ? sizes.indexOf(size)
      : Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

type DropzoneContextType = Omit<
  UseSupabaseUploadReturn,
  "getRootProps" | "getInputProps"
>;

const DropzoneContext = createContext<DropzoneContextType | undefined>(
  undefined
);

type DropzoneProps = UseSupabaseUploadReturn & {
  className?: string;
};

const Dropzone = ({
  className,
  children,
  getRootProps,
  getInputProps,
  ...restProps
}: PropsWithChildren<DropzoneProps>) => {
  const isSuccess = restProps.isSuccess;
  const isActive = restProps.isDragActive;
  const isInvalid =
    (restProps.isDragActive && restProps.isDragReject) ||
    (restProps.errors.length > 0 && !restProps.isSuccess) ||
    restProps.files.some((file) => file.errors.length !== 0);

  return (
    <DropzoneContext.Provider value={{ ...restProps }}>
      <div
        {...getRootProps({
          className: cn(
            "border-2 border-gray-300 rounded-lg text-center h-full flex flex-col transition-colors duration-300 text-foreground",
            className,
            isSuccess ? "border-solid" : "border-dashed",
            isActive && "border-primary bg-primary/10",
            isInvalid && "border-destructive bg-destructive/10"
          ),
        })}
      >
        <input {...getInputProps()} />
        {children}
      </div>
    </DropzoneContext.Provider>
  );
};
const DropzoneContent = ({
  className,
  onFilesChange,
}: {
  className?: string;
  onFilesChange: (files: File[]) => void;
}) => {
  const {
    files,
    setFiles,
    onUpload,
    loading,
    successes,
    errors,
    maxFileSize,
    maxFiles,
    isSuccess,
  } = useDropzoneContext();

  const exceedMaxFiles = files.length > maxFiles;

  const handleRemoveFile = useCallback(
    (fileName: string) => {
      setFiles(files.filter((file) => file.name !== fileName));
    },
    [files, setFiles]
  );

  useEffect(() => {
    onFilesChange(files);
  }, [files]);

  if (isSuccess) {
    return (
      <div
        className={cn(
          "flex flex-row items-center gap-x-2 justify-center p-4",
          className
        )}
      >
        <CheckCircle size={16} className="text-primary" />
        <p className="text-primary text-sm">
          Successfully uploaded {files.length} file{files.length > 1 ? "s" : ""}
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className={cn("p-2", className)}>
      <div className="h-max">
        {files.map((file, idx) => {
          const fileError = errors.find((e) => e.name === file.name);
          const isSuccessfullyUploaded = !!successes.find(
            (e) => e === file.name
          );

          return (
            <div
              key={`${file.name}-${idx}`}
              className="flex gap-x-2 items-center group first:mt-4 last:mb-4"
            >
              {file.type.startsWith("image/") ? (
                <div className="h-32 w-32 rounded-lg overflow-hidden shrink-0 bg-muted flex items-center justify-center">
                  <Image
                    src={file.preview!}
                    height={100}
                    width={100}
                    alt={file.name}
                    className="object-cover h-full w-full"
                  />
                </div>
              ) : (
                <div className="h-10 w-10 rounded border bg-muted flex items-center justify-center">
                  <File size={18} />
                </div>
              )}

              <div className="shrink grow flex flex-col items-start truncate">
                <p title={file.name} className="text-sm truncate max-w-full">
                  {file.name}
                </p>
                <p
                  title={String(file.size)}
                  className="text-sm truncate max-w-full"
                >
                  {formatBytes(file.size)}
                </p>
                <p title={file.type} className="text-sm truncate max-w-full">
                  {file.type}
                </p>
                {file.errors.length > 0 ? (
                  <p className="text-xs text-destructive">
                    {file.errors
                      .map((e) =>
                        e.message.startsWith("File is larger than")
                          ? `File is larger than ${formatBytes(
                              maxFileSize,
                              2
                            )} (Size: ${formatBytes(file.size, 2)})`
                          : e.message
                      )
                      .join(", ")}
                  </p>
                ) : loading && !isSuccessfullyUploaded ? (
                  <p className="text-xs text-muted-foreground">
                    Uploading file...
                  </p>
                ) : !!fileError ? (
                  <p className="text-xs text-destructive">
                    Failed to upload: {fileError.message}
                  </p>
                ) : isSuccessfullyUploaded ? (
                  <p className="text-xs text-primary">
                    Successfully uploaded file
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    {formatBytes(file.size, 2)}
                  </p>
                )}
              </div>

              {!loading && !isSuccessfullyUploaded && (
                <Button
                  className="shrink-0 text-accent hover:text-background p-0 bg-transparent hover:bg-accent opacity-0 group-hover:opacity-100"
                  onClick={() => handleRemoveFile(file.name)}
                >
                  <X />
                </Button>
              )}
            </div>
          );
        })}
        {exceedMaxFiles && (
          <p className="text-sm text-left mt-2 text-destructive">
            You may upload only up to {maxFiles} files, please remove{" "}
            {files.length - maxFiles} file
            {files.length - maxFiles > 1 ? "s" : ""}.
          </p>
        )}
      </div>
    </ScrollArea>
  );
};

const DropzoneEmptyState = ({ className }: { className?: string }) => {
  const { maxFiles, maxFileSize, inputRef, isSuccess } = useDropzoneContext();

  if (isSuccess) {
    return null;
  }

  return (
    <div className={cn("flex flex-col items-center gap-y-2 p-2", className)}>
      <Upload size={20} className="" />
      <p className="text-sm">
        Upload{!!maxFiles && maxFiles > 1 ? ` ${maxFiles}` : ""} file
        {!maxFiles || maxFiles > 1 ? "s" : ""}
      </p>
      <div className="flex flex-col items-center gap-y-1">
        <p className="text-xs">
          Drag and drop or{" "}
          <a
            onClick={() => inputRef.current?.click()}
            className="underline cursor-pointer transition hover:text-primary"
          >
            select {maxFiles === 1 ? `file` : "files"}
          </a>{" "}
          to upload
        </p>
        {maxFileSize !== Number.POSITIVE_INFINITY && (
          <p className="text-xs">
            Maximum file size: {formatBytes(maxFileSize, 2)}
          </p>
        )}
      </div>
    </div>
  );
};

const useDropzoneContext = () => {
  const context = useContext(DropzoneContext);

  if (!context) {
    throw new Error("useDropzoneContext must be used within a Dropzone");
  }

  return context;
};

export { Dropzone, DropzoneContent, DropzoneEmptyState, useDropzoneContext };
