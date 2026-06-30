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
import type {
  Document as DocumentComponent,
  Page as PageComponent,
} from 'react-pdf'

import { Button } from '@/registry/ui/button'

import { useStyles } from './styles'

// MARK: ssr

// pdf.js (react-pdf's renderer) reads browser-only globals at import time, which
// crash Node during SSR / prerendering. Stub the ones it touches so the chunk can
// load on the server — guarded to where they're missing (never the browser) and
// never exercised there, since the viewer renders only on the client.
if (typeof window === 'undefined') {
  const globals = globalThis as Record<string, unknown>
  globals.DOMMatrix ??= class DOMMatrixStub {}
  globals.Path2D ??= class Path2DStub {}
  globals.ImageData ??= class ImageDataStub {}
}

// MARK: engine

/**
 * react-pdf pulls in pdf.js, which references browser-only globals (DOMMatrix,
 * Path2D, …) at import time and crashes server-side rendering / prerendering.
 * It's loaded lazily in an effect (client-only) and held here; the types above
 * are import-only (erased). The worker is pinned to the bundled pdfjs version.
 */
interface ReactPdf {
  Document: typeof DocumentComponent
  Page: typeof PageComponent
}

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
  const [pdf, setPdf] = React.useState<ReactPdf | null>(null)

  React.useEffect(() => {
    let active = true
    // pdf.js references browser-only globals (DOMMatrix, …) and only runs in the
    // browser; swallow the rejection so server prerendering keeps the fallback.
    import('react-pdf')
      .then((mod) => {
        mod.pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${mod.pdfjs.version}/build/pdf.worker.min.mjs`
        if (active) setPdf({ Document: mod.Document, Page: mod.Page })
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

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
        {pdf ? (
          <pdf.Document
            file={file}
            onLoadSuccess={onLoadSuccess}
            className={document()}
            loading={<div className={message()}>Loading PDF…</div>}
            error={<div className={message()}>Failed to load PDF.</div>}
            noData={<div className={message()}>No PDF file specified.</div>}
          >
            <pdf.Page
              pageNumber={pageNumber}
              scale={scale}
              className={page()}
              loading={<div className={message()}>Loading page…</div>}
            />
          </pdf.Document>
        ) : (
          <div className={message()}>Loading PDF…</div>
        )}
      </div>
    </div>
  )
}

// MARK: separator

export type { PdfViewerProps }
export { PdfViewer }
