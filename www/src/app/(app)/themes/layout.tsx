"use client";

import React from "react";
import { ChevronsRightIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useMounted } from "@/hooks/use-mounted";
import { Button } from "@/components/core/button";
import { useSidebarContext } from "@/components/sidebar";
import { PreviewProvider } from "./components/context";
import { Preview } from "./components/preview";

export default function ThemesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const { isCollapsed } = useSidebarContext();
  const isMounted = useMounted();

  React.useEffect(() => {
    setIsOpen(true);
  }, []);

  return (
    <PreviewProvider>
      <div className={cn("max-w-screen-3xl relative mx-auto flex")}>
        <div className="relative flex-1">
          <div className="container max-w-4xl px-0">
            <div
              className={cn(
                "container max-w-none border-x",
                isOpen && "border-transparent"
              )}
            >
              {children}
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -left-2 top-2 -translate-x-full">
            <AnimatePresence>
              {!isOpen && isMounted && (
                <motion.div
                  initial={{ opacity: 0.8, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0.8, x: 100 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    variant="default"
                    size="sm"
                    onPress={() => setIsOpen(true)}
                    className="bg-bg-inverse/5 sticky top-0 border"
                  >
                    Preview
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <motion.div
            initial={false}
            animate={{ width: isOpen ? (isCollapsed ? 600 : 500) : 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className="sticky right-0 top-0 z-10 h-[100svh] w-0 overflow-hidden"
          >
            <motion.div
              initial={false}
              animate={{ width: isCollapsed ? 600 : 500 }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="h-full"
            >
              <div className="bg-bg-muted flex items-center border-x px-2 py-1">
                <Button
                  variant="quiet"
                  shape="square"
                  size="sm"
                  className="size-7"
                  onPress={() => setIsOpen(false)}
                >
                  <ChevronsRightIcon />
                </Button>
              </div>
              <Preview />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </PreviewProvider>
  );
}
