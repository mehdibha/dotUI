"use client"

import * as BreadcrumbsPrimitive from "react-aria-components/Breadcrumbs"
import { composeRenderProps } from "react-aria-components/composeRenderProps"

import { createParamValue } from "@/lib/styles"
import { ChevronRightIcon } from "@/registry/icons"

import { useStyles } from "./styles"

// MARK: breadcrumbsStyles

const useSeparatorGlyph = createParamValue({
  componentName: "breadcrumbs",
  paramName: "separator",
  defaultValue: "chevron",
  values: {
    chevron: <ChevronRightIcon />,
    slash: "/",
  },
})

// MARK: Separator

interface BreadcrumbsProps<
  T extends object,
> extends BreadcrumbsPrimitive.BreadcrumbsProps<T> {
  ref?: React.RefObject<HTMLOListElement>
}
const Breadcrumbs = <T extends object>({
  className,
  ...props
}: BreadcrumbsProps<T>) => {
  const { root } = useStyles()()
  return (
    <BreadcrumbsPrimitive.Breadcrumbs
      data-breadcrumbs=""
      className={root({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface BreadcrumbItemProps extends React.ComponentProps<
  typeof BreadcrumbsPrimitive.Breadcrumb
> {}
const BreadcrumbItem = ({ className, ...props }: BreadcrumbItemProps) => {
  const { item } = useStyles()()
  return (
    <BreadcrumbsPrimitive.Breadcrumb
      data-breadcrumb-item=""
      className={composeRenderProps(className, (className) =>
        item({ className }),
      )}
      {...props}
    />
  )
}

// MARK: Separator

interface BreadcrumbLinkProps extends React.ComponentProps<
  typeof BreadcrumbsPrimitive.Link
> {}
const BreadcrumbLink = ({ className, ...props }: BreadcrumbLinkProps) => {
  const { link } = useStyles()()
  return (
    <BreadcrumbsPrimitive.Link
      data-breadcrumb-link=""
      className={composeRenderProps(className, (className) =>
        link({ className }),
      )}
      {...props}
    />
  )
}

// MARK: Separator

interface BreadcrumbSeparatorProps extends React.ComponentProps<"span"> {}
const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: BreadcrumbSeparatorProps) => {
  const { separator } = useStyles()()
  const glyph = useSeparatorGlyph()
  return (
    <span
      data-breadcrumb-separator=""
      aria-hidden="true"
      className={separator({ className })}
      {...props}
    >
      {children ?? glyph}
    </span>
  )
}

// MARK: Separator

export type {
  BreadcrumbItemProps,
  BreadcrumbLinkProps,
  BreadcrumbSeparatorProps,
  BreadcrumbsProps,
}
export { BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, Breadcrumbs }
