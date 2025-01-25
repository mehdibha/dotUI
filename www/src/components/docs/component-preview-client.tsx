"use client";

import React from "react";
import { Skeleton } from "@/components/core/skeleton";

export const Loader = ({ children }: { children: React.ReactNode }) => {
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  return <Skeleton show={!isMounted}>{children}</Skeleton>;
};
