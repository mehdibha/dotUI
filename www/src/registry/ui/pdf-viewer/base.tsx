'use client'

import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

import * as React from 'react'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from 'lucide-react'
import { Document, Page, pdfjs } from 'react-pdf'

import { Button } from '@/registry/ui/button'

import { useStyles } from './styles'

// MARK: worker

// react-pdf needs the pdf.js worker. Point it at the CDN build that matches the
// bundled pdfjs version so the worker and the API never drift apart.
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

const MIN_SCALE = 0.5
const MAX_SCALE = 3
const SCALE_STEP = 0.25

// MARK: PdfViewer

interface PdfViewerProps extends Omit<
  React.ComponentProps<'div'>,
  'children' | 'onError'
> {
  /** URL or path of the PDF document to render. */
  file: string
  /** The page shown when the viewer first mounts. @default 1 */
  defaultPage?: number
  /** The zoom level the viewer starts at. @default 1 */
  defaultScale?: number
}

function PdfViewer({
  file,
  defaultPage = 1,
  defaultScale = 1,
  className,
  ...props
}: PdfViewerProps) {
  const {
    root,
    toolbar,
    group,
    pageInfo,
    zoomInfo,
    viewport,
    document,
    page,
    message,
  } = useStyles()()

  const [numPages, setNumPages] = React.useState<number | null>(null)
  const [pageNumber, setPageNumber] = React.useState(defaultPage)
  const [scale, setScale] = React.useState(defaultScale)

  const onLoadSuccess = ({ numPages: loaded }: { numPages: number }) => {
    setNumPages(loaded)
    // Clamp the active page in case `defaultPage` overshot the document length.
    setPageNumber((current) => Math.min(Math.max(current, 1), loaded))
  }

  const goToPrevious = () => {
    setPageNumber((current) => Math.max(current - 1, 1))
  }

  const goToNext = () => {
    setPageNumber((current) =>
      numPages === null ? current : Math.min(current + 1, numPages),
    )
  }

  const zoomOut = () => {
    setScale((current) => Math.max(current - SCALE_STEP, MIN_SCALE))
  }

  const zoomIn = () => {
    setScale((current) => Math.min(current + SCALE_STEP, MAX_SCALE))
  }

  const isFirstPage = pageNumber <= 1
  const isLastPage = numPages !== null && pageNumber >= numPages

  return (
    <div data-pdf-viewer="" className={root({ className })} {...props}>
      <div data-pdf-viewer-toolbar="" className={toolbar()}>
        <div className={group()}>
          <Button
            variant="quiet"
            isIconOnly
            aria-label="Previous page"
            isDisabled={isFirstPage}
            onPress={goToPrevious}
          >
            <ChevronLeftIcon />
          </Button>
          <span className={pageInfo()}>
            {numPages === null
              ? 'Loading…'
              : `Page ${pageNumber} of ${numPages}`}
          </span>
          <Button
            variant="quiet"
            isIconOnly
            aria-label="Next page"
            isDisabled={isLastPage}
            onPress={goToNext}
          >
            <ChevronRightIcon />
          </Button>
        </div>
        <div className={group()}>
          <Button
            variant="quiet"
            isIconOnly
            aria-label="Zoom out"
            isDisabled={scale <= MIN_SCALE}
            onPress={zoomOut}
          >
            <ZoomOutIcon />
          </Button>
          <span className={zoomInfo()}>{Math.round(scale * 100)}%</span>
          <Button
            variant="quiet"
            isIconOnly
            aria-label="Zoom in"
            isDisabled={scale >= MAX_SCALE}
            onPress={zoomIn}
          >
            <ZoomInIcon />
          </Button>
        </div>
      </div>
      <div data-pdf-viewer-viewport="" className={viewport()}>
        <Document
          file={file}
          onLoadSuccess={onLoadSuccess}
          className={document()}
          loading={<div className={message()}>Loading PDF…</div>}
          error={<div className={message()}>Failed to load PDF.</div>}
          noData={<div className={message()}>No PDF file specified.</div>}
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            className={page()}
            loading={<div className={message()}>Loading page…</div>}
          />
        </Document>
      </div>
    </div>
  )
}

// MARK: separator

export type { PdfViewerProps }
export { PdfViewer }
