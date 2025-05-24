import { cn } from "@/lib/utils";
import React, { ComponentProps } from "react";

type GroupProps = ComponentProps<"div"> & {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  labelStyle?: string;
};
export default function FormGroup({
  children,
  label,
  className,
  labelStyle,
  required,
  htmlFor,
  ...props
}: GroupProps) {
  return (
    <div {...props} className={cn("flex flex-col gap-1", className)}>
      <label className={cn("text-sm", labelStyle)} htmlFor={htmlFor}>
        {label}
        {required && <span className="text-primary ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}
