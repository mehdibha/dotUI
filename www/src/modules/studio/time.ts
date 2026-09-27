const UNITS = [
  ["year", 31_536_000],
  ["month", 2_592_000],
  ["week", 604_800],
  ["day", 86_400],
  ["hour", 3600],
  ["minute", 60],
] as const

const FORMATS = {
  long: new Intl.RelativeTimeFormat("en", { numeric: "auto" }),
  narrow: new Intl.RelativeTimeFormat("en", {
    numeric: "auto",
    style: "narrow",
  }),
}

/** "2 hours ago", or "2h ago" narrow, which reads mid-sentence. */
export function ago(
  at: number,
  now: number,
  style: keyof typeof FORMATS = "long",
): string {
  const seconds = (now - at) / 1000
  for (const [unit, size] of UNITS)
    if (seconds >= size)
      return FORMATS[style].format(-Math.floor(seconds / size), unit)
  return style === "narrow" ? "just now" : "Just now"
}
