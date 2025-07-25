"use client";

import type { ProgressBarProps } from "react-aria-components";
import React from "react";
import { cn } from "@/registry/lib/utils";
import { ProgressBar as AriaProgressBar } from "react-aria-components";

interface LoaderProps extends ProgressBarProps {
  size?: number;
}

function Loader({ size = 20, className, ...props }: LoaderProps) {
  return (
    <AriaProgressBar
      className={cn("relative items-center justify-center", className)}
      {...props}
      isIndeterminate
      style={
        {
          "--size": `${size}px`,
          width: "var(--size)",
          height: "var(--size)",
        } as React.CSSProperties
      }
    >
      {Array.from({ length: 8 }).map((_, index) => {
        const angle = (index / 8) * (2 * Math.PI);
        const x = Math.cos(angle);
        const y = Math.sin(angle);

        return (
          <div
            key={index}
            className="animate-dot-spinner absolute size-[20%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-current"
            style={{
              animationDelay: `${index * 0.1}s`,
              top: `${50 + y * 40}%`,
              left: `${50 + x * 40}%`,
            }}
          ></div>
        );
      })}
    </AriaProgressBar>
  );
}

export type { LoaderProps };
export { Loader };
