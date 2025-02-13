"use client";

import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { ViewTransitions } from "next-view-transitions";
import { cn } from "@/lib/utils";
import { useMounted } from "@/hooks/use-mounted";
import { Button } from "@/components/core/button";
import { useSidebarContext } from "@/components/sidebar";
import { PreviewProvider } from "./theme/components/context";
import { Preview } from "./theme/components/preview";

export default function ThemesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setOpen] = React.useState(false);
  const [screen, setScreen] = React.useState<"desktop" | "mobile">("desktop");
  const { isCollapsed } = useSidebarContext();
  const previewWidth = Math.min(
    screen === "mobile" ? 420 : 700,
    isCollapsed ? 700 : 600
  );
  const containerWidth = isOpen ? previewWidth : 0;
  const isMounted = useMounted();

  React.useEffect(() => {
    setOpen(true);
  }, []);

  return (
    <ViewTransitions>
      <PreviewProvider>
        <div className={cn("max-w-screen-3xl relative mx-auto flex")}>
          <div className="relative flex-1">
            <div className={cn("container max-w-3xl")}>{children}</div>
          </div>
          <div className="relative">
            <div className="absolute -left-2 top-5 -translate-x-full">
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
                      onPress={() => setOpen(true)}
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
              animate={{ width: containerWidth }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="sticky right-0 top-0 z-10 h-[100svh] w-0 overflow-hidden"
            >
              <motion.div
                initial={false}
                animate={{ width: previewWidth }}
                transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                className="h-full p-4"
              >
                <Preview
                  setOpen={setOpen}
                  screen={screen}
                  onScreenChange={setScreen}
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </PreviewProvider>
    </ViewTransitions>
  );
}
