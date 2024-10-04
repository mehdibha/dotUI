"use client";

import * as React from "react";
import { useMounted } from "@/registry/hooks/use-mounted";
import { cn } from "@/registry/ui/default/lib/cn";
import { AlignLeftIcon } from "lucide-react";
import { ScrollArea } from "@/registry/ui/default/core/scroll-area";

interface Item {
  title: string;
  url: string;
  items?: Item[];
}

interface TableOfContents {
  items?: Item[];
}

interface TocProps {
  toc: TableOfContents;
}

export function TableOfContents({ toc }: TocProps) {
  const itemIds = React.useMemo(
    () =>
      toc.items
        ? toc.items
            .flatMap((item) => [item.url, item?.items?.map((item) => item.url)])
            .flat()
            .filter(Boolean)
            .map((id) => id?.split("#")[1])
        : [],
    [toc]
  );
  const activeHeading = useActiveItem(itemIds as string[]);
  const mounted = useMounted();

  if (!toc?.items || !mounted) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h3 className="font-medium flex items-center gap-2 text-fg-muted [&_svg]:size-4">
        <AlignLeftIcon /> On This Page
      </h3>
      <ScrollArea>
        <Tree tree={toc} activeItem={activeHeading ?? undefined} />
      </ScrollArea>
    </div>
  );
}

function useActiveItem(itemIds: string[]) {
  const [activeId, setActiveId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: `0% 0% -80% 0%` }
    );

    itemIds?.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      itemIds?.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [itemIds]);

  return activeId;
}

interface TreeProps {
  tree: TableOfContents;
  level?: number;
  activeItem?: string;
}

function Tree({ tree, level = 1, activeItem }: TreeProps) {
  return tree?.items?.length ? (
    <ul
      className={cn("m-0 list-none text-fg-muted")}
    >
      {tree.items.map((item, index) => {
        return (
          <li key={index}>
            <a
              href={item.url}
              data-active={item.url === `#${activeItem}`}
              className={cn(
                "inline-block no-underline transition-colors py-1 [overflow-wrap:anywhere] data-[active=true]:font-medium data-[active=true]:text-fg pl-4 w-full",
                {
                  "pl-7": level === 2,
                  "pl-11": level === 3,
                }
              )}
            >
              {item.title}
            </a>
            {item.items?.length ? (
              <Tree tree={item} level={level + 1} activeItem={activeItem} />
            ) : null}
          </li>
        );
      })}
    </ul>
  ) : null;
}
