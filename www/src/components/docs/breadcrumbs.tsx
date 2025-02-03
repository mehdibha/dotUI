"use client";

import { usePathname } from "next/navigation";
import { useBreadcrumb } from "fumadocs-core/breadcrumb";
import { PageTree } from "fumadocs-core/server";
import { ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Breadcrumbs as Breadcrumbs_,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbsProps,
} from "@/components/core/breadcrumbs";

export const Breadcrumbs = <T extends object>({
  tree,
  ...props
}: BreadcrumbsProps<T> & { tree: PageTree.Root }) => {
  const pathname = usePathname();
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
