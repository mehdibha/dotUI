"use client";

import React, { createContext, useContext } from "react";
import * as TocPrimitive from "fumadocs-core/toc";
import { AlignLeftIcon } from "lucide-react";
import type {
  TOCItemType,
  TableOfContents as TocType,
} from "fumadocs-core/toc";

import { cn } from "@dotui/registry/lib/utils";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useTocThumb } from "@/modules/docs/hooks/use-toc-thumb";

// TocContext to provide toc to components
interface TocContextValue {
  toc: TocType | null;
}

const TocContext = createContext<TocContextValue>({
  toc: null,
});

// Hook to get toc: prop > context > null
export function useToc(): TocType | null {
  const context = useContext(TocContext);
  return context.toc;
}

// Provider component that wraps content and provides toc via context
export function TocProvider({
  children,
  toc,
}: {
  children: React.ReactNode;
  toc: TocType | null;
}) {
  return <TocContext.Provider value={{ toc }}>{children}</TocContext.Provider>;
}

export const TableOfContents = ({
  toc: tocProp,
  ...props
}: React.ComponentProps<"div"> & { toc?: TocType | null }) => {
  const tocFromContext = useToc();
  const toc = tocProp ?? tocFromContext;

  if (!toc || toc.length === 0) return null;

  return (
    <div {...props}>
      <div className="mb-3 -ml-1.5 flex items-center gap-2">
        <AlignLeftIcon className="size-4 text-fg-muted" />
        <p className="text-sm text-fg-muted">On this page</p>
      </div>
      <TocPrimitive.AnchorProvider toc={toc}>
        <ScrollArea
          containerClassName="flex flex-col"
          className="relative min-h-0 pb-4 text-sm"
        >
          <TocItems toc={toc} />
        </ScrollArea>
      </TocPrimitive.AnchorProvider>
    </div>
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
        <div ref={containerRef} className={cn("flex flex-col border-s-px")}>
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
        "py-1 text-sm wrap-anywhere text-fg-muted transition-colors first:pt-0 last:pb-0 data-[active=true]:text-fg",
        item.depth <= 2 && "pl-4",
        item.depth === 3 && "pl-8",
        item.depth >= 4 && "pl-12",
      )}
    >
      {item.title}
    </TocPrimitive.TOCItem>
  );
}
