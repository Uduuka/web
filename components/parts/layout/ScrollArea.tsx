"use client";

import { ComponentProps, ReactNode, useRef } from "react";

interface ScrollAreaProps extends ComponentProps<"div"> {
  children: ReactNode;
  className?: string;
  maxHeight?: string;
  maxWidth?: string;
  ariaLabel?: string;
}

export default function ScrollArea({
  children,
  className = "",
  maxHeight = "400px",
  maxWidth = "100%",
  ariaLabel = "Scrollable content",
  ...props
}: ScrollAreaProps) {
  return (
    <div
      className={`relative z-0 pb-5 overflow-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-accent scrollbar-thumb ${className}`}
      style={{ maxHeight, maxWidth, scrollBehavior: "smooth" }}
      role="region"
      aria-label={ariaLabel}
      tabIndex={0}
      {...props}
    >
      {children}
    </div>
  );
}
