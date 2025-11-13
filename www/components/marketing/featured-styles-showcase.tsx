"use client";

import React from "react";
import { motion, useInView } from "motion/react";
import { useTheme } from "next-themes";
import { UNSAFE_PortalProvider as PortalProvider } from "react-aria";

import { StyleProvider } from "@dotui/registry";
import { Cards } from "@dotui/registry/blocks/showcase/cards/components/cards";
import { cn } from "@dotui/registry/lib/utils";
import { Tab, TabList, TabPanel, Tabs } from "@dotui/registry/ui/tabs";
import type { RouterOutputs } from "@dotui/api";

import { useDebounce } from "@/hooks/use-debounce";

const MotionTabPanel = motion.create(TabPanel);

const cardVariants = {
  initial: (position: number) => ({
    x: position * ((position - 10) / 5) * 12,
    y: position * 10,
    scale: 1 - 0.05 - position * 0.1,
  }),
  animate: (position: number) => ({
    x: position * ((position - 10) / 5) * 12,
    y: position * 10,
    scale: 1 - position * 0.1,
    opacity: 1,

    filter: "blur(0px)",
  }),
  exit: {
    opacity: 0,
    filter: "blur(8px)",
  },
};

export const FeaturedStylesShowcase = ({
  styles,
  visibleCards = 5,
}: {
  styles: RouterOutputs["style"]["getPublicStyles"];
  visibleCards?: number;
}) => {
  const { resolvedTheme } = useTheme();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const delayedIndex = useDebounce(currentIndex, 700);
  const [touched, setTouched] = React.useState(false);
  const hasAnimated = React.useRef(false);
  const viewRef = React.useRef(null);
  const inView = useInView(viewRef, {
    initial: true,
    once: false,
    amount: "all",
  });

  const currentStyle = React.useMemo(() => {
    return styles[currentIndex % styles.length];
  }, [currentIndex, styles]);

  // Mark as animated after initial render
  React.useEffect(() => {
    if (!hasAnimated.current) {
      const timer = setTimeout(
        () => {
          hasAnimated.current = true;
        },
        600 + visibleCards * 50,
      ); // duration + max stagger delay
      return () => clearTimeout(timer);
    }
  }, [visibleCards]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (touched || !inView) return;
      setCurrentIndex((prev) => (prev + 1) % styles.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [styles.length, touched, inView]);

  return (
    <>
      <StyleProvider
        ref={containerRef}
        unstyled
        style={currentStyle}
        mode={resolvedTheme as "light" | "dark" | undefined}
      />
      <div className="flex justify-center gap-4">
        <Tabs
          ref={viewRef}
          selectedKey={styles[currentIndex % styles.length]?.name}
          onSelectionChange={(key) => {
            const clickedIndex = styles.findIndex((s) => s.name === key);
            if (clickedIndex === -1) return;
            setCurrentIndex(clickedIndex);
            setTouched(true);
          }}
          className="gap-4"
        >
          <TabList className="flex-wrap border-b-0 gap-1">
            {styles.map((style) => {
              return (
                <Tab
                  key={style.name}
                  id={style.name}
                  className="py-1 px-3 *:data-tab-indicator:h-full *:data-tab-indicator:-z-1 *:data-tab-indicator:rounded-xl *:data-tab-indicator:bg-selected"
                >
                  {style.name}
                </Tab>
              );
            })}
          </TabList>
          <div className="relative">
            {[...styles, ...styles].map((style, index) => {
              const position = index - currentIndex;
              const delayedPosition = index - delayedIndex;
              const isVisible = position >= 0 && position < visibleCards;
              const isFront = position === 0;

              return (
                <MotionTabPanel
                  key={`${style.name}-${index}`}
                  id={style.name}
                  className={cn(
                    isFront ? "relative" : "absolute inset-0",
                    "w-full",
                  )}
                  variants={cardVariants}
                  initial="initial"
                  animate={isVisible ? "animate" : "exit"}
                  custom={position}
                  transition={{
                    duration: 0.6,
                    delay: hasAnimated.current ? 0 : position * 0.05,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  style={{
                    transformOrigin: "top left",
                    pointerEvents: isFront ? "auto" : "none",
                    zIndex: visibleCards - position,
                  }}
                  shouldForceMount
                >
                  <StyleProvider
                    style={style}
                    mode={resolvedTheme as "light" | "dark" | undefined}
                    className="h-full rounded-xl bg-bg"
                  >
                    <PortalProvider getContainer={() => containerRef.current}>
                      {position > 0 && (
                        <div
                          className="dark:hidden absolute inset-0 rounded-[inherit] bg-black transition-opacity duration-600"
                          style={{
                            opacity: Math.min(position * 0.15, 0.6),
                          }}
                        />
                      )}
                      <div className="rounded-[inherit] border h-full">
                        {(position === 0 || delayedPosition === 0) && <Cards />}
                      </div>
                    </PortalProvider>
                  </StyleProvider>
                </MotionTabPanel>
              );
            })}
          </div>
        </Tabs>
        {/* <div className="relative pb-24">
            <Image
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
            />
          </div>
        </div> */}
      </div>
    </>
  );
};
