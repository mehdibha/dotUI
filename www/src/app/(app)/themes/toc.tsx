"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { useMounted } from "@/hooks/use-mounted";
import { TableOfContents } from "@/components/docs/toc";
import { usePreviewContext } from "./preview";

export function ThemeTableOfContents() {
  const isMounted = useMounted();
  const { isOpen: isPreviewOpen } = usePreviewContext();
  const pathname = usePathname();
  const isOpen = pathname.startsWith("/themes/") && !isPreviewOpen;

  if (!isMounted) return null;

  return (
    <motion.div
      initial={false}
      animate={{ width: isOpen ? 170 : 0 }}
      transition={{ type: "spring", bounce: 0, duration: 0.3 }}
      className="sticky top-0 z-0 h-[100svh] w-0 overflow-hidden"
    >
      <motion.div
        initial={false}
        animate={{ width: 170, opacity: isOpen ? 1 : 0 }}
        transition={{ type: "spring", bounce: 0, duration: 0.3 }}
        className="h-full pt-10"
      >
        <TableOfContents
          toc={[
            { depth: 2, title: "Colors", url: "#colors" },
            { depth: 3, title: "Core colors", url: "#core-colors" },
            {
              depth: 3,
              title: "Semantic colors",
              url: "#semantic-colors",
            },
            { depth: 2, title: "Typography", url: "#typography" },
            { depth: 2, title: "Icongraphy", url: "#iconography" },
            { depth: 2, title: "Layout", url: "#radius" },
          ]}
        />
      </motion.div>
    </motion.div>
  );
}
