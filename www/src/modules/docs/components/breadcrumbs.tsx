"use client";

import { usePathname } from "next/navigation";
import type {
  BreadcrumbsProps} from "@/components/ui/breadcrumbs";
import {
  Breadcrumb,
  Breadcrumbs as Breadcrumbs_
} from "@/components/ui/breadcrumbs";
import { useBreadcrumb } from "fumadocs-core/breadcrumb";
import type { PageTree } from "fumadocs-core/server";

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
