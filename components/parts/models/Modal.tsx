"use client";

import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { ComponentProps, ReactNode, useEffect, useRef } from "react";

interface ModalProps extends ComponentProps<"dialog"> {
  header?: ReactNode;
  trigger?: ReactNode;
  children?: ReactNode;
  triggerStyle?: string;
  className?: string;
}

export default function Modal({
  trigger,
  className,
  children,
  triggerStyle,
  header,
  ...props
}: ModalProps) {
  const modalRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    formRef.current?.submit();
  }, [pathname]);

  return (
    <>
      <Button
        onClick={() => {
          modalRef.current?.showModal();
        }}
        className={cn("w-fit", triggerStyle)}
      >
        {trigger ?? "Open modal"}
      </Button>
      <dialog
        ref={modalRef}
        className="backdrop:bg-black/30 box-border w-full p-5 bg-transparent mx-auto my-20"
        {...props}
      >
        <div
          className={cn(
            "w-full max-w-sm mx-auto box-border bg-white shadow rounded-lg space-y-2 h-fit min-h-40",
            className
          )}
        >
          <div className="flex justify-between items-center px-5 py-2 border-b border-secondary">
            <h1 className="w-full text-gray-500">{header ?? "Dailog"}</h1>
            <form method="dialog" ref={formRef}>
              <Button type="submit" className="bg-transparent text-error p-0">
                <X />
              </Button>
            </form>
          </div>
          {/* <ScrollArea maxHeight="80vh" maxWidth="100%" className=""> */}
          {children}
          {/* </ScrollArea> */}
        </div>
      </dialog>
    </>
  );
}
