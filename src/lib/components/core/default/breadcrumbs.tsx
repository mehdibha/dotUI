"use client";

import { ChevronRight } from "lucide-react";
import {
  Link as AriaLink,
  Breadcrumbs as AriaBreadcrumbs,
  Breadcrumb as AriaBreadcrumb,
  type BreadcrumbsProps as AriaBreadcrumbsProps,
  type BreadcrumbProps as AriaBreadcrumbProps,
  type LinkProps as AriaLinkProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { cn } from "@/lib/utils/classes";

const breadcrumbsVariants = tv({
  slots: {
    root: "flex flex-wrap items-center gap-1.5 break-words text-sm text-fg",
    item: "flex items-center gap-1.5",
    link: "text-fg-muted hover:text-fg transition-colors",
  },
});

interface BreadcrumbsProps<T extends object> extends AriaBreadcrumbsProps<T> {}

const Breadcrumbs = <T extends object>({ className, ...props }: BreadcrumbsProps<T>) => {
  const { root } = breadcrumbsVariants({});
  return <AriaBreadcrumbs {...props} className={root({ className })} />;
};

type BreadcrumbsItemProps = AriaBreadcrumbProps & AriaLinkProps;
const Breadcrumb = ({ className, ...props }: BreadcrumbsItemProps) => {
  const { item, link } = breadcrumbsVariants({});
  return (
    <AriaBreadcrumb {...props} className={cn(item({ className }))}>
      <AriaLink {...props} className={props.href && link()} />
      {props.href && <ChevronRight className="h-3 w-3" />}
    </AriaBreadcrumb>
  );
};

export { Breadcrumbs, Breadcrumb };
