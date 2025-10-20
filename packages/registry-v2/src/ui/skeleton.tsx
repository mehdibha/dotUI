"use client";

import { createContext, useContext } from "react";

const SkeletonContext = createContext<boolean>(false);

export const SkeletonProvider = ({
  children,
  isLoading,
}: {
  children: React.ReactNode;
  isLoading?: boolean;
}) => {
  if (!isLoading) {
    return children;
  }
  return (
    <SkeletonContext.Provider value={true}>
      <div className="skeleton-provider">{children}</div>
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
