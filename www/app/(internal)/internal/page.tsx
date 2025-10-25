"use client";

import { useMounted } from "@/hooks/use-mounted";
import React from "react";

export default function InternalPage() {
   const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    // Wait for the next animation frame to ensure initial paint
    requestAnimationFrame(() => {
      setIsMounted(true);
    });
  }, []);

  return (
    <div>
      <div
        className="size-10 bg-red-500 transition-opacity duration-3000"
        style={{ opacity: isMounted ? 1 : 0 }}
      />
    </div>
  );
}
