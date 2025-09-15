import Link from "next/link";
import type { Route } from "next";

import { cn } from "@dotui/ui/lib/utils";

import { docsSource } from "@/modules/docs/lib/source";

export function ComponentsList({
  category,
  className,
}: {
  category: string;
  className?: string;
}) {
  const components = docsSource.pageTree.children.find(
    (page) => page.$id === "components",
  );

  if (components?.type !== "folder") {
    return;
  }

  const componentsCategory = components.children.find(
    (page) => page.$id === `components/(${category})`,
  );

  if (componentsCategory?.type !== "folder") {
    return;
  }

  const list = componentsCategory.children.filter(
    (component) => component.type === "page",
  );

  return (
    <div className={cn("grid grid-cols-1 gap-1", className)}>
      {list.map((component) => (
        <Link
          key={component.$id}
          href={component.url as Route}
          className="text-lg font-medium underline-offset-4 hover:underline md:text-base"
        >
          {component.name}
        </Link>
      ))}
    </div>
  );
}
