/* The site's theme hook pulls in TanStack Start (server code). The film sets
   each surface's mode explicitly, so the panel only ever reads "dark". */
export function useTheme() {
  return {
    theme: "dark",
    resolvedTheme: "dark",
    systemTheme: "dark",
    setTheme: () => {},
    themes: ["light", "dark"],
  }
}
