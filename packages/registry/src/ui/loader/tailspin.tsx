"use client";

import type React from "react";
import {
  ProgressBar as AriaProgressBar,
  composeRenderProps,
} from "react-aria-components";
import type { ProgressBarProps } from "react-aria-components";

import { cn } from "@dotui/registry/lib/utils";

interface LoaderProps extends ProgressBarProps {
  size?: number;
  speed?: number;
  stroke?: number;
}

function Loader({
  className,
  style,
  size = 20,
  speed = 0.9,
  stroke = 2,
  ...props
}: LoaderProps) {
  return (
    <AriaProgressBar
      data-slot="loader"
      aria-label="loading..."
      className={cn(
        "inline-flex size-[var(--loader-size)] shrink-0 items-center justify-center",
        className,
      )}
      style={composeRenderProps(style, (style) => ({
        ...style,
        "--loader-size": `${size}px`,
        "--loader-speed": `${speed}s`,
        "--loader-stroke": `${stroke}px`,
      }))}
      {...props}
      isIndeterminate
    >
      <div
        style={
          {
            "--mask-size":
              "calc(var(--loader-size) / 2 - var(--loader-stroke))",
          } as React.CSSProperties
        }
        className="relative flex size-[var(--loader-size)] animate-[spin_var(--loader-speed)_linear_infinite] items-center justify-start rounded-full [background-image:conic-gradient(transparent_25%,_var(--color-primary))] [mask:radial-gradient(circle_var(--mask-size),_transparent_99%,_#000_100%)]"
      />
    </AriaProgressBar>
  );
}

export type { LoaderProps };
export { Loader };
