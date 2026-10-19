"use client"

import * as React from "react"
import { encode } from "uqr"

import { useStyles } from "./styles"

// MARK: qrCodeStyles

const R = 0.5

function modulePath(
  x: number,
  y: number,
  tl: boolean,
  tr: boolean,
  br: boolean,
  bl: boolean,
) {
  const rTl = tl ? R : 0
  const rTr = tr ? R : 0
  const rBr = br ? R : 0
  const rBl = bl ? R : 0
  return (
    `M${x + rTl} ${y}` +
    `h${1 - rTl - rTr}` +
    (tr ? `a${R} ${R} 0 0 1 ${R} ${R}` : "") +
    `v${1 - rTr - rBr}` +
    (br ? `a${R} ${R} 0 0 1 -${R} ${R}` : "") +
    `h-${1 - rBr - rBl}` +
    (bl ? `a${R} ${R} 0 0 1 -${R} -${R}` : "") +
    `v-${1 - rBl - rTl}` +
    (tl ? `a${R} ${R} 0 0 1 ${R} -${R}` : "") +
    "z"
  )
}

// MARK: Separator

interface QRCodeProps extends React.ComponentProps<"div"> {
  value: string
  errorCorrection?: "L" | "M" | "Q" | "H"
}

const QRCode = ({
  value,
  errorCorrection,
  className,
  children,
  "aria-label": ariaLabel = "QR code",
  ...props
}: QRCodeProps) => {
  const { root, logo } = useStyles()()
  const hasLogo = !!children

  const { size, path } = React.useMemo(() => {
    const qr = encode(value, {
      ecc: errorCorrection ?? (hasLogo ? "H" : "M"),
      border: 0,
    })
    const reserved = hasLogo ? Math.ceil(qr.size * 0.3) : 0
    const start = Math.floor((qr.size - reserved) / 2)
    const end = start + reserved

    const dark = (x: number, y: number) =>
      !!qr.data[y]?.[x] && !(x >= start && x < end && y >= start && y < end)

    let d = ""
    for (let y = 0; y < qr.size; y++) {
      for (let x = 0; x < qr.size; x++) {
        if (!dark(x, y)) continue
        const up = dark(x, y - 1)
        const right = dark(x + 1, y)
        const down = dark(x, y + 1)
        const left = dark(x - 1, y)
        d += modulePath(
          x,
          y,
          !up && !left,
          !up && !right,
          !down && !right,
          !down && !left,
        )
      }
    }
    return { size: qr.size, path: d }
  }, [value, errorCorrection, hasLogo])

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      data-qr-code=""
      className={root({ className })}
      {...props}
    >
      <svg
        aria-hidden
        viewBox={`0 0 ${size} ${size}`}
        fill="currentColor"
        className="size-full"
      >
        <path d={path} />
      </svg>
      {hasLogo && (
        <span data-qr-code-logo="" className={logo()}>
          {children}
        </span>
      )}
    </div>
  )
}

// MARK: Separator

export type { QRCodeProps }
export { QRCode }
