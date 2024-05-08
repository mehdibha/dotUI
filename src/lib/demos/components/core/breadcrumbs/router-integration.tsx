"use client";

import { usePathname } from "next/navigation";
import { Breadcrumbs, BreadcrumbsItem } from "@/lib/components/core/default/breadcrumbs";

export default function BreadcrumbssDemo() {
  const pathname = usePathname();
  // make it array and remove first empty string
  const paths = pathname.split("/").slice(1);

  return (
    <Breadcrumbs>
      {paths.map((path, index) => (
        <BreadcrumbsItem key={index}>{path}</BreadcrumbsItem>
      ))}
    </Breadcrumbs>
  );
}
