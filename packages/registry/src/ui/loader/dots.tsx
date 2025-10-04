"use client";

import React from "react";
import { ProgressBar as AriaProgressBar } from "react-aria-components";
import type { ProgressBarProps } from "react-aria-components";

import { cn } from "@dotui/registry/lib/utils";

interface LoaderProps extends ProgressBarProps {
  size?: number;
}

function Loader({ size = 20, className, ...props }: LoaderProps) {
  return (
    <AriaProgressBar
      aria-label="loading..."
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
            className="absolute size-[20%] -translate-x-1/2 -translate-y-1/2 animate-dot-spinner rounded-full bg-current"
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
