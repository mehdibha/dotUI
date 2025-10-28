"use client";

import {
  ProgressBar as AriaProgressBar,
  composeRenderProps,
} from "react-aria-components";
import type { ProgressBarProps } from "react-aria-components";

import { cn } from "@dotui/registry-v2/lib/utils";

interface LoaderProps extends ProgressBarProps {
  size?: number;
  stroke?: number;
  speed?: number;
  strokeLength?: number;
}

function Loader({
  className,
  style,
  size = 20,
  stroke = 2,
  strokeLength = 0.25,
  speed = 0.8,
  ...props
}: LoaderProps) {
  const centerPoint = size / 2;
  const radius = Math.max(0, size / 2 - stroke / 2);

  return (
    <AriaProgressBar
      data-slot="loader"
      style={composeRenderProps(style, (style) => ({
        ...style,
        "--loader-size": `${size}px`,
        "--loader-speed": `${speed}s`,
        "--loader-stroke": "2",
        "--loader-dash": String(parseFloat(`${strokeLength}`) * 100),
        "--loader-gap": String(100 - parseFloat(`${strokeLength}`) * 100),
      }))}
      className={cn(
        "inline-flex size-(--loader-size) shrink-0 items-center justify-center",
        className,
      )}
      aria-label="loading..."
      {...props}
      isIndeterminate
    >
      <svg
        className="size-(--loader-size) origin-center animate-[spin_var(--loader-speed)_linear_infinite] overflow-visible will-change-transform"
        viewBox={`${centerPoint} ${centerPoint} ${size} ${size}`}
        height={size}
        width={size}
      >
        <circle
          className="stroke-[color-mix(in_oklab,currentColor_20%,transparent)] transition-[stroke] duration-500 ease-out"
          cx={size}
          cy={size}
          r={radius}
          pathLength="100"
          strokeWidth={`${stroke}px`}
          fill="none"
        />
        <circle
          className="fill-none stroke-current transition-[stroke] duration-500 ease-out [stroke-dasharray:var(--loader-dash),var(--loader-gap)] [stroke-dashoffset:0] [stroke-linecap:round]"
          cx={size}
          cy={size}
          r={radius}
          pathLength="100"
          strokeWidth={`${stroke}px`}
          fill="none"
        />
      </svg>
    </AriaProgressBar>
  );
}

export type { LoaderProps };
export { Loader };
