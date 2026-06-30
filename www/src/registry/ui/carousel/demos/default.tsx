import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/registry/ui/carousel'

const slides = ['1', '2', '3', '4', '5']

export default function Demo() {
  return (
    <Carousel className="w-full max-w-xs" opts={{ loop: true }}>
      <CarouselContent>
        {slides.map((label) => (
          <CarouselItem key={label}>
            <div className="flex aspect-square items-center justify-center rounded-lg border bg-muted text-4xl font-semibold text-fg-muted">
              {label}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
      <CarouselDots />
    </Carousel>
  )
}
