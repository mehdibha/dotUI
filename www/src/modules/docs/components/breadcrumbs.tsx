"use client";

import { usePathname } from "next/navigation";
import { useBreadcrumb } from "fumadocs-core/breadcrumb";
import { PageTree } from "fumadocs-core/server";
import {
  Breadcrumbs as Breadcrumbs_,
  BreadcrumbsProps,
  Breadcrumb,
} from "@/components/ui/breadcrumbs";

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
