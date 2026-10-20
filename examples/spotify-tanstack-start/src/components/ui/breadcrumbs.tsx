"use client";

import type * as React from "react";
import * as BreadcrumbsPrimitives from "react-aria-components/Breadcrumbs";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import { ChevronRightIcon } from "lucide-react";
import { tv } from "tailwind-variants";

const breadcrumbsVariants = tv({
  slots: {
    root: "flex flex-wrap items-center gap-1.5 text-sm wrap-break-word text-fg-muted",
    item: "inline-flex items-center gap-1",
    link: "focus-reset focus-visible:focus-ring-outside inline-flex items-center gap-1 px-0.5 leading-none transition-colors disabled:cursor-disabled disabled:not-current:text-(--disabled-fg,currentColor) current:text-fg hover:[a]:text-fg",
    separator: "[&_svg]:size-4",
  },
});

const { root, item, link, separator } = breadcrumbsVariants();

/* -------------------------------------------------------------------------- */

interface BreadcrumbsProps<
  T extends object,
> extends BreadcrumbsPrimitives.BreadcrumbsProps<T> {
  ref?: React.RefObject<HTMLOListElement>;
}
const Breadcrumbs = <T extends object>({
  className,
  ...props
}: BreadcrumbsProps<T>) => {
  return (
    <BreadcrumbsPrimitives.Breadcrumbs
      data-breadcrumbs=""
      className={root({ className })}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

interface BreadcrumbItemProps extends React.ComponentProps<
  typeof BreadcrumbsPrimitives.Breadcrumb
> {}
const BreadcrumbItem = ({ className, ...props }: BreadcrumbItemProps) => {
  return (
    <BreadcrumbsPrimitives.Breadcrumb
      data-breadcrumb-item=""
      className={composeRenderProps(className, (className) =>
        item({ className }),
      )}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

interface BreadcrumbLinkProps extends React.ComponentProps<
  typeof BreadcrumbsPrimitives.Link
> {}
const BreadcrumbLink = ({ className, ...props }: BreadcrumbLinkProps) => {
  return (
    <BreadcrumbsPrimitives.Link
      data-breadcrumb-link=""
      className={composeRenderProps(className, (className) =>
        link({ className }),
      )}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

interface BreadcrumbSeparatorProps extends React.ComponentProps<"span"> {}
const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: BreadcrumbSeparatorProps) => {
  return (
    <span
      data-breadcrumb-separator=""
      aria-hidden="true"
      className={separator({ className })}
      {...props}
    >
      {children ?? <ChevronRightIcon />}
    </span>
  );
};

/* -------------------------------------------------------------------------- */

export type {
  BreadcrumbItemProps,
  BreadcrumbLinkProps,
  BreadcrumbSeparatorProps,
  BreadcrumbsProps,
};
export { BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, Breadcrumbs };
