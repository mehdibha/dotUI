"use client";

import React from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { cn } from "@/utils/classes";
import { IconWrapper } from "./icon-wrapper";

interface IconsListProps extends React.HTMLAttributes<HTMLDivElement> {
  icons: { name: string; icon: string, code:string }[];
}

export const IconsList = (props: IconsListProps) => {
  const { className, icons } = props;

  const listRef = React.useRef<HTMLDivElement | null>(null);
  const [itemsPerRow, setItemsPerRow] = React.useState<number>(calculateItemsPerRow());

  function calculateItemsPerRow() {
    if (typeof window === "undefined") return 16
    const screenWidth = window.innerWidth;
    // Calculate items per row based on screen width
    if (screenWidth >= 1024) {
      return 16; // Large screens
    } else if (screenWidth >= 768) {
      return 12; // Medium screens
    } else if (screenWidth >= 640) {
      return 10; // Small screens
    } else if (screenWidth >= 480) {
      return 8; // Small screens
    } else {
      return 6; // Small screens
    }
  }

  React.useEffect(() => {
    function handleResize() {
      // Update items per row when window is resized
      setItemsPerRow(calculateItemsPerRow());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const count = Math.ceil(icons.length / itemsPerRow);
  const virtualizer = useWindowVirtualizer({
    count,
    estimateSize: () => 66,
    overscan: 5,
    scrollMargin: listRef.current?.offsetTop ?? 0,
  });

  return (
    <div ref={listRef} className={className}>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((item) => {
          return (
            <div
              key={item.key}
              // className={item.index % 2 ? "ListItemOdd" : "ListItemEven"}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${item.size}px`,
                transform: `translateY(${
                  item.start - virtualizer.options.scrollMargin
                }px)`,
              }}
            >
              <div
                className={cn("grid grid-cols-16 gap-2", {
                  "grid-cols-12": itemsPerRow === 12,
                  "grid-cols-10": itemsPerRow === 10,
                  "grid-cols-8": itemsPerRow === 8,
                  "grid-cols-6": itemsPerRow === 6,
                })}
              >
                {icons
                  .slice(item.index * itemsPerRow, (item.index + 1) * itemsPerRow)
                  .map((icon, index) => {
                    return (
                      <IconWrapper key={index} name={icon.name} code={icon.code}>
                        {/* TODO: Dom purify */}
                        <div
                          className="group flex h-14 cursor-pointer items-center justify-center rounded-md border border-border/20 bg-card/70 duration-150 hover:border-border hover:bg-card"
                          dangerouslySetInnerHTML={{ __html: icon.icon }}
                        />
                      </IconWrapper>
                    );
                  })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
