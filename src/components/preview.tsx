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
      <ThemeWrapper fallback={<Skeleton className="h-[200px]" />}>
        <ScrollArea
          viewportProps={{
            className: cn("bg-bg text-fg", {
              "max-h-[800px]": aspect === "default",
            }),
          }}
        >
          <div className="flex min-h-[200px] items-center justify-center px-4 py-16">
            {children}
          </div>
        </ScrollArea>
      </ThemeWrapper>
    </div>
  );
};
