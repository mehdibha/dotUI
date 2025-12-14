"use client";

import { createContext, useContext } from "react";

import { cn } from "../../lib/utils";

const SkeletonContext = createContext<boolean>(false);

interface SkeletonProviderProps {
  children: React.ReactNode;
  isLoading?: boolean;
}

export const SkeletonProvider = ({
  children,
  isLoading,
}: SkeletonProviderProps) => {
  if (!isLoading) {
    return children;
  }
  return (
    <SkeletonContext.Provider value={true}>
      <div inert className="skeleton-provider">
        {children}
      </div>
    </SkeletonContext.Provider>
  );
};

export const useSkeletonText = (children: React.ReactNode) => {
  const isInSkeleton = useContext(SkeletonContext);
  if (isInSkeleton) {
    return <span data-slot="skeleton-text">{children}</span>;
  }
  return children;
};

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  show?: boolean;
};
export function Skeleton({ className, show = true, ...props }: SkeletonProps) {
  if (!show) return props.children;
  return (
    <div
      className={cn(
        "relative block h-6 animate-pulse rounded-md bg-muted",
        props.children && "h-auto text-transparent *:invisible",
        className,
      )}
      {...props}
    />
  );
}
