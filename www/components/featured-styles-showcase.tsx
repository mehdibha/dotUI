"use client";

import React from "react";
import { useTheme } from "next-themes";

import { StyleProvider } from "@dotui/registry";
import { cn } from "@dotui/registry-v2/lib/utils";
import { Cards } from "@dotui/registry/blocks/showcase/cards/components/cards";
import { Tab, TabList, TabPanel, Tabs } from "@dotui/registry/ui/tabs/motion";
import type { RouterOutputs } from "@dotui/api";

import { useMounted } from "@/hooks/use-mounted";

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
  const [touched, setTouched] = React.useState(false);

  const ref = React.useRef(null);
  const isMounted = useMounted();

  const currentStyle = React.useMemo(() => {
    return styles[currentIndex % styles.length];
  }, [currentIndex, styles]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (touched) return;
      setCurrentIndex((prev) => (prev + 1) % styles.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [styles.length, touched]);

  return (
    <>
      <StyleProvider
        ref={containerRef}
        unstyled
        style={isMounted ? currentStyle : undefined}
        mode={resolvedTheme as "light" | "dark" | undefined}
      />
      <div className="flex flex-col gap-30">
        <div className="flex justify-center gap-4">
          <Tabs
            ref={ref}
            variant="solid"
            selectedKey={styles[currentIndex % styles.length]?.name}
            onSelectionChange={(key) => {
              const clickedIndex = styles.findIndex((s) => s.name === key);
              if (clickedIndex === -1) return;
              setCurrentIndex(clickedIndex);
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
            <div className="relative mt-30">
              {[...styles, ...styles].map((style, index) => {
                // Calculate position relative to current view
                const position = index - currentIndex;
                const isVisible = position >= 0 && position < visibleCards;
                const isFront = position === 0;

                return (
                  <TabPanel
                    key={`${style.name}-${index}`}
                    id={style.name}
                    className={() =>
                      cn(
                        isFront ? "relative" : "absolute inset-0",
                        "min-h-screen w-full transition-[opacity,transform] duration-400 will-change-[transform,opacity]",
                      )
                    }
                    style={{
                      transform: `translateY(${position * ((position - 10) / 5) * 20}px) scale(${1 - position * 0.1})`,
                      transformOrigin: "top center",
                      opacity: isVisible ? 1 : 0,
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
                      {position > 0 && (
                        <div
                          className="absolute inset-0 rounded-[inherit] bg-black transition-opacity duration-600"
                          style={{
                            opacity: Math.min(position * 0.15, 0.6),
                          }}
                        />
                      )}
                      <div className="rounded-[inherit] border">
                        {isMounted && <Cards />}
                      </div>
                    </StyleProvider>
                  </TabPanel>
                );
              })}
            </div>
          </Tabs>
        </div>
        {/* <div className="relative pb-24">
          <div className="relative w-full rounded-xl shadow-md">
            <PortalProvider getContainer={() => containerRef.current}>
              {visibleStylesData
                // .filter((data) => data.style.name === "new-york")
                .reverse()
                .map(({ style, position }) => (
                  <motion.div
                    key={`${style.name}-${currentIndex + position}`}
                    initial={{
                      x: position * 12 - 12 * 5,
                      y: position * 12 - 12 * 5,
                      opacity: position === visibleCards - 1 ? 0 : 1,
                      scale: position === visibleCards - 1 ? 0.95 : 1,
                    }}
                    animate={{
                      x: position * 12 - 12 * 5,
                      y: position * 12 - 12 * 5,
                      opacity: position === visibleCards - 1 ? 0 : 1,
                      scale: position === visibleCards - 1 ? 0.95 : 1,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 25,
                    }}
                    className={
                      style.name === "new-york"
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
