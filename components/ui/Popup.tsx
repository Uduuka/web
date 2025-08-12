import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import React, {
  ComponentProps,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

type PopupProps = ComponentProps<"div"> & {
  trigger: ReactNode;
  children: ReactNode;
  align?: "vertical" | "horizontal" | "diagonal-left" | "diagonal-right";
  contentStyle?: string;
  triggerStyle?: string;
};

export default function Popup({
  align,
  className,
  contentStyle,
  children,
  trigger,
  triggerStyle,
}: PopupProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const updateSpacing = () => {
      if (!triggerRef.current || !contentRef.current || !isOpen) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      const vDrop = () => {
        //Horizontally center the content
        contentRef.current?.classList.add("left-[50%]", "translate-x-[-50%]");
        // Prefer down, check if enough space below
        const spaceBelow = viewportHeight - triggerRect.bottom;
        const spaceAbove = triggerRect.top;
        if (
          spaceBelow < contentRect.height &&
          spaceAbove >= contentRect.height
        ) {
          // Drop up
          contentRef.current?.classList.add("bottom-full");
        } else {
          // Drop down
          contentRef.current?.classList.add("top-full");
        }
      };

      if (align === "vertical") {
        vDrop();
      } else if (align === "horizontal") {
        //Vertically center the content
        contentRef.current?.classList.add("top-[50%]", "translate-y-[-50%]");
        // Horizontal: prefer right
        const spaceRight = viewportWidth - triggerRect.right;
        const spaceLeft = triggerRect.left;
        if (spaceRight >= contentRect.height) {
          // Drop right
          contentRef.current?.classList.add("left-full");
        } else if (spaceLeft >= contentRect.height) {
          // Drop left
          contentRef.current?.classList.add("right-full");
        } else {
          //Remove vertical center alignment
          contentRef.current?.classList.remove(
            "top-[50%]",
            "translate-y-[-50%]"
          );

          //Horizontally center the content
          contentRef.current?.classList.add("left-[50%]", "translate-x-[-50%]");
          // Fallback: down with max height
          vDrop();
        }
      } else if (align === "diagonal-left") {
        const spaceBelow = viewportHeight - triggerRect.bottom;

        if (spaceBelow < contentRect.height) {
          contentRef.current?.classList.add("bottom-full", "right-0");
        } else {
          contentRef.current?.classList.add("top-full", "right-0");
        }
      } else if (align === "diagonal-right") {
        const spaceBelow = viewportHeight - triggerRect.bottom;

        if (spaceBelow < contentRect.height) {
          contentRef.current?.classList.add("bottom-full", "left-0");
        } else {
          contentRef.current?.classList.add("top-full", "left-0");
        }
      } else {
      }
    };

    updateSpacing();
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle keyboard events
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsOpen(false);
      triggerRef.current?.focus();
    }
  };

  return (
    <div
      className={cn("relative transition-all py-1", className)}
      ref={dropdownRef}
      onKeyDown={handleKeyDown}
    >
      <div
        ref={triggerRef}
        onClick={() => setIsOpen(true)}
        className={cn("cursor-pointer", triggerStyle)}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-controls="dropdown-content"
      >
        {trigger}
      </div>
      {isOpen && (
        <div
          id="dropdown-content"
          ref={contentRef}
          className={cn(
            "absolute z-50 w-fit bg-white shadow-md rounded-lg p-2 transition transform",
            contentStyle
          )}
          role="menu"
          aria-labelledby="dropdown-trigger"
        >
          {children}
        </div>
      )}
    </div>
  );
}
