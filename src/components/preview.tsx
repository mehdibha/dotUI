"use client";

import { ThemeWrapper } from "@/components/theme-wrapper";
import { ScrollArea } from "@/lib/components/core/default/scroll-area";
import { Skeleton } from "@/lib/components/core/default/skeleton";
import { cn } from "@/lib/utils/classes";
import { CustomizeTheme } from "./customize-theme";

export const Preview = ({
  className,
  children,
  centered,
  aspect,
}: {
  className?: string;
  children: React.ReactNode;
  centered?: boolean;
  aspect: "default" | "page";
}) => {
  return (
    <div className="relative">
      <div className="absolute left-4 top-4 z-50 flex items-center space-x-2">
        <CustomizeTheme />
      </div>
      <ThemeWrapper fallback={<Skeleton className="h-[350px]" />}>
        <ScrollArea
          viewportProps={{
            className: cn("bg-background", {
              "min-h-[350px] max-h-[800px]": aspect === "default",
            }),
          }}
        >
          <div
            className={cn("min-h-[350px] w-full", {
              "flex items-center justify-center px-8 py-8": centered,
            })}
          >
            <div
              className={cn(
                "flex w-full items-center justify-center" && centered,
                className
              )}
            >
              {children}
            </div>
          </div>
        </ScrollArea>
      </ThemeWrapper>
    </div>
  );
};
