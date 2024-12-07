"use client";

import { ChevronRightIcon } from "lucide-react";
import {
  Link as AriaLink,
  Breadcrumbs as AriaBreadcrumbs,
  Breadcrumb as AriaBreadcrumb,
  type BreadcrumbsProps as AriaBreadcrumbsProps,
  type BreadcrumbProps as AriaBreadcrumbProps,
  type LinkProps as AriaLinkProps,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const breadcrumbsStyles = tv({
  slots: {
    root: "text-fg-muted flex flex-wrap items-center gap-1.5 break-words text-sm [&_svg]:size-4",
    item: "inline-flex items-center gap-1.5 last:[&_svg]:hidden",
    link: "hover:text-fg current:text-fg disabled:[&:not([data-current])]:text-fg-disabled inline-flex items-center gap-1.5 transition-colors disabled:cursor-default",
  },
});

type BreadcrumbsProps<T extends object> = AriaBreadcrumbsProps<T>;

const Breadcrumbs = <T extends object>({
  className,
  ...props
}: BreadcrumbsProps<T>) => {
  const { root } = breadcrumbsStyles();
  return <AriaBreadcrumbs {...props} className={root({ className })} />;
};

type BreadcrumbProps = Omit<AriaBreadcrumbProps, "children"> &
  Omit<AriaLinkProps, "className" | "style"> & { icon?: React.ReactNode };
const Breadcrumb = ({
  children,
  className,
  style,
  icon = null,
  ...props
}: BreadcrumbProps) => {
  return (
    <BreadcrumbItem className={className} style={style} {...props}>
      {icon}
      <BreadcrumbLink {...props}>{children}</BreadcrumbLink>
      <ChevronRightIcon />
    </BreadcrumbItem>
  );
};

type BreadcrumbItemProps = AriaBreadcrumbProps;
const BreadcrumbItem = (props: BreadcrumbItemProps) => {
  const { item } = breadcrumbsStyles();
  return (
    <AriaBreadcrumb
      {...props}
      className={composeRenderProps(props.className, (className) =>
        item({ className })
      )}
    />
  );
};

interface BreadcrumbLinkProps extends Omit<AriaLinkProps, "className"> {
  className?: string;
}
const BreadcrumbLink = ({ className, ...props }: BreadcrumbLinkProps) => {
  const { link } = breadcrumbsStyles();
  return <AriaLink {...props} className={link({ className })} />;
};

export type {
  BreadcrumbsProps,
  BreadcrumbProps,
  BreadcrumbItemProps,
  BreadcrumbLinkProps,
};
export { Breadcrumbs, Breadcrumb, BreadcrumbItem, BreadcrumbLink };
