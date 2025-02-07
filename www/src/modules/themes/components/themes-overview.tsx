"use client";

import React from "react";
import { CheckIcon, CopyIcon, MoonIcon, SunIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useMounted } from "@/hooks/use-mounted";
import { Button } from "@/components/core/button";
import { Skeleton } from "@/registry/core/skeleton_basic";
import { Tabs, TabList, Tab } from "@/registry/core/tabs_motion";
import { themes } from "@/registry/registry-themes";
import { Theme } from "@/types/theme";
import {
  ComponentsOverview,
  MobileComponentsOverview,
} from "@/modules/demos/components/components-overview";
import { ThemeProvider } from "./theme-provider";

export const ThemesOverview = () => {
  const [currentThemeName, setCurrentThemeName] = React.useState<string>(
    (themes[0] as unknown as Theme).name
  );
  const [touched, setTouched] = React.useState<boolean>(false);
  const [userMode, setUserMode] = React.useState<"light" | "dark" | undefined>(
    undefined
  );
  const isMounted = useMounted();
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    void navigator.clipboard.writeText(
      `npx dotui-cli init ${currentThemeName}`
    );
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const currentTheme = themes.find((theme) => theme.name === currentThemeName)!;

  // React.useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (touched) return;
  //     const currentIndex = themes.findIndex(
  //       (theme) => theme.name === currentThemeName
  //     );
  //     const nextIndex = (currentIndex + 1) % themes.length;
  //     const nextTheme = themes[nextIndex];
  //     if (nextTheme) {
  //       setCurrentThemeName(nextTheme.name);
  //     }
  //   }, 5000);

  //   return () => clearInterval(interval);
  // }, [currentThemeName, touched]);

  return (
    <div className="flex flex-col items-center gap-10 md:gap-4">
      <div className="relative flex flex-col items-center gap-6 container">
        <div className="text-fg-muted relative items-center gap-2 py-2 pl-4 pr-2 font-mono text-xs flex">
          <motion.div
            layout
            initial={false}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-[-1] rounded-md border bg-[#f5f5f5] dark:bg-[#19191d]"
          />
          <pre>
            <code>
              <motion.span layout transition={{ duration: 0.5 }}>
                <span className="text-[#F69D50]">npx</span> dotui-cli init{" "}
              </motion.span>
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={currentTheme.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {currentThemeName}
                </motion.span>
              </AnimatePresence>
            </code>
          </pre>
          <motion.div layout>
            <Button
              variant="quiet"
              shape="square"
              size="sm"
              onPress={handleCopy}
              className="text-fg-muted z-20 bg-[#f5f5f5] dark:bg-[#19191d] [&_svg]:size-3.5"
            >
              {copied ? (
                <CheckIcon className="animate-in fade-in" />
              ) : (
                <CopyIcon className="animate-in fade-in" />
              )}
            </Button>
          </motion.div>
        </div>
        <div className="relative flex flex-col items-end gap-2">
          <div className="hidden xs:block absolute right-0 top-0 translate-x-[calc(100%-30px)] translate-y-[calc(-100%-30px)]">
            <div>
              <svg
                width="30"
                viewBox="0 0 106 212"
                fill="none"
                className="text-fg/40 rotate-40"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M89.5523 0.499048C87.5651 0.982422 84.0069 2.94278 81.2677 4.99712C78.5689 7.05146 71.3854 14.1947 67.6392 18.5853C59.8112 27.7426 55.0848 39.0884 53.2319 52.9989C52.5202 58.316 52.5202 68.5743 53.2319 74.4822C53.7824 78.9802 55.3131 87.0634 56.1993 89.8965L56.6826 91.4943L53.581 94.7839C38.0726 111.474 28.3916 132.111 24.0815 157.623C23.1685 163.168 22.0943 172.057 21.5706 178.448L21.3155 181.55L19.3283 178.287C15.7701 172.513 12.2925 168.217 8.66717 165.155C0.839139 158.468 -1.2421 159.516 1.92671 168.512C5.99514 179.979 15.1928 195.755 22.43 203.61C24.6723 206.054 28.8884 209.344 31.2919 210.552C33.937 211.922 34.9441 211.076 37.7503 205.074C38.6365 203.154 42.0873 196.924 45.4038 191.217C48.7338 185.511 51.4729 180.596 51.4729 180.261C51.4729 178.757 48.5995 174.943 44.7862 171.291C41.7919 168.458 39.6302 167.022 38.3277 167.022H37.3475L37.5758 165.128C38.5829 156.454 43.6717 141.564 48.9217 131.883C53.2856 123.827 57.9851 117.315 65.2492 109.164L66.6859 107.54L68.6059 109.299C75.1852 115.368 84.45 118.389 91.0696 116.67C95.5945 115.462 98.4411 112.884 101.006 107.58C102.805 103.901 103.248 102.236 103.288 99.47C103.315 93.5084 95.5005 83.8945 87.2563 79.7187C83.8055 77.9598 81.6437 77.5301 78.4883 77.9867C74.4199 78.5775 70.6335 80.3632 65.0209 84.3779C63.6245 85.385 62.416 86.204 62.3489 86.1369C61.9595 85.7072 61.2344 76.1606 61.2344 70.9509C61.2344 63.8479 61.5567 60.1018 62.698 54.3953C64.8463 43.7342 69.0222 35.1006 76.0312 26.8833C87.6725 13.2279 98.1994 6.67551 103.839 9.57576C104.591 9.93829 105.275 10.1263 105.369 10.0054C106.054 8.89099 100.576 2.9025 97.3535 1.2644C95.4334 0.284225 91.7812 -0.0782881 89.5255 0.485649L89.5523 0.499048ZM89.418 92.9712C89.324 93.4949 88.5721 95.2136 87.7933 96.8785C84.4097 103.981 78.5957 107.378 71.9493 106.13C70.7811 105.902 69.6667 105.606 69.4384 105.472C68.9148 105.15 74.9839 99.9265 78.9851 97.2276C82.8253 94.6496 87.7799 92.1791 89.2166 92.1119C89.4717 92.0851 89.5389 92.367 89.418 92.9578V92.9712Z"
                  fill="currentColor"
                />
              </svg>
              <span className="text-fg-muted w-30 font-josefin absolute right-0 top-0 translate-x-[150px] text-sm font-bold hidden lg:block">
                Give it a shot!
              </span>
            </div>
          </div>
          {/* <svg
            width="30"
            viewBox="0 0 106 212"
            fill="none"
            className="text-fg/40 rotate-40 -translate-x-10 lg:hidden absolute"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M89.5523 0.499048C87.5651 0.982422 84.0069 2.94278 81.2677 4.99712C78.5689 7.05146 71.3854 14.1947 67.6392 18.5853C59.8112 27.7426 55.0848 39.0884 53.2319 52.9989C52.5202 58.316 52.5202 68.5743 53.2319 74.4822C53.7824 78.9802 55.3131 87.0634 56.1993 89.8965L56.6826 91.4943L53.581 94.7839C38.0726 111.474 28.3916 132.111 24.0815 157.623C23.1685 163.168 22.0943 172.057 21.5706 178.448L21.3155 181.55L19.3283 178.287C15.7701 172.513 12.2925 168.217 8.66717 165.155C0.839139 158.468 -1.2421 159.516 1.92671 168.512C5.99514 179.979 15.1928 195.755 22.43 203.61C24.6723 206.054 28.8884 209.344 31.2919 210.552C33.937 211.922 34.9441 211.076 37.7503 205.074C38.6365 203.154 42.0873 196.924 45.4038 191.217C48.7338 185.511 51.4729 180.596 51.4729 180.261C51.4729 178.757 48.5995 174.943 44.7862 171.291C41.7919 168.458 39.6302 167.022 38.3277 167.022H37.3475L37.5758 165.128C38.5829 156.454 43.6717 141.564 48.9217 131.883C53.2856 123.827 57.9851 117.315 65.2492 109.164L66.6859 107.54L68.6059 109.299C75.1852 115.368 84.45 118.389 91.0696 116.67C95.5945 115.462 98.4411 112.884 101.006 107.58C102.805 103.901 103.248 102.236 103.288 99.47C103.315 93.5084 95.5005 83.8945 87.2563 79.7187C83.8055 77.9598 81.6437 77.5301 78.4883 77.9867C74.4199 78.5775 70.6335 80.3632 65.0209 84.3779C63.6245 85.385 62.416 86.204 62.3489 86.1369C61.9595 85.7072 61.2344 76.1606 61.2344 70.9509C61.2344 63.8479 61.5567 60.1018 62.698 54.3953C64.8463 43.7342 69.0222 35.1006 76.0312 26.8833C87.6725 13.2279 98.1994 6.67551 103.839 9.57576C104.591 9.93829 105.275 10.1263 105.369 10.0054C106.054 8.89099 100.576 2.9025 97.3535 1.2644C95.4334 0.284225 91.7812 -0.0782881 89.5255 0.485649L89.5523 0.499048ZM89.418 92.9712C89.324 93.4949 88.5721 95.2136 87.7933 96.8785C84.4097 103.981 78.5957 107.378 71.9493 106.13C70.7811 105.902 69.6667 105.606 69.4384 105.472C68.9148 105.15 74.9839 99.9265 78.9851 97.2276C82.8253 94.6496 87.7799 92.1791 89.2166 92.1119C89.4717 92.0851 89.5389 92.367 89.418 92.9578V92.9712Z"
              fill="currentColor"
            />
          </svg> */}
          <Tabs
            variant="solid"
            selectedKey={currentThemeName}
            onSelectionChange={(key) => {
              setCurrentThemeName(key as string);
              setCopied(false);
              setTouched(true);
            }}
          >
            <TabList className="flex-wrap justify-center bg-transparent">
              {themes.map((theme) => (
                <Tab
                  key={theme.name}
                  id={theme.name}
                  className="h-8 rounded-full px-4 text-sm"
                >
                  {theme.name}
                </Tab>
              ))}
            </TabList>
          </Tabs>
        </div>
      </div>
      <Skeleton show={!isMounted} className="w-full rounded-md">
        <div className="relative w-full">
          <ThemeProvider
            theme={currentTheme}
            mode={userMode}
            className="relative w-full bg-transparent"
          >
            {(mode) => (
              <>
                <AnimatePresence>
                  {isMounted && mode && (
                    <motion.div
                      initial={{ y: 40, zIndex: -1, opacity: 0 }}
                      animate={{ y: 0, zIndex: 1, opacity: 1 }}
                      exit={{ y: 40, zIndex: -1 }}
                      transition={{
                        type: "spring",
                        bounce: 0,
                        duration: 0.5,
                      }}
                      className={cn(
                        "bg-bg absolute right-0 top-0 z-[-1] flex -translate-y-[calc(100%-7px)] flex-col overflow-hidden rounded-t-md"
                      )}
                    >
                      <motion.div className="overflow-hidden rounded-t-md border-x border-t">
                        <Button
                          variant="quiet"
                          shape="square"
                          size="sm"
                          onPress={() => {
                            setUserMode(
                              userMode
                                ? userMode === "light"
                                  ? "dark"
                                  : "light"
                                : mode === "light"
                                  ? "dark"
                                  : "light"
                            );
                            setTouched(true);
                          }}
                          className="rounded-none"
                        >
                          {(
                            userMode ? userMode === "light" : mode === "light"
                          ) ? (
                            <SunIcon />
                          ) : (
                            <MoonIcon />
                          )}
                        </Button>
                      </motion.div>
                      <div className="bg-bg h-1.5 w-full border-r" />
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="bg-bg w-full rounded-md border">
                  <ComponentsOverview className="hidden sm:grid xl:container" />
                  <MobileComponentsOverview className="sm:hidden" />
                </div>
              </>
            )}
          </ThemeProvider>
        </div>
      </Skeleton>
    </div>
  );
};
