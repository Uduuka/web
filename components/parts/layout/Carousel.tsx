"use client";

import { ComponentProps, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface CarouselProps extends ComponentProps<"div"> {
  images: string[];
  alt: string;
}

export default function Carousel({
  images,
  alt,
  className,
  ...props
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      prevSlide();
    } else if (e.key === "ArrowRight") {
      nextSlide();
    }
  };

  if (images.length === 0) {
    return (
      <div
        className={cn("rounded-lg", className)}
        aria-hidden="true"
        {...props}
      />
    );
  }

  return (
    <div
      className={cn("relative overflow-hidden rounded-lg", className)}
      role="region"
      aria-label="Image carousel"
      onKeyDown={handleKeyDown}
      {...props}
    >
      <div
        className="flex w-full h-full transition-transform duration-300"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div key={index} className="w-full relative h-full flex-shrink-0">
            <Image
              src={image}
              alt={`${alt} ${index + 1}`}
              fill
              className="object-cover"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAErgJ9y0C0vQAAAABJRU5ErkJggg=="
              aria-current={index === currentIndex ? "true" : "false"}
            />
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-primary/80 text-white p-2 rounded-full hover:bg-primary transition"
            aria-label="Previous image"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary/80 text-white p-2 rounded-full hover:bg-primary transition"
            aria-label="Next image"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition ${
                  index === currentIndex ? "bg-primary" : "bg-accent/50"
                }`}
                aria-label={`Go to image ${index + 1}`}
                aria-current={index === currentIndex ? "true" : "false"}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
