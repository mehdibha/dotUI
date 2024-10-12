"use client";

import { usePathname } from "next/navigation";
import { useBreadcrumb } from "fumadocs-core/breadcrumb";
import { PageTree } from "fumadocs-core/server";
import { ChevronRightIcon } from "lucide-react";
import {
  Breadcrumbs as Breadcrumbs_,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbsProps,
} from "@/registry/ui/default/core/breadcrumbs";
import { cn } from "@/registry/ui/default/lib/cn";

export const Breadcrumbs = <T extends object>({
  tree,
  ...props
}: BreadcrumbsProps<T> & { tree: PageTree.Root }) => {
  let pathname = usePathname();
  const breadcrumbs = useBreadcrumb(pathname, tree);

  return (
    <Breadcrumbs_ {...props}>
      {breadcrumbs.map((elem, index) => (
        <BreadcrumbItem key={index}>
          <BreadcrumbLink
            href={elem.url}
            className={cn(!elem.url && "hover:text-fg-muted")}
          >
            {elem.name}
          </BreadcrumbLink>
          <ChevronRightIcon />
        </BreadcrumbItem>
      ))}
    </Breadcrumbs_>
  );
};
