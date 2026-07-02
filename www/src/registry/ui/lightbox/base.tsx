'use client'

import * as React from 'react'
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from 'lucide-react'

import { Button } from '@/registry/ui/button'
import { DialogContent } from '@/registry/ui/dialog'
import { Modal } from '@/registry/ui/modal'

import { useStyles } from './styles'

// MARK: lightboxStyles

interface LightboxImage {
  src: string
  alt?: string
}

// MARK: Lightbox

interface LightboxProps extends React.ComponentProps<'div'> {
  images: LightboxImage[]
}

const Lightbox = ({ images, className, ...props }: LightboxProps) => {
  const { root, grid, thumbnail, thumbnailImage } = useStyles()()
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null)
  // Retains the last viewed index through the close animation so the modal's
  // exit transition still has an image to render after `activeIndex` clears.
  const [displayedIndex, setDisplayedIndex] = React.useState(0)

  const isOpen = activeIndex !== null

  const select = React.useCallback((index: number) => {
    setActiveIndex(index)
    setDisplayedIndex(index)
  }, [])

  const close = React.useCallback(() => setActiveIndex(null), [])

  return (
    <div className={root({ className })} {...props}>
      <div className={grid()}>
        {images.map((image, index) => (
          <button
            // oxlint-disable-next-line react/no-array-index-key -- images is a positional gallery with no stable id
            key={index}
            type="button"
            className={thumbnail()}
            aria-label={image.alt ?? `Open image ${index + 1}`}
            onClick={() => select(index)}
          >
            <img
              src={image.src}
              alt={image.alt ?? ''}
              className={thumbnailImage()}
              loading="lazy"
            />
          </button>
        ))}
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={(value) => {
          if (!value) close()
        }}
        className="border-0 bg-transparent! shadow-none"
      >
        <LightboxViewer
          images={images}
          index={displayedIndex}
          onIndexChange={select}
          onClose={close}
        />
      </Modal>
    </div>
  )
}

// MARK: LightboxViewer

interface LightboxViewerProps {
  images: LightboxImage[]
  index: number
  onIndexChange: (index: number) => void
  onClose: () => void
}

const LightboxViewer = ({
  images,
  index,
  onIndexChange,
  onClose,
}: LightboxViewerProps) => {
  const {
    viewer,
    figure,
    image,
    caption,
    controls,
    navButton,
    closeButton,
    counter,
  } = useStyles()()

  const count = images.length
  const active = images[index]

  const goPrev = React.useCallback(() => {
    onIndexChange((index - 1 + count) % count)
  }, [index, count, onIndexChange])

  const goNext = React.useCallback(() => {
    onIndexChange((index + 1) % count)
  }, [index, count, onIndexChange])

  // Arrow keys navigate between images while the viewer is mounted. Escape is
  // already handled by the underlying Modal.
  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        goPrev()
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        goNext()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [goPrev, goNext])

  if (!active) {
    return null
  }

  return (
    <DialogContent
      aria-label={active.alt ?? `Image ${index + 1} of ${count}`}
      className={viewer()}
    >
      <Button
        variant="quiet"
        size="sm"
        isIconOnly
        aria-label="Close"
        className={closeButton()}
        onPress={onClose}
      >
        <XIcon />
      </Button>
      <figure className={figure()}>
        <img src={active.src} alt={active.alt ?? ''} className={image()} />
        {count > 1 && (
          <>
            <div className={controls()}>
              <Button
                variant="default"
                size="sm"
                isIconOnly
                aria-label="Previous image"
                className={navButton()}
                onPress={goPrev}
              >
                <ChevronLeftIcon />
              </Button>
              <Button
                variant="default"
                size="sm"
                isIconOnly
                aria-label="Next image"
                className={navButton()}
                onPress={goNext}
              >
                <ChevronRightIcon />
              </Button>
            </div>
            <span className={counter()}>
              {index + 1} / {count}
            </span>
          </>
        )}
      </figure>
      {active.alt && (
        <figcaption className={caption()}>{active.alt}</figcaption>
      )}
    </DialogContent>
  )
}

// MARK: Exports

export type { LightboxImage, LightboxProps, LightboxViewerProps }
export { Lightbox, LightboxViewer }
