/** The specimen sheets www renders at /internal/specimens, by name: the
 *  probe's targets say which sheet holds each part. */
export const SHEET_NAMES = [
  "actions",
  "fields",
  "selection",
  "menu",
  "dialog",
  "drawer",
  "command",
  "navigation",
  "feedback",
  "display",
  "dates",
  "type",
] as const

export type SheetName = (typeof SHEET_NAMES)[number]
