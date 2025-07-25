"use client";

import type {
  BreadcrumbsProps as AriaBreadcrumbsProps,
  LinkProps as AriaLinkProps,
} from "react-aria-components";
import { focusRing } from "@/registry/lib/focus-styles";
import { ChevronRightIcon } from "lucide-react";
import {
  Breadcrumb as AriaBreadcrumb,
  Breadcrumbs as AriaBreadcrumbs,
  Link as AriaLink,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const breadcrumbsStyles = tv({
  slots: {
    root: "text-fg-muted flex flex-wrap items-center gap-1.5 text-sm break-words [&_svg]:size-4",
    item: "inline-flex items-center gap-1",
    link: [
      focusRing(),
      "current:text-fg hover:[&:is(a)]:text-fg disabled:not-current:text-fg-disabled inline-flex items-center gap-1 rounded px-0.5 leading-none transition-colors disabled:cursor-default",
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

interface BreadcrumbProps
  extends React.ComponentProps<typeof BreadcrumbItem>,
    Omit<AriaLinkProps, "children" | "className" | "style"> {}
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

export type {
  BreadcrumbsProps,
  BreadcrumbProps,
  BreadcrumbItemProps,
  BreadcrumbLinkProps,
};

export { Breadcrumbs, Breadcrumb, BreadcrumbItem, BreadcrumbLink };
