"use client";

import React from "react";
import * as TocPrimitive from "fumadocs-core/toc";
import * as Primitive from "fumadocs-core/toc";
import { AlignLeftIcon } from "lucide-react";
import type {
  TOCItemType,
  TableOfContents as TocType,
} from "fumadocs-core/toc";

import { cn } from "@dotui/registry/lib/utils";

export const TableOfContents = ({
  toc: tocProp,
  ...props
}: React.ComponentProps<"div"> & { toc?: TocType | null }) => {
  const tocFromContext = useToc();
  const toc = tocProp ?? tocFromContext;

  if (!toc || toc.length === 0) return null;

  return (
    <div {...props}>
      <div className="-ml-1.5 mb-3 flex items-center gap-2">
        <AlignLeftIcon className="size-4 text-fg-muted" />
        <p className="text-fg-muted text-sm">On this page</p>
      </div>
      <TocPrimitive.AnchorProvider toc={toc}>
        <div
          data-scroll-area-viewport=""
          className="relative flex min-h-0 flex-col overflow-auto pr-4 pb-4 text-sm"
        >
          <TocItems toc={toc} />
        </div>
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
        "wrap-anywhere py-1 text-fg-muted text-sm transition-colors first:pt-0 last:pb-0 data-[active=true]:text-fg",
        item.depth <= 2 && "pl-4",
        item.depth === 3 && "pl-8",
        item.depth >= 4 && "pl-12",
      )}
    >
      {item.title}
    </TocPrimitive.TOCItem>
  );
}

interface TocContextValue {
  toc: TocType | null;
}

const TocContext = React.createContext<TocContextValue>({
  toc: null,
});

export function TocProvider({
  children,
  toc,
}: {
  children: React.ReactNode;
  toc: TocType | null;
}) {
  return <TocContext.Provider value={{ toc }}>{children}</TocContext.Provider>;
}

export function useToc(): TocType | null {
  const context = React.useContext(TocContext);
  return context.toc;
}

export type TOCThumb = [top: number, height: number];

export function useTocThumb(
  containerRef: React.RefObject<HTMLElement>,
): TOCThumb {
  const active = Primitive.useActiveAnchors();
  const [pos, setPos] = React.useState<TOCThumb>([0, 0]);

  React.useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    function onResize(): void {
      if (active.length === 0 || container.clientHeight === 0) {
        setPos([0, 0]);
        return;
      }

      let upper = Number.MAX_VALUE,
        lower = 0;

      for (const item of active) {
        const element = container.querySelector<HTMLElement>(
          `a[href="#${item}"]`,
        );
        if (!element) continue;

        const styles = getComputedStyle(element);
        upper = Math.min(
          upper,
          element.offsetTop + parseFloat(styles.paddingTop),
        );
        lower = Math.max(
          lower,
          element.offsetTop +
            element.clientHeight -
            parseFloat(styles.paddingBottom),
        );
      }

      setPos([upper, lower - upper]);
    }

    onResize();
    const observer = new ResizeObserver(onResize);
    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [active, containerRef]);

  return pos;
}
