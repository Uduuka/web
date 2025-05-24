"use client";

import { ReactNode, useRef } from "react";

interface ScrollAreaProps {
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
}: ScrollAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scrollRef}
      className={`relative z-0 pb-5 overflow-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-accent scrollbar-thumb ${className}`}
      style={{ maxHeight, maxWidth, scrollBehavior: "smooth" }}
      role="region"
      aria-label={ariaLabel}
      tabIndex={0}
    >
      {children}
    </div>
  );
}
