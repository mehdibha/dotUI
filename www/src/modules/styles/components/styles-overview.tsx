"use client";

import React from "react";
import { UNSAFE_PortalProvider } from "@react-aria/overlays";
import { CheckIcon, CopyIcon } from "lucide-react";
import { AnimatePresence, motion, Variants } from "motion/react";
import { useInView } from "motion/react";
import { useMounted } from "@/hooks/use-mounted";
import { Button } from "@/components/ui/button";
import {
  ComponentsOverview,
  MobileComponentsOverview,
} from "@/components/components-overview";
import { styles } from "@/modules/registry/registry-styles";
import { Skeleton } from "@/modules/registry/ui/skeleton.basic";
import { Tabs, TabList, Tab } from "@/modules/registry/ui/tabs.motion";
import { StyleProvider } from "@/modules/styles/components/style-provider";
import { createStyle } from "../lib/create-style";

export const StylesOverview = () => {
  const container = React.useRef(null);
  console.log(styles);
  const [currentStyleName, setCurrentStyleName] = React.useState<string>(
    styles[0]!.name
  );
  const ref = React.useRef(null);
  const isInView = useInView(ref);
  const [touched, setTouched] = React.useState<boolean>(false);
  const [copied, setCopied] = React.useState(false);
  const isMounted = useMounted();

  const handleCopy = () => {
    void navigator.clipboard.writeText(
      `npx shadcn@latest init https://dotui.org/r/${currentStyleName}/base.json`
    );
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const currentStyleFoundations = styles.find(
    (style) => style.name === currentStyleName
  )!;

  const currentStyle = React.useMemo(() => {
    return createStyle(currentStyleFoundations);
  }, [currentStyleFoundations]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (touched || !isInView) return;
      const currentIndex = styles.findIndex(
        (style) => style.name === currentStyleName
      );
      const nextIndex = (currentIndex + 1) % styles.length;
      const nextStyle = styles[nextIndex];
      if (nextStyle) {
        setCurrentStyleName(nextStyle.name);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentStyleName, touched, isInView]);

  return (
    <>
      {/* {isMounted && <StyleProvider ref={container} style={currentStyle} />} */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col-reverse items-center gap-4 xl:flex-row xl:items-end">
          <Tabs
            ref={ref}
            variant="solid"
            selectedKey={currentStyleName}
            onSelectionChange={(key) => {
              setCurrentStyleName(key as string);
              setCopied(false);
              setTouched(true);
            }}
          >
            <TabList className="flex-wrap justify-center bg-transparent">
              {styles.map((style) => (
                <Tab
                  key={style.name}
                  id={style.name}
                  className="h-8 rounded-full px-4 text-sm"
                >
                  {style.name}
                </Tab>
              ))}
            </TabList>
          </Tabs>
          <div className="flex flex-1 items-center justify-center">
            <div className="text-fg-muted relative flex items-center gap-2 py-2 pl-4 pr-2 font-mono text-xs">
              <motion.div
                layout
                initial={false}
                transition={{ duration: 0.5 }}
                className="bg-bg-neutral absolute inset-0 z-[-1] rounded-md border"
              />
              <pre>
                <code className="max-sm:flex max-sm:max-w-[60vw]">
                  <span className="truncate">
                    <motion.span layout transition={{ duration: 0.5 }}>
                      <span className="text-[#F69D50]">npx</span> shadcn@latest
                      init https://dotui.org/r/
                    </motion.span>
                    <AnimatePresence mode="popLayout">
                      <motion.span
                        key={currentStyle.name}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-[#F69D50]"
                      >
                        {currentStyleName}
                      </motion.span>
                    </AnimatePresence>
                    <motion.span layout transition={{ duration: 0.5 }}>
                      /base.json
                    </motion.span>
                  </span>
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
                    <CheckIcon className="animate-in fade-in duration-75" />
                  ) : (
                    <CopyIcon className="animate-in fade-in duration-75" />
                  )}
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
        <Skeleton show={!isMounted} className="w-full rounded-md">
          <div className="relative w-full">
            <StyleProvider
              style={currentStyle}
              mode="site"
              className="relative w-full bg-transparent"
            >
              <UNSAFE_PortalProvider getContainer={() => container.current}>
                <div className="bg-bg w-full rounded-md border shadow-md">
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={currentStyleName}
                      variants={variants}
                      initial="hidden"
                      animate="show"
                      exit="hidden"
                    >
                      <ComponentsOverview className="hidden sm:grid" />
                      <MobileComponentsOverview className="sm:hidden" />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </UNSAFE_PortalProvider>
            </StyleProvider>
          </div>
        </Skeleton>
      </div>
    </>
  );
};

const variants: Variants = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 19,
      mass: 1.2,
    },
  },
};
