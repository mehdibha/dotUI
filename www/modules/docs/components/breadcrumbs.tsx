"use client";

import { usePathname } from "next/navigation";
import { useBreadcrumb } from "fumadocs-core/breadcrumb";
import type { PageTree } from "fumadocs-core/server";

import {
  Breadcrumb,
  Breadcrumbs as Breadcrumbs_,
} from "@dotui/ui/components/breadcrumbs";
import type { BreadcrumbsProps } from "@dotui/ui/components/breadcrumbs";

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
