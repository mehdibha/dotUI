"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ViewTransitions } from "next-view-transitions";
import { cn } from "@/lib/utils";
import { useMounted } from "@/hooks/use-mounted";
import { Button } from "@/components/core/button";
import { TableOfContents } from "@/components/docs/toc";
import { useSidebarContext } from "@/components/sidebar";
import { PreviewProvider } from "@/app/(app)/themes/theme/components/context";
import { Preview } from "@/app/(app)/themes/theme/components/preview";

export default function ThemesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isOpenState, setOpen] = React.useState(false);
  const isOpen = pathname === "/themes" ? false : isOpenState;
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
          {isMounted && pathname !== "/themes" && (
            <motion.div
              initial={false}
              animate={{ width: isOpen ? 0 : 300 }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="sticky right-0 top-0 z-0 h-[100svh] w-0 overflow-hidden"
            >
              <motion.div
                initial={false}
                animate={{ width: 300, opacity: isOpen ? 0 : 1 }}
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
          )}
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
              className="sticky right-0 top-0 z-10 flex h-[100svh] w-0 justify-end overflow-hidden"
            >
              <motion.div
                animate={{ width: previewWidth }}
                transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                className="h-full p-4 pl-0"
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
