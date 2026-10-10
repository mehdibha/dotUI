---
version: alpha
name: Fixture Refs
colors:
  primary: #abcdef
  canvas: "#ffffff"
  hairline: "#e0e0e0"
  ink: "{colors.ink-base}"
  ink-base: "#222222"
  loop-a: "{colors.loop-b}"
  loop-b: "{colors.loop-a}"
typography:
  button:
    fontFamily: Inter
    fontSize: 0.875rem
    lineHeight: 1.25rem
rounded:
  sm: 0.25rem
  md: 0.5rem
  pill: 9999px
spacing:
  sm: 0.5rem
  md: 1rem
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "{spacing.sm} {spacing.md}"
    border: "1px solid {colors.hairline}"
  text-input:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.md}"
    border: "1px solid {colors.hairline}"
---

# Fixture Refs
