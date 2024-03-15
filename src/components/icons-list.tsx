"use client";

import React from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { SearchIcon } from "lucide-react";
import { cn } from "@/utils/classes";
import { createIcon } from "@/utils/icon";
import type { IconNode, Library } from "@/types/icons";
import { icons as lucideIcons } from "@/autogenerated/icons/lucide-icons";
import { icons as simpleIcons } from "@/autogenerated/icons/simple-icons";
import { IconWrapper } from "./icon-wrapper";
import { Input } from "./ui/input";

interface IconsListProps extends React.HTMLAttributes<HTMLDivElement> {
  libraries: Library[];
}

export default function IconsList(props: IconsListProps) {
  const { className, libraries } = props;

  const icons: { name: string; icon: IconNode }[] = React.useMemo(() => {
    return [
      ...(libraries.includes("lucide-icons") ? lucideIcons : []),
      ...(libraries.includes("simple-icons") ? simpleIcons : []),
    ].map((icon) => ({
      name: icon.name,
      icon: icon.icon as IconNode,
    }));
  }, [libraries]);

  const listRef = React.useRef<HTMLDivElement | null>(null);
  const [itemsPerRow, setItemsPerRow] = React.useState<number>(calculateItemsPerRow());

  function calculateItemsPerRow() {
    if (typeof window === "undefined") return 16;
    const screenWidth = window.innerWidth;
    // Calculate items per row based on screen width
    if (screenWidth >= 1024) {
      return 16; // lg screens
    } else if (screenWidth >= 768) {
      return 12; // md screens
    } else if (screenWidth >= 640) {
      return 10; // sm screens
    } else if (screenWidth >= 480) {
      return 8; // xs screens
    } else {
      return 6; // xxs screens
    }
  }

  React.useEffect(() => {
    function handleResize() {
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
    <div>
      <div className="relative">
        <Input className="w-full pl-12" placeholder={`Search ${icons.length} icons`} />
        <SearchIcon
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 transform text-muted-foreground"
        />
      </div>
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
                      const Icon = createIcon(icon.name, icon.icon);
                      return (
                        <IconWrapper key={index} name={icon.name} code={""}>
                          <Icon />
                        </IconWrapper>
                      );
                    })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
