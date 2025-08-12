"use client";

import { cn } from "@/lib/utils";
import React, {
  ComponentProps,
  KeyboardEvent,
  ReactNode,
  useRef,
  useState,
} from "react";
import ScrollArea from "../parts/layout/ScrollArea";

interface DialogProps extends ComponentProps<"div"> {
  trigger?: ReactNode;
  triggerStyle?: string;
  contentStyle?: string;
}

export default function Dialog({
  className,
  trigger,
  triggerStyle,
  children,
  contentStyle,
}: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);

  const handleEsc = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className={cn("", className)} ref={dialogRef} onKeyDown={handleEsc}>
      <div
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className={cn("cursor-pointer", triggerStyle)}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-controls="dialog-content"
      >
        {trigger}
      </div>
      {isOpen && (
        <div
          id="dialog-content"
          ref={contentRef}
          className={cn(
            "fixed top-0 right-0 z-50 w-full max-w-md h-screen p-2 pt-20 text-white bg-black/90 ",
            contentStyle
          )}
          role="main"
          aria-labelledby="dialog-trigger"
        >
          {children}
        </div>
      )}
    </div>
  );
}
