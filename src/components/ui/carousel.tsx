"use client"

import * as React from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type CarouselApi = {
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: () => boolean
  canScrollNext: () => boolean
}

const CarouselContext = React.createContext<CarouselApi | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }
  return context
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [carouselRef, setCarouselRef] = React.useState<HTMLDivElement | null>(
    null
  )
  const [api, setApi] = React.useState<CarouselApi | null>(null)

  const scrollPercentage = 80

  React.useEffect(() => {
    if (!carouselRef) return

    const handlePrev = () => {
      const container = carouselRef
      const scrollAmount = container.clientWidth * (scrollPercentage / 100)
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" })
    }

    const handleNext = () => {
      const container = carouselRef
      const scrollAmount = container.clientWidth * (scrollPercentage / 100)
      container.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }

    const checkScrollable = () => {
      if (!carouselRef) return { prev: false, next: false }
      
      return {
        prev: carouselRef.scrollLeft > 0,
        next: carouselRef.scrollLeft < (carouselRef.scrollWidth - carouselRef.clientWidth)
      }
    }

    setApi({
      scrollPrev: handlePrev,
      scrollNext: handleNext,
      canScrollPrev: () => checkScrollable().prev,
      canScrollNext: () => checkScrollable().next,
    })
  }, [carouselRef, scrollPercentage])

  return (
    <CarouselContext.Provider value={api}>
      <div
        ref={ref}
        className={cn("relative", className)}
        {...props}
      >
        <div 
          ref={containerRef} 
          className="overflow-hidden"
        >
          <div
            ref={setCarouselRef}
            className="flex -ml-4 overflow-x-auto hide-scrollbar snap-x snap-mandatory scroll-smooth"
          >
            {children}
          </div>
        </div>
      </div>
    </CarouselContext.Provider>
  )
})
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex w-full", className)}
    {...props}
  />
))
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("pl-4 min-w-0 shrink-0 grow-0 snap-start", className)}
    {...props}
  />
))
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-8 w-8 rounded-full left-2 top-1/2 -translate-y-1/2 z-10",
        className
      )}
      disabled={!canScrollPrev()}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
})
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-8 w-8 rounded-full right-2 top-1/2 -translate-y-1/2 z-10",
        className
      )}
      disabled={!canScrollNext()}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  )
})
CarouselNext.displayName = "CarouselNext"

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
}
