"use client";

import { createContext, useContext } from "react";

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
