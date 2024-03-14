"use client";

import React from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { IconWrapper } from "./icon-wrapper";

interface IconsListProps {
  icons: { key: string; value: string }[];
}

export const IconsList = (props: IconsListProps) => {
  const { icons } = props;

  const listRef = React.useRef<HTMLDivElement | null>(null);

  const itemsPerRow = 16;

  const count = Math.ceil(icons.length / itemsPerRow);

  const virtualizer = useWindowVirtualizer({
    count,
    estimateSize: () => 72,
    overscan: 5,
    scrollMargin: listRef.current?.offsetTop ?? 0,
  });

  return (
    <div ref={listRef} className="List">
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
              <div className="grid grid-cols-16 gap-4 py-4">
                {icons
                  .slice(item.index * itemsPerRow, (item.index + 1) * itemsPerRow)
                  .map((icon, index) => {
                    return (
                      <IconWrapper key={index} name={icon.key} code="">
                        <div
                          className="group flex h-14 cursor-pointer items-center justify-center rounded-md border border-border/20 bg-card/70 duration-150 hover:border-border hover:bg-card"
                          dangerouslySetInnerHTML={{ __html: icon.value }}
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
