'use client'

import * as React from 'react'
import { tv } from 'tailwind-variants'
import { encode, QrCodeDataType } from 'uqr'

const qrCodeStyles = tv({
  slots: {
    root: 'relative inline-flex size-32 shrink-0 items-center justify-center rounded-(--qr-code-radius) bg-bg p-2 text-fg',
    logo: 'absolute flex size-1/5 items-center justify-center *:size-full',
  },
})

const { root, logo } = qrCodeStyles()

const DOT_RADIUS = 0.5

function circle(cx: number, cy: number, r: number) {
  return `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 -${2 * r} 0z`
}

function roundedSquare(x: number, y: number, w: number, r: number) {
  const edge = w - 2 * r
  return (
    `M${x + r} ${y}` +
    `h${edge}a${r} ${r} 0 0 1 ${r} ${r}` +
    `v${edge}a${r} ${r} 0 0 1 -${r} ${r}` +
    `h-${edge}a${r} ${r} 0 0 1 -${r} -${r}` +
    `v-${edge}a${r} ${r} 0 0 1 ${r} -${r}z`
  )
}

// Scanners require solid finder patterns, so the three corner markers are
// drawn as rounded squares instead of dots.
function finder(x: number, y: number) {
  return (
    roundedSquare(x, y, 7, 2.5) +
    roundedSquare(x + 1, y + 1, 5, 1.75) +
    roundedSquare(x + 2, y + 2, 3, 1.5)
  )
}

interface QRCodeProps extends React.ComponentProps<'div'> {
  value: string
  errorCorrection?: 'L' | 'M' | 'Q' | 'H'
}

function QRCode({
  value,
  errorCorrection,
  className,
  children,
  'aria-label': ariaLabel = 'QR code',
  ...props
}: QRCodeProps) {
  const hasLogo = !!children

  const { size, path } = React.useMemo(() => {
    const qr = encode(value, {
      ecc: errorCorrection ?? (hasLogo ? 'H' : 'M'),
      border: 0,
    })
    // Center modules are skipped so the logo sits in clean whitespace.
    const reserved = hasLogo ? Math.ceil(qr.size * 0.3) : 0
    const start = Math.floor((qr.size - reserved) / 2)
    const end = start + reserved

    let d = ''
    for (let y = 0; y < qr.size; y++) {
      for (let x = 0; x < qr.size; x++) {
        if (!qr.data[y]?.[x]) continue
        if (qr.types[y]?.[x] === QrCodeDataType.Position) continue
        if (x >= start && x < end && y >= start && y < end) continue
        d += circle(x + 0.5, y + 0.5, DOT_RADIUS)
      }
    }
    d += finder(0, 0)
    d += finder(qr.size - 7, 0)
    d += finder(0, qr.size - 7)
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
        <path d={path} fillRule="evenodd" />
      </svg>
      {hasLogo && (
        <span data-qr-code-logo="" className={logo()}>
          {children}
        </span>
      )}
    </div>
  )
}

export type { QRCodeProps }
export { QRCode }
