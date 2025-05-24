import { cn } from "@/lib/utils";
import React, { ComponentProps, ReactNode } from "react";
import { AiOutlineExclamationCircle } from "react-icons/ai";

type ErrorProps = ComponentProps<"div"> & {
  title?: string | ReactNode;
  error?: string | ReactNode;
};

export default function ErrorCard({
  title,
  className,
  children,
  error,
  ...props
}: ErrorProps) {
  return (
    <div
      className={cn(
        "rounded-lg overflow-hidden bg-error-background text-error w-full",
        className
      )}
      {...props}
    >
      {typeof title === "string" ? (
        <h1 className="px-5 shadow-xs py-2 flex items-center gap-1">
          <AiOutlineExclamationCircle size={20} />
          {title}
        </h1>
      ) : (
        <>{title}</>
      )}
      <div className="px-5 py-2">
        {error && <p className="text-xs text-center font-light">{error}</p>}
        {children}
      </div>
    </div>
  );
}
