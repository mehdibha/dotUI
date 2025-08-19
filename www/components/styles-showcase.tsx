"use client";

import React from "react";
import Image from "next/image";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useTheme } from "next-themes";
import { UNSAFE_PortalProvider as PortalProvider } from "react-aria";
import type { Variants } from "motion/react";

import { StyleProvider } from "@dotui/ui";
import { BlocksShowcase } from "@dotui/ui/registry/blocks/showcase/blocks-showcase/components/blocks-showcase";
import { Tab, TabList, Tabs } from "@dotui/ui/registry/components/tabs/motion";
import type { RouterOutputs } from "@dotui/api";

import { useMounted } from "@/hooks/use-mounted";

export const StylesShowcase = ({
  styles,
}: {
  styles: RouterOutputs["style"]["getFeatured"];
}) => {
  const { resolvedTheme } = useTheme();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [currentStyleName, setCurrentStyleName] = React.useState<string>(
    styles[0]!.name,
  );
  const ref = React.useRef(null);
  const isInView = useInView(ref);
  const [touched, setTouched] = React.useState<boolean>(false);
  const [copied, setCopied] = React.useState(false);
  const isMounted = useMounted();

  const handleCopy = () => {
    void navigator.clipboard.writeText(
      `npx shadcn@latest init @dotui/${currentStyleName}/base`,
    );
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const currentStyle = React.useMemo(() => {
    return styles.find((style) => style.name === currentStyleName)!;
  }, [currentStyleName, styles]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (touched || !isInView) return;
      const currentIndex = styles.findIndex(
        (style) => style.name === currentStyleName,
      );
      const nextIndex = (currentIndex + 1) % styles.length;
      const nextStyle = styles[nextIndex];
      if (nextStyle) {
        setCurrentStyleName(nextStyle.name);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentStyleName, touched, isInView, styles]);

  return (
    <>
      <StyleProvider
        ref={containerRef}
        unstyled
        style={isMounted ? currentStyle : undefined}
        mode={resolvedTheme as "light" | "dark" | undefined}
      />
      <div className="flex flex-col gap-6">
        <div className="flex flex-col-reverse items-center gap-4 min-[1450px]:flex-row min-[1450px]:items-end">
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
              {styles.map((style) => {
                return (
                  <Tab
                    key={style.name}
                    id={style.name}
                    className="flex h-8 items-center gap-2 rounded-full px-4 text-sm"
                  >
                    {style.name}
                  </Tab>
                );
              })}
            </TabList>
          </Tabs>
        </div>
        <StyleProvider
          style={isMounted ? currentStyle : undefined}
          mode={resolvedTheme as "light" | "dark" | undefined}
          className="bg-bg relative min-h-96 w-full overflow-hidden rounded-xl border shadow-md"
        >
          <PortalProvider getContainer={() => containerRef.current}>
            <AnimatePresence mode="popLayout">
              <motion.div
                key={currentStyleName}
                variants={variants}
                initial="hidden"
                animate="show"
                exit="hidden"
                className="max-lg:hidden"
              >
                <BlocksShowcase />
              </motion.div>
            </AnimatePresence>
          </PortalProvider>
          <Image
            src={`/images/showcase/${currentStyleName}-light.png`}
            alt={currentStyleName}
            width={1200}
            height={900}
            className="lg:hidden! block max-sm:hidden dark:hidden"
          />
          <Image
            src={`/images/showcase/${currentStyleName}-dark.png`}
            alt={currentStyleName}
            width={1200}
            height={900}
            className="lg:hidden! hidden dark:sm:block"
          />
          <Image
            src={`/images/showcase/${currentStyleName}-light-mobile.png`}
            alt={currentStyleName}
            width={1200}
            height={900}
            className="lg:hidden! block sm:hidden dark:hidden"
          />
          <Image
            src={`/images/showcase/${currentStyleName}-dark-mobile.png`}
            alt={currentStyleName}
            width={1200}
            height={900}
            className="lg:hidden! hidden max-sm:dark:block"
          />
        </StyleProvider>
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
