"use client";

import { ChevronRightIcon } from "lucide-react";
import {
  Breadcrumb as AriaBreadcrumb,
  Breadcrumbs as AriaBreadcrumbs,
  Link as AriaLink,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type { BreadcrumbsProps as AriaBreadcrumbsProps } from "react-aria-components";

const breadcrumbsStyles = tv({
  slots: {
    root: "wrap-break-word flex flex-wrap items-center gap-1.5 text-fg-muted text-sm [&_svg]:size-4",
    item: "inline-flex items-center gap-1",
    link: [
      "focus-reset focus-visible:focus-ring",
      "inline-flex items-center gap-1 rounded px-0.5 current:text-fg leading-none transition-colors disabled:cursor-default disabled:not-current:text-fg-disabled hover:[a]:text-fg",
    ],
  },
});

const { root, item, link } = breadcrumbsStyles();

interface BreadcrumbsProps<T extends object> extends AriaBreadcrumbsProps<T> {
  ref?: React.RefObject<HTMLOListElement>;
}
const Breadcrumbs = <T extends object>({
  className,
  ...props
}: BreadcrumbsProps<T>) => {
  return <AriaBreadcrumbs className={root({ className })} {...props} />;
};

type BreadcrumbProps = BreadcrumbItemProps &
  Omit<BreadcrumbLinkProps, "children">;
const Breadcrumb = ({ ref, children, ...props }: BreadcrumbProps) => {
  return (
    <BreadcrumbItem ref={ref} {...props}>
      {composeRenderProps(children, (children, { isCurrent }) => (
        <>
          <BreadcrumbLink {...props}>{children}</BreadcrumbLink>
          {!isCurrent && <ChevronRightIcon />}
        </>
      ))}
    </BreadcrumbItem>
  );
};

interface BreadcrumbItemProps
  extends React.ComponentProps<typeof AriaBreadcrumb> {}
const BreadcrumbItem = ({ className, ...props }: BreadcrumbItemProps) => (
  <AriaBreadcrumb
    className={composeRenderProps(className, (className) =>
      item({ className }),
    )}
    {...props}
  />
);

interface BreadcrumbLinkProps extends React.ComponentProps<typeof AriaLink> {}
const BreadcrumbLink = ({ className, ...props }: BreadcrumbLinkProps) => (
  <AriaLink
    className={composeRenderProps(className, (className) =>
      link({ className }),
    )}
    {...props}
  />
);

export { Breadcrumbs, Breadcrumb, BreadcrumbItem, BreadcrumbLink };

export type {
  BreadcrumbsProps,
  BreadcrumbProps,
  BreadcrumbItemProps,
  BreadcrumbLinkProps,
};
