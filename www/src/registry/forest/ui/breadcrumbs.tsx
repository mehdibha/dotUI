"use client";

import { ChevronRightIcon } from "lucide-react";
import {
  Breadcrumbs as AriaBreadcrumbs,
  Breadcrumb as AriaBreadcrumb,
  Link as AriaLink,
  composeRenderProps,
  type BreadcrumbsProps as AriaBreadcrumbsProps,
  type LinkProps as AriaLinkProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { focusRing } from "@/registry/forest/lib/focus-styles";

const breadcrumbsStyles = tv({
  slots: {
    root: "text-fg-muted flex flex-wrap items-center gap-1.5 break-words text-sm [&_svg]:size-4",
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
      item({ className })
    )}
    {...props}
  />
);

interface BreadcrumbLinkProps extends React.ComponentProps<typeof AriaLink> {}
const BreadcrumbLink = ({ className, ...props }: BreadcrumbLinkProps) => (
  <AriaLink
    className={composeRenderProps(className, (className) =>
      link({ className })
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
