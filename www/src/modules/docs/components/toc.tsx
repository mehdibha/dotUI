"use client";

import type {
  TOCItemType,
  TableOfContents as TocType,
} from "fumadocs-core/server";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useTocThumb } from "@/modules/docs/hooks/use-toc-thumb";
import * as TocPrimitive from "fumadocs-core/toc";

export const TableOfContents = ({ toc }: { toc: TocType }) => {
  if (toc.length === 0) return null;

  return (
    <TocPrimitive.AnchorProvider toc={toc}>
      <ScrollArea
        containerClassName="flex flex-col"
        className="relative min-h-0 pb-4 text-sm"
      >
        <TocItems toc={toc} />
      </ScrollArea>
    </TocPrimitive.AnchorProvider>
  );
};

const TocItems = ({ toc }: { toc: TocType }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const pos = useTocThumb(containerRef as React.RefObject<HTMLElement>);

  return (
    <TocPrimitive.ScrollProvider containerRef={viewportRef}>
      <div ref={viewportRef}>
        <div
          role="none"
          className="bg-fg absolute start-0 w-px transition-all"
          style={{
            top: pos[0],
            height: pos[1],
          }}
        />
        <div ref={containerRef} className={cn("flex flex-col border-s-[1px]")}>
          {toc.map((item) => (
            <TOCItem key={item.url} item={item} />
          ))}
        </div>
      </div>
    </TocPrimitive.ScrollProvider>
  );
};

function TOCItem({ item }: { item: TOCItemType }): React.ReactElement {
  return (
    <TocPrimitive.TOCItem
      href={item.url}
      className={cn(
        "text-fg-muted data-[active=true]:text-fg py-1 text-sm [overflow-wrap:anywhere] transition-colors first:pt-0 last:pb-0",
        item.depth <= 2 && "pl-4",
        item.depth === 3 && "pl-8",
        item.depth >= 4 && "pl-12",
      )}
    >
      {item.title}
    </TocPrimitive.TOCItem>
  );
}
