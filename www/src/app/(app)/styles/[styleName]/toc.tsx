"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useMounted } from "@/hooks/use-mounted";
import { TableOfContents } from "@/modules/docs/components/toc";
import { AnimatePresence, motion } from "motion/react";

import { usePreviewContext } from "../preview";

export function ThemeTableOfContents() {
  const isMounted = useMounted();
  const { isOpen: isPreviewOpen } = usePreviewContext();
  const pathname = usePathname();
  const isOpen = pathname.startsWith("/themes/") && !isPreviewOpen;

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ width: 0, marginLeft: 0 }}
          animate={{ width: 170, marginLeft: 40 }}
          exit={{ width: 0, marginLeft: 0 }}
          transition={{ type: "spring", bounce: 0, duration: 0.3 }}
          className="sticky top-10 z-0 mt-6 h-[calc(100svh-var(--spacing)*16)] w-0 overflow-hidden max-lg:hidden"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ width: 170, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className="h-full"
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
      )}
    </AnimatePresence>
  );
}
