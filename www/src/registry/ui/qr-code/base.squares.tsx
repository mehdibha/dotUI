"use client"

import * as React from "react"
import { encode } from "uqr"

import { useStyles } from "./styles"

// MARK: qrCodeStyles

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

    let d = ""
    for (let y = 0; y < qr.size; y++) {
      for (let x = 0; x < qr.size; x++) {
        if (!qr.data[y]?.[x]) continue
        if (x >= start && x < end && y >= start && y < end) continue
        d += `M${x} ${y}h1v1h-1z`
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
        shapeRendering="crispEdges"
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
