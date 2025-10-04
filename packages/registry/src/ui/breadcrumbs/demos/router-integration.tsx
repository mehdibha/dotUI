"use client";

import { usePathname } from "next/navigation";
import type { Route } from "next";

import { Breadcrumb, Breadcrumbs } from "@dotui/registry/ui/breadcrumbs";

export default function Demo() {
  const pathname = usePathname();
  const pathnames = pathname.split("/").filter((x) => x);

  return (
    <Breadcrumbs>
      {pathnames.map((elem, index) => {
        const href = `/${pathnames.slice(0, index + 1).join("/")}` as Route;
        return (
          <Breadcrumb key={elem} href={href} className="capitalize">
            {elem}
          </Breadcrumb>
        );
      })}
    </Breadcrumbs>
  );
}
