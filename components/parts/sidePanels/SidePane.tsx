"use client";

import Button from "@/components/ui/Button";
import { X } from "lucide-react";
import React, { ComponentProps, ReactNode, useState } from "react";
import ScrollArea from "../layout/ScrollArea";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface PaneProps extends ComponentProps<"div"> {
  header?: ReactNode;
  trigger?: ReactNode;
  triggerText?: string;
  triggerStyle?: string;
  open?: boolean;
  onMinimise?: () => void;
  handleClose?: () => void;
  onMaximise?: () => void;
}

export default function SidePane({
  className,
  header,
  children,
  trigger,
  triggerText,
  triggerStyle,
  open,
  onMinimise,
  handleClose,
  onMaximise,
}: PaneProps) {
  const [isOpen, setIsOpen] = useState(open);

  const openPanel = () => {
    setIsOpen(true);
  };

  const closePanel = () => {
    handleClose && handleClose();
    setIsOpen(false);
  };
  return (
    <>
      {isOpen ? (
        <div className="w-screen fixed flex justify-end cursor-not-allowed top-16 right-0 h-[90vh] transition transform z-50">
          <div
            className={cn(
              `transition-all duration-500 h-screen flex flex-col cursor-auto bg-black/90 text-white ${
                isOpen ? "w-full max-w-sm" : "w-0"
              }`,
              className
            )}
          >
            <div className="px-5 py-3 flex justify-between items-center border-b ">
              {header}
              <div className="w-fit flex items-center">
                {onMinimise && (
                  <Button
                    onClick={onMinimise}
                    className="bg-transparent text-white group h-6 w-6 p-1 hover:bg-white hover:text-accent items-center justify-center"
                  >
                    <span className="w-5 h-1 bg-background group-hover:bg-accent transition-colors rounded"></span>
                  </Button>
                )}
                {onMaximise && (
                  <Button
                    onClick={onMaximise}
                    className="bg-transparent h-6 w-6 text-white group p-1 hover:bg-white hover:text-accent items-center justify-center"
                  >
                    <span className="h-4 rounded border-2 w-4 group-hover:border-accent transition-colors border-background"></span>
                  </Button>
                )}
                <Button
                  onClick={closePanel}
                  className="bg-transparent text-white h-6 w-6 p-1 hover:bg-white hover:text-accent"
                >
                  <X size={22} />
                </Button>
              </div>
            </div>
            <div className="h-full pb-10">{children}</div>
          </div>
        </div>
      ) : (
        <Button
          onClick={openPanel}
          className={cn(
            "bg-primary hover:bg-primary/90 text-white text-xs gap-2",
            triggerStyle
          )}
        >
          {trigger ?? triggerText}
        </Button>
      )}
    </>
  );
}
