'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import type { ComponentProps, KeyboardEvent } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import type { UseEmblaCarouselType } from 'embla-carousel-react'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

import { Button } from '@/registry/ui/button'

import { useStyles } from './styles'

// MARK: Context

type CarouselApi = UseEmblaCarouselType[1]
type CarouselRef = UseEmblaCarouselType[0]
type CarouselOptions = NonNullable<Parameters<typeof useEmblaCarousel>[0]>
type Orientation = 'horizontal' | 'vertical'

interface CarouselContextValue {
  carouselRef: CarouselRef
  api: CarouselApi
  orientation: Orientation
  scrollPrev: () => void
  scrollNext: () => void
  scrollTo: (index: number) => void
  canScrollPrev: boolean
  canScrollNext: boolean
  selectedIndex: number
  scrollSnaps: number[]
}

const CarouselContext = createContext<CarouselContextValue | null>(null)

const useCarousel = () => {
  const context = useContext(CarouselContext)
  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />')
  }
  return context
}

// MARK: Carousel

interface CarouselProps extends ComponentProps<'div'> {
  opts?: CarouselOptions
  orientation?: Orientation
  autoplay?: boolean
  autoplayDelay?: number
  setApi?: (api: CarouselApi) => void
}

const Carousel = ({
  opts,
  orientation = 'horizontal',
  autoplay = false,
  autoplayDelay = 4000,
  setApi,
  className,
  children,
  ...props
}: CarouselProps) => {
  const { root } = useStyles()()
  const [carouselRef, api] = useEmblaCarousel({
    ...opts,
    axis: orientation === 'horizontal' ? 'x' : 'y',
  })
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const onSelect = useCallback((emblaApi: CarouselApi) => {
    if (!emblaApi) return
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [])

  const scrollPrev = useCallback(() => api?.scrollPrev(), [api])
  const scrollNext = useCallback(() => api?.scrollNext(), [api])
  const scrollTo = useCallback((index: number) => api?.scrollTo(index), [api])

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      scrollPrev()
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      scrollNext()
    }
  }

  useEffect(() => {
    if (api && setApi) setApi(api)
  }, [api, setApi])

  useEffect(() => {
    if (!api) return
    setScrollSnaps(api.scrollSnapList())
    onSelect(api)
    api.on('reInit', onSelect)
    api.on('select', onSelect)
    return () => {
      api.off('reInit', onSelect)
      api.off('select', onSelect)
    }
  }, [api, onSelect])

  useEffect(() => {
    if (!api || !autoplay) return
    const id = window.setInterval(() => {
      if (api.canScrollNext()) api.scrollNext()
      else api.scrollTo(0)
    }, autoplayDelay)
    return () => window.clearInterval(id)
  }, [api, autoplay, autoplayDelay])

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api,
        orientation,
        scrollPrev,
        scrollNext,
        scrollTo,
        canScrollPrev,
        canScrollNext,
        selectedIndex,
        scrollSnaps,
      }}
    >
      <div
        data-carousel=""
        role="region"
        aria-roledescription="carousel"
        onKeyDown={handleKeyDown}
        className={root({ className })}
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  )
}

// MARK: CarouselContent

const CarouselContent = ({ className, ...props }: ComponentProps<'div'>) => {
  const { carouselRef, orientation } = useCarousel()
  const { viewport, container } = useStyles()()
  return (
    <div ref={carouselRef} data-carousel-content="" className={viewport()}>
      <div
        data-orientation={orientation}
        className={container({ className })}
        {...props}
      />
    </div>
  )
}

// MARK: CarouselItem

const CarouselItem = ({ className, ...props }: ComponentProps<'div'>) => {
  const { orientation } = useCarousel()
  const { item } = useStyles()()
  return (
    <div
      data-carousel-item=""
      role="group"
      aria-roledescription="slide"
      data-orientation={orientation}
      className={item({ className })}
      {...props}
    />
  )
}

// MARK: CarouselPrevious

interface CarouselButtonProps extends Omit<
  ComponentProps<typeof Button>,
  'className'
> {
  className?: string
}

const CarouselPrevious = ({ className, ...props }: CarouselButtonProps) => {
  const { scrollPrev, canScrollPrev, orientation } = useCarousel()
  const { previous } = useStyles()()
  return (
    <Button
      data-orientation={orientation}
      variant="default"
      size="sm"
      isIconOnly
      aria-label="Previous slide"
      isDisabled={!canScrollPrev}
      onPress={scrollPrev}
      className={previous({ className })}
      {...props}
    >
      <ChevronLeftIcon />
    </Button>
  )
}

// MARK: CarouselNext

const CarouselNext = ({ className, ...props }: CarouselButtonProps) => {
  const { scrollNext, canScrollNext, orientation } = useCarousel()
  const { next } = useStyles()()
  return (
    <Button
      data-orientation={orientation}
      variant="default"
      size="sm"
      isIconOnly
      aria-label="Next slide"
      isDisabled={!canScrollNext}
      onPress={scrollNext}
      className={next({ className })}
      {...props}
    >
      <ChevronRightIcon />
    </Button>
  )
}

// MARK: CarouselDots

const CarouselDots = ({ className, ...props }: ComponentProps<'div'>) => {
  const { scrollSnaps, selectedIndex, scrollTo } = useCarousel()
  const { dots, dot } = useStyles()()
  return (
    <div data-carousel-dots="" className={dots({ className })} {...props}>
      {scrollSnaps.map((_, index) => (
        <button
          // oxlint-disable-next-line react/no-array-index-key -- dots are positional and stable
          key={index}
          type="button"
          aria-label={`Go to slide ${index + 1}`}
          aria-current={index === selectedIndex}
          data-active={index === selectedIndex || undefined}
          className={dot()}
          onClick={() => scrollTo(index)}
        />
      ))}
    </div>
  )
}

// MARK: Separator

export type { CarouselProps, CarouselApi }
export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
}
