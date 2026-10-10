---
version: alpha
name: Fixture Light Full
description: "A synthetic light system for the importer tests."
colors:
  primary: "#3b5bdb"
  on-primary: "#ffffff"
  canvas: "#faf8f3"
  ink: "#1f1d1a"
  muted: "#6b665e"
  hairline: "#e5e0d6"
  success: "#2f9e44"
  warning: "#f08c00"
  error: "#e03131"
typography:
  display:
    fontFamily: "EB Garamond, Georgia, serif"
    fontSize: 48px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: -1px
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
  button:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.2
rounded:
  md: 8px
  lg: 12px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 8px 16px
    height: 36px
  button-primary-hover:
    backgroundColor: "#2f4ac0"
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    border: "1px solid {colors.hairline}"
    rounded: "{rounded.md}"
    padding: 8px 12px
  card:
    backgroundColor: "{colors.canvas}"
    border: "1px solid {colors.hairline}"
    rounded: "{rounded.lg}"
    padding: 24px
---

# Fixture Light Full

## Overview

A warm paper canvas with one blue accent.

## Colors

- **Primary** ({colors.primary}): Buttons and links.
- **Canvas** ({colors.canvas}): The default page background.
- **Ink** ({colors.ink}): Body text.

## Typography

Headlines run EB Garamond; body and UI run Inter.

## Layout

- **Base unit**: 4px.

## Elevation & Depth

| Level | Treatment                     | Use                |
| ----- | ----------------------------- | ------------------ |
| 0     | No shadow                     | Page sections      |
| 1     | `0 1px 3px rgba(0,0,0,0.1)`   | Cards              |
| 2     | `0 8px 24px rgba(0,0,0,0.12)` | Menus and popovers |

## Components

Cards sit on the canvas with a 1px hairline border.
