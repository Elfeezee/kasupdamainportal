// Inspired by various accessible carousel patterns and shadcn/ui styling
"use client";

import type { StaticImageData } from "next/image";
import Image from "next/image";
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface CarouselImage {
  src: string | StaticImageData;
  alt: string;
  hint?: string;
  customClassName?: string; // Added for image-specific classes
}

interface CarouselProps {
  images: CarouselImage[];
  className?: string;
  imageClassName?: string; // Fallback/default class for images
  showNavigation?: boolean;
  showDots?: boolean;
  autoPlay?: boolean;
  interval?: number;
}

export function Carousel({
  images,
  className,
  imageClassName, // This will serve as a default for images without customClassName
  showNavigation = true,
  showDots = true,
  autoPlay = true,
  interval = 5000, // 5 seconds
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const resetTimeout = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = React.useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  }, [images.length]);

  React.useEffect(() => {
    if (!autoPlay || images.length <= 1) return;

    resetTimeout();
    timeoutRef.current = setTimeout(goToNext, interval);

    return () => {
      resetTimeout();
    };
  }, [currentIndex, autoPlay, interval, goToNext, images.length, resetTimeout]);

  if (!images || images.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center h-64 bg-muted rounded-lg",
          className
        )}
        role="region"
        aria-label="Image carousel"
      >
        <p className="text-muted-foreground">No images to display.</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden aspect-[16/9] sm:aspect-[16/7] md:aspect-[16/6] lg:aspect-[21/9]",
        className
      )}
      role="region"
      aria-roledescription="carousel"
      aria-label="Image gallery"
    >
      <div
        className="absolute inset-0 w-full h-full"
        aria-live={autoPlay ? "off" : "polite"}
        aria-atomic="false"
      >
        {images.map((image, index) => (
          <Image
            key={index}
            src={image.src}
            alt={image.alt}
            data-ai-hint={image.hint}
            fill
            sizes="100vw"
            className={cn(
              "absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out",
              // Apply image-specific class, then fallback to Carousel's imageClassName prop, then to 'object-cover'
              image.customClassName || imageClassName || "object-cover",
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            )}
            priority={index === 0}
            aria-hidden={index !== currentIndex}
            role="group"
            aria-roledescription="slide"
            aria-label={`Image ${index + 1} of ${images.length}: ${image.alt}`}
          />
        ))}
      </div>

      {showNavigation && images.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/60 hover:bg-background/80 text-foreground z-30 p-2"
            onClick={() => {
              goToPrevious();
              resetTimeout();
            }}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/60 hover:bg-background/80 text-foreground z-30 p-2"
            onClick={() => {
              goToNext();
              resetTimeout();
            }}
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
        </>
      )}

      {showDots && images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-30" role="tablist" aria-label="Image slide controls">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                resetTimeout();
              }}
              className={cn(
                "h-2.5 w-2.5 rounded-full transition-all duration-300 ease-in-out",
                currentIndex === index
                  ? "bg-primary scale-125"
                  : "bg-muted hover:bg-muted-foreground/50"
              )}
              role="tab"
              aria-selected={currentIndex === index}
              aria-label={`Go to image ${index + 1}`}
              aria-controls={`carousel-image-${index}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}