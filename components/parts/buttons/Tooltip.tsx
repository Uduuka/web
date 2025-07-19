import React, { ComponentProps, ReactNode } from "react";

interface Props extends ComponentProps<"div"> {
  trigger: ReactNode;
}

export default function Tooltip({ trigger, children, className }: Props) {
  return (
    <div className="relative group w-fit cursor-pointer">
      <div className="peer w-fit">{trigger}</div>
      <div className="absolute z-50 top-full w-full min-w-60 right-0 pt-1 hidden peer-hover:flex">
        {children}
      </div>
    </div>
  );
}
