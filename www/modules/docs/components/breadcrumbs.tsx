"use client";

import { usePathname } from "next/navigation";
import { useBreadcrumb } from "fumadocs-core/breadcrumb";
import type * as PageTree from "fumadocs-core/page-tree";

import {
  Breadcrumb,
  Breadcrumbs as Breadcrumbs_,
} from "@dotui/registry/ui/breadcrumbs";
import type { BreadcrumbsProps } from "@dotui/registry/ui/breadcrumbs";

export const Breadcrumbs = <T extends object>({
  tree,
  ...props
}: BreadcrumbsProps<T> & { tree: PageTree.Root }) => {
  const pathname = usePathname();
  const breadcrumbs = useBreadcrumb(pathname, tree);

  return (
    <Breadcrumbs_ {...props}>
      {breadcrumbs.map((elem, index) => (
        <Breadcrumb key={index}>{elem.name}</Breadcrumb>
      ))}
    </Breadcrumbs_>
  );
};
