import { cn } from "@/lib/utils";
import React, { ComponentProps } from "react";
type ButtonProps = ComponentProps<"button"> & {};
export default function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "bg-secondary/50 cursor-pointer flex justify-center items-center px-3 py-1 rounded-md transition-colors",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
