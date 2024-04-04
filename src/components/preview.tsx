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
      <ScrollArea
        viewportProps={{
          className: cn({ "min-h-[350px] max-h-[800px]": aspect === "default" }),
        }}
      >
        <ThemeWrapper fallback={<Skeleton className="h-[350px]" />}>
          <div
            className={cn("min-h-[350px] w-full", {
              "flex items-center justify-center bg-background px-8 py-8": centered,
            })}
          >
            <div className={cn("flex w-full items-center justify-center", className)}>
              {children}
            </div>
          </div>
        </ThemeWrapper>
      </ScrollArea>
    </div>
  );
};
