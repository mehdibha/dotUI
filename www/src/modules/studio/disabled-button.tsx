"use client"

import { useRef } from "react"
import type { ReactNode } from "react"
import { useFocusable } from "react-aria/useFocusable"

import { useButtonStyles } from "@/registry/ui/button"

type ButtonVariants = Parameters<ReturnType<typeof useButtonStyles>>[0]

/** A disabled button that still takes focus and hover, so the Tooltip
 *  around it can say why. */
export function DisabledButton({
  variant,
  size,
  isIconOnly,
  className,
  children,
  "aria-label": label,
}: Omit<NonNullable<ButtonVariants>, "className"> & {
  className?: string
  children: ReactNode
  "aria-label"?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const { focusableProps } = useFocusable({}, ref)
  const styles = useButtonStyles()
  return (
    <span
      ref={ref}
      role="button"
      aria-label={label}
      aria-disabled="true"
      // The button's disabled styles key on react-aria's data attributes.
      data-rac=""
      data-disabled=""
      data-icon-only={isIconOnly ? "" : undefined}
      {...focusableProps}
      className={styles({ variant, size, isIconOnly, className })}
    >
      {children}
    </span>
  )
}
