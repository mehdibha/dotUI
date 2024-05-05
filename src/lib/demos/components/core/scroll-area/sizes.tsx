import * as React from "react";
import { ScrollArea } from "@/lib/components/core/default/scroll-area";
import { cn } from "@/lib/utils/classes";

const sizes = ["sm", "md", "lg"] as const;

export default function ScrollAreaDemo() {
  return (
    <div className="flex flex-col gap-4">
      {sizes.map((size) => (
        <div key={size}>
          <p className="text-md font-bold tracking-tight">{size}</p>
          <ScrollArea
            className={cn("h-5 w-[300px]", {
              "h-3": size === "sm",
              "h-4": size === "md",
              "h-5": size === "lg",
            })}
            size={size}
            orientation="horizontal"
            type="always"
          >
            <div className="w-[800px]" />
          </ScrollArea>
        </div>
      ))}
    </div>
  );
}
