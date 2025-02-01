"use client";

import React from "react";
import { DemosProvider } from "@/lib/create-dynamic-component";
import { useHorizontalResize } from "@/hooks/use-horizontal-resize";
import { Skeleton } from "@/components/core/skeleton";

export const Loader = ({ children }: { children: React.ReactNode }) => {
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  return <Skeleton show={!isMounted}>{children}</Skeleton>;
};

export const ComponentWrapper = ({
  suspense,
  fallback = <Skeleton className="h-40" />,
  children,
}: {
  suspense?: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}) => {
  if (suspense) {
    return <React.Suspense fallback={fallback}>{children}</React.Suspense>;
  }
  return <DemosProvider>{children};</DemosProvider>;
};

export const ResizableContainer = ({
  children,
  resizable,
}: {
  children: React.ReactNode;
  resizable?: boolean;
}) => {
  const { containerRef, width, handleMouseDown } = useHorizontalResize({
    // minWidth: 100, // Optional custom minimum width
  });

  if (!resizable) return children;

  return (
    <div
      className="relative"
      ref={containerRef}
      style={{ width: width !== null ? `${width}px` : undefined }}
    >
      <div
        onMouseDown={handleMouseDown}
        className="h-15 bg-bg-neutral hover:bg-bg-neutral-hover active:bg-bg-neutral-active absolute right-2 top-1/2 z-20 w-2 -translate-y-1/2 cursor-col-resize rounded-full shadow-sm"
      />
      {children}
    </div>
  );
};
