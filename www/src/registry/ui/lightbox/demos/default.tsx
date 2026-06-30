import { Lightbox } from '@/registry/ui/lightbox'

const images = [
  {
    src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80',
    alt: 'Mountain lake at sunrise',
  },
  {
    src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
    alt: 'Foggy forest valley',
  },
  {
    src: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&q=80',
    alt: 'Green valley with a river',
  },
  {
    src: 'https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?w=800&q=80',
    alt: 'Sunlit rolling hills',
  },
]

export default function Demo() {
  return (
    <div className="w-full max-w-xl">
      <Lightbox images={images} />
    </div>
  )
}
