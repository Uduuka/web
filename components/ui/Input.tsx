"use client";

import { cn } from "@/lib/utils";
import { ComponentProps, forwardRef, ReactNode } from "react";

type InputProps = ComponentProps<"input"> & {
  icon?: ReactNode;
  actionBtn?: ReactNode;
  wrapperStyle?: string;
};

const FormInput = forwardRef<HTMLInputElement, InputProps>(
  ({ icon, actionBtn, className, wrapperStyle, ...props }, ref) => {
    return (
      <div
        className={cn(
          "border text-muted-foreground border-secondary items-center rounded-lg flex focus-within:border-primary hover:border-primary transition-colors overflow-hidden",
          wrapperStyle
        )}
      >
        {icon}
        <input
          className={cn(
            "outline-none w-full px-2 h-fit py-1 active:outline-none rounded-none focus:outline-none text-muted-foreground border-none shadow-none",
            className
          )}
          ref={ref}
          {...props}
        />
        {actionBtn}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";
export default FormInput;
