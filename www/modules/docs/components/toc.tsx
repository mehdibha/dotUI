"use client";

import React from "react";
import * as TocPrimitive from "fumadocs-core/toc";
import type {
  TOCItemType,
  TableOfContents as TocType,
} from "fumadocs-core/toc";

import { cn } from "@dotui/registry/lib/utils";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useTocThumb } from "@/modules/docs/hooks/use-toc-thumb";

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
          className="absolute start-0 w-px bg-fg transition-all"
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
        "py-1 text-sm [overflow-wrap:anywhere] text-fg-muted transition-colors first:pt-0 last:pb-0 data-[active=true]:text-fg",
        item.depth <= 2 && "pl-4",
        item.depth === 3 && "pl-8",
        item.depth >= 4 && "pl-12",
      )}
    >
      {item.title}
    </TocPrimitive.TOCItem>
  );
}
