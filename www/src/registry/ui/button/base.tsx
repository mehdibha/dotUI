"use client"

import type * as React from "react"
import * as ButtonPrimitives from "react-aria-components/Button"
import { composeRenderProps } from "react-aria-components/composeRenderProps"
import * as LinkPrimitives from "react-aria-components/Link"
import type { VariantProps } from "tailwind-variants"

import { Loader } from "@/registry/ui/loader"

import { useStyles } from "./styles"
import type { ButtonStyles } from "./styles"

// MARK: buttonStyles

export { buttonStyles } from "./styles"

type ButtonVariants = VariantProps<ButtonStyles>

const truncateLabel = (children: React.ReactNode) =>
  typeof children === "string" ? (
    <span className="truncate">{children}</span>
  ) : (
    children
  )

// MARK: Separator

interface ButtonProps
  extends React.ComponentProps<typeof ButtonPrimitives.Button>, ButtonVariants {
  isIconOnly?: boolean
}

const Button = ({
  variant,
  size,
  isIconOnly,
  className,
  children,
  ...props
}: ButtonProps) => {
  const styles = useStyles()

  const renderChildren = composeRenderProps(
    children,
    (children, { isPending }) => (
      <>
        {isPending && (
          <Loader
            data-spinner=""
            aria-label="loading"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        )}
        {truncateLabel(children)}
      </>
    ),
  )

  return (
    <ButtonPrimitives.Button
      data-button=""
      data-icon-only={isIconOnly ? "" : undefined}
      className={composeRenderProps(className, (className) =>
        styles({ variant, size, isIconOnly, className }),
      )}
      {...props}
      // Wrapping undefined children would override context-injected children (e.g. ColorPicker's swatch) in RAC's context merge.
      children={children === undefined ? undefined : renderChildren}
    />
  )
}

// MARK: Separator

interface LinkButtonProps
  extends
    React.ComponentProps<typeof LinkPrimitives.Link>,
    VariantProps<ButtonStyles> {
  isIconOnly?: boolean
}

const LinkButton = ({
  variant,
  size,
  isIconOnly,
  className,
  children,
  ...props
}: LinkButtonProps) => {
  const styles = useStyles()

  return (
    <LinkPrimitives.Link
      data-button=""
      data-icon-only={isIconOnly ? "" : undefined}
      className={composeRenderProps(className, (className) =>
        styles({ variant, size, isIconOnly, className }),
      )}
      {...props}
    >
      {composeRenderProps(children, truncateLabel)}
    </LinkPrimitives.Link>
  )
}

// MARK: Separator

export type { ButtonProps, LinkButtonProps }
export { Button, LinkButton }
