/**
 * A PDF viewer that renders a document one page at a time with controls for
 * page navigation and zoom. Built on `react-pdf` (pdf.js).
 */
export interface PdfViewerProps extends Omit<
  React.ComponentProps<'div'>,
  'children' | 'onError'
> {
  /**
   * URL or path of the PDF document to render.
   */
  file: string

  /**
   * The page shown when the viewer first mounts.
   * @default 1
   */
  defaultPage?: number

  /**
   * The zoom level the viewer starts at, where `1` is 100%.
   * @default 1
   */
  defaultScale?: number
}
