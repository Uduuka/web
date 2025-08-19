"use client";

import { useState, useRef, useEffect } from "react";

interface PriceRangeSliderProps {
  minPrice?: number;
  maxPrice?: number;
  onChange: (range: { min: number; max: number }) => void;
}

export function PriceRangeSlider({
  minPrice = 0,
  maxPrice = 100,
  onChange,
}: PriceRangeSliderProps) {
  const [min, setMin] = useState(minPrice);
  const [max, setMax] = useState(10);
  const [dynamicMax, setDynamicMax] = useState(maxPrice);
  const [dragging, setDragging] = useState<"min" | "max" | null>(null);
  const [isMaxHeld, setIsMaxHeld] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // Handle dynamic max price increase
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isMaxHeld && dragging === "max") {
      interval = setInterval(() => {
        setDynamicMax((prev) => {
          const newMax = prev + 10;
          setMax(newMax);
          onChange({ min, max: newMax });
          return newMax;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isMaxHeld, dragging, min, onChange]);

  // Handle drag events
  const handleDrag = (e: MouseEvent | TouchEvent, thumb: "min" | "max") => {
    if (!trackRef.current) return;

    const rect = trackRef.current.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const position = Math.max(
      0,
      Math.min(1, (clientX - rect.left) / rect.width)
    );
    const range = dynamicMax - minPrice;

    if (thumb === "min") {
      const newMin = Math.round(minPrice + position * range);
      const clampedMin = Math.min(newMin, max);
      setMin(clampedMin);
      onChange({ min: clampedMin, max });
    } else {
      const newMax = Math.round(minPrice + position * range);
      const clampedMax = Math.max(newMax, min);
      setMax(clampedMax);
      if (position >= 0.99) {
        setIsMaxHeld(true);
      } else {
        setIsMaxHeld(false);
      }
      onChange({ min, max: clampedMax });
    }
  };

  const handleMouseDown =
    (thumb: "min" | "max") => (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      setDragging(thumb);

      const onMove = (e: MouseEvent | TouchEvent) => handleDrag(e, thumb);
      const onUp = () => {
        setDragging(null);
        setIsMaxHeld(false);
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
        document.removeEventListener("touchmove", onMove);
        document.removeEventListener("touchend", onUp);
      };

      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
      document.addEventListener("touchmove", onMove);
      document.addEventListener("touchend", onUp);
    };

  // Keyboard navigation
  const handleKeyDown = (thumb: "min" | "max") => (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      if (thumb === "min") {
        const newMin = Math.max(minPrice, min - 1);
        setMin(newMin);
        onChange({ min: newMin, max });
      } else {
        const newMax = Math.max(min, max - 1);
        setMax(newMax);
        onChange({ min, max: newMax });
      }
    } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      if (thumb === "min") {
        const newMin = Math.min(max, min + 1);
        setMin(newMin);
        onChange({ min: newMin, max });
      } else {
        const newMax = max + 1;
        setMax(newMax);
        setDynamicMax((prev) => Math.max(prev, newMax));
        onChange({ min, max: newMax });
      }
    }
  };

  const minPosition = ((min - minPrice) / (dynamicMax - minPrice)) * 100;
  const maxPosition = ((max - minPrice) / (dynamicMax - minPrice)) * 100;

  return (
    <div className="relative w-full h-6">
      <div
        ref={trackRef}
        className="absolute top-1/2 w-full h-2 bg-gray-300 rounded transform -translate-y-1/2"
      >
        <div
          className="absolute h-2 bg-primary rounded-full"
          style={{
            left: `${minPosition}%`,
            width: `${maxPosition - minPosition}%`,
          }}
        />
      </div>
      <div
        className={`absolute w-4 h-4 bg-primary rounded-full shadow-md cursor-pointer transform -translate-y-1/2 transition-colors hover:bg-primary ${
          dragging === "min" ? "z-20" : "z-10"
        }`}
        style={{ left: `${minPosition}%`, top: "50%" }}
        onMouseDown={handleMouseDown("min")}
        onTouchStart={handleMouseDown("min")}
        onKeyDown={handleKeyDown("min")}
        role="slider"
        aria-label="Minimum price"
        aria-valuemin={minPrice}
        aria-valuemax={max}
        aria-valuenow={min}
        tabIndex={0}
      />
      <div
        className={`absolute w-4 h-4 bg-primary rounded-full shadow-md cursor-pointer transform -translate-y-1/2 transition-colors hover:bg-primary ${
          dragging === "max" ? "z-20" : "z-10"
        }`}
        style={{ left: `${maxPosition - 1}%`, top: "50%" }}
        onMouseDown={handleMouseDown("max")}
        onTouchStart={handleMouseDown("max")}
        onKeyDown={handleKeyDown("max")}
        role="slider"
        aria-label="Maximum price"
        aria-valuemin={min}
        aria-valuemax={dynamicMax}
        aria-valuenow={max}
        tabIndex={0}
      />
    </div>
  );
}

export function Slider({
  progress,
  onProgressChange,
  max,
}: {
  progress: number;
  onProgressChange: (p: number) => void;
  max?: number;
}) {
  const [value, setValue] = useState(progress);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const newValue = Math.min(Math.max((offsetX / rect.width) * 100, 0), 100);
      setValue(newValue);
      onProgressChange(newValue);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, onProgressChange]);

  return (
    <div className="w-full mx-auto">
      <div className="relative h-2 bg-gray-300 rounded-full" ref={sliderRef}>
        <div
          className="absolute h-2 bg-primary rounded-full"
          style={{ width: `${value}%` }}
        ></div>
        <div
          className="absolute w-4 h-4 bg-primary rounded-full -mt-1 cursor-pointer"
          style={{ left: `calc(${value}% - 12px)` }}
          onMouseDown={handleMouseDown}
        ></div>
      </div>
    </div>
  );
}
