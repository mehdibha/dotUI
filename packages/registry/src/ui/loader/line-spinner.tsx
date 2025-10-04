"use client";

import {
  ProgressBar as AriaProgressBar,
  composeRenderProps,
} from "react-aria-components";
import type { ProgressBarProps as AriaProgressBarProps } from "react-aria-components";

import { cn } from "@dotui/registry/lib/utils";

interface LoaderProps extends Omit<AriaProgressBarProps, "isIndeterminate"> {
  size?: number;
  speed?: number;
  stroke?: number;
}

function Loader({
  className,
  style,
  size = 20,
  speed = 1,
  stroke = 3,
  ...props
}: LoaderProps) {
  return (
    <AriaProgressBar
      data-slot="loader"
      aria-label="loading..."
      {...props}
      className={cn(
        "inline-flex size-[var(--loader-size)] shrink-0 items-center justify-center",
        className,
      )}
      isIndeterminate
      style={composeRenderProps(style, (style) => ({
        ...style,
        "--loader-size": `${size}px`,
        "--loader-speed": `${speed}s`,
        "--loader-stroke": `${stroke}px`,
      }))}
    >
      <div className="relative flex size-[var(--loader-size)] items-center justify-start">
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="absolute top-[-3.9%] left-[-10%] h-[8%] w-[24%] animate-line-spinner rounded-sm bg-current"
            style={{
              transform: `rotate(${i * 30}deg) translate(146%)`,
              animationDelay: `-${(12 - i) * 0.1}s`,
            }}
          ></span>
        ))}
      </div>
    </AriaProgressBar>
  );
}

export type { LoaderProps };
export { Loader };
