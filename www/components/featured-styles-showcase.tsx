"use client";

import React from "react";
import Image from "next/image";
import { motion, useInView } from "motion/react";
import { useTheme } from "next-themes";
import { UNSAFE_PortalProvider as PortalProvider } from "react-aria";

import { StyleProvider } from "@dotui/registry";
import { Cards } from "@dotui/registry/blocks/showcase/cards/components/cards";
import { Tab, TabList, Tabs } from "@dotui/registry/ui/tabs/motion";
import type { RouterOutputs } from "@dotui/api";

import { useMounted } from "@/hooks/use-mounted";

export const FeaturedStylesShowcase = ({
  styles,
}: {
  styles: RouterOutputs["style"]["getPublicStyles"];
}) => {
  const { resolvedTheme } = useTheme();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [styleQueue, setStyleQueue] = React.useState(styles);
  const ref = React.useRef(null);
  const isInView = useInView(ref);
  const [touched, setTouched] = React.useState<boolean>(false);
  const isMounted = useMounted();

  const currentStyle = React.useMemo(() => {
    return styleQueue[0]!;
  }, [styleQueue]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (touched || !isInView) return;
      setStyleQueue((prev) => [...prev.slice(1), prev[0]!]);
    }, 4000);

    return () => clearInterval(interval);
  }, [touched, isInView]);

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
            selectedKey={styleQueue[0]?.name}
            onSelectionChange={(key) => {
              const clickedStyle = styles.find((s) => s.name === key);
              if (!clickedStyle) return;
              const remaining = styleQueue.filter((s) => s.name !== key);
              setStyleQueue([clickedStyle, ...remaining]);
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
        <div className="relative pr-24 pb-24">
          <div className="relative w-full rounded-xl shadow-md">
            <PortalProvider getContainer={() => containerRef.current}>
              {styleQueue.map((style, index) => (
                <motion.div
                  key={style.name}
                  initial={{ 
                    x: index * 24,
                    y: index * 24,
                   }}
                  animate={{
                    x: index * 24,
                    y: index * 24,
                    zIndex: styleQueue.length - index,
                  }}
                  exit={{ scale: 0.95 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 25,
                  }}
                  className={
                    index === 0
                      ? "relative max-lg:hidden"
                      : "absolute inset-0 max-lg:hidden"
                  }
                >
                  <StyleProvider
                    style={isMounted ? style : undefined}
                    mode={resolvedTheme as "light" | "dark" | undefined}
                    className="h-full w-full overflow-hidden rounded-xl border bg-bg shadow-md"
                  >
                    <Cards />
                  </StyleProvider>
                </motion.div>
              ))}
            </PortalProvider>
            {/* <Image
              src={`/images/showcase/${styleQueue[0]!.name}-light.png`}
              alt={styleQueue[0]!.name}
              width={1200}
              height={900}
              className="block max-sm:hidden lg:hidden! dark:hidden"
            />
            <Image
              src={`/images/showcase/${styleQueue[0]!.name}-dark.png`}
              alt={styleQueue[0]!.name}
              width={1200}
              height={900}
              className="hidden lg:hidden! dark:sm:block"
            />
            <Image
              src={`/images/showcase/${styleQueue[0]!.name}-light-mobile.png`}
              alt={styleQueue[0]!.name}
              width={1200}
              height={900}
              className="block sm:hidden lg:hidden! dark:hidden"
            />
            <Image
              src={`/images/showcase/${styleQueue[0]!.name}-dark-mobile.png`}
              alt={styleQueue[0]!.name}
              width={1200}
              height={900}
              className="hidden lg:hidden! max-sm:dark:block"
            /> */}
          </div>
        </div>
      </div>
    </>
  );
};
