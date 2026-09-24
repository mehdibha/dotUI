/** A registry file's URL for the exported design system — e.g.
 *  `url("init")` → `https://dotui.org/r/s/<id>/init.json`. */
export type ExportUrl = (file: string) => string
