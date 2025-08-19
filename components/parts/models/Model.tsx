"use client";

import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import React, {
  ComponentProps,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

interface ModelProps extends ComponentProps<"div"> {
  trigger?: ReactNode;
  triggerStyle?: string;
  header?: string | ReactNode;
  close?: boolean;
}

export default function Model({
  trigger,
  className,
  children,
  triggerStyle,
  header,
  close,
}: ModelProps) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (close === undefined) {
      return;
    }
    setOpen(!close);
  }, [close]);

  useEffect(() => {
    window.addEventListener("click", (e) => {
      if (e.target === containerRef.current) {
        handleClose();
      }
    });

    return () => {
      window.removeEventListener("click", () => {});
    };
  }, []);

  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <>
      <Button onClick={handleOpen} className={cn("w-full gap-1", triggerStyle)}>
        {trigger ?? "Open model"}
      </Button>
      {open && (
        <div
          className={cn(
            "w-screen fixed flex justify-center items-center top-0 bg-black/65 right-0 h-screen transition transform z-50"
          )}
          ref={containerRef}
        >
          <div
            ref={contentRef}
            className={cn("bg-background rounded-lg flex flex-col", className)}
          >
            <div className="flex justify-between items-center border-b border-secondary">
              <h1 className="p-2 text-left px-5 line-clamp-1 text-sm font-semibold w-full">
                {header}
              </h1>
              <Button
                onClick={handleClose}
                className="bg-transparent hover:bg-secondary/50 p-1"
              >
                <X size={20} />
              </Button>
            </div>
            <div className="flex-1 rounded-b-lg flex flex-col overflow-hidden">
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
