import type { ComponentProps } from 'react'
import type useEmblaCarousel from 'embla-carousel-react'

type CarouselOptions = NonNullable<Parameters<typeof useEmblaCarousel>[0]>

/**
 * A carousel — slides, arrows, and dots — built on Embla. The chrome
 * (`CarouselPrevious`/`CarouselNext` arrows, `CarouselDots`) is React Aria;
 * Embla is the (peer-dependency) scroll engine.
 */
export interface CarouselProps extends ComponentProps<'div'> {
  /** Embla options (loop, align, dragFree, …). */
  opts?: CarouselOptions
  /** Scroll axis. @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical'
  /** Auto-advance slides on an interval. @default false */
  autoplay?: boolean
  /** Autoplay interval in milliseconds. @default 4000 */
  autoplayDelay?: number
  /** Receives the Embla API once ready, for external control. */
  setApi?: (api: ReturnType<typeof useEmblaCarousel>[1]) => void
}
