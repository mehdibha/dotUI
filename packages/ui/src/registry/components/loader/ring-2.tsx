"use client";

import { ProgressBar as AriaProgressBar } from "react-aria-components";
import type { ProgressBarProps } from "react-aria-components";

import { cn } from "@dotui/ui/lib/utils";

interface LoaderProps extends Omit<ProgressBarProps, "isIndeterminate"> {
  color?: string;
  size?: number;
  stroke?: number;
  speed?: number;
}

function Loader({
  className,
  size = 20,
  stroke = 2,
  speed = 2,
  ...props
}: LoaderProps) {
  const centerPoint = size / 2;
  const radius = Math.max(0, size / 2 - stroke / 2);

  return (
    <AriaProgressBar
      data-slot="loader"
      style={
        {
          "--loader-size": `${size}px`,
          "--loader-speed": `${speed}s`,
        } as React.CSSProperties
      }
      className={cn(
        "inline-flex h-[var(--loader-size)] w-[var(--loader-size)] shrink-0 items-center justify-center",
        className,
      )}
      {...props}
      isIndeterminate
    >
      <svg
        className="size-[var(--loader-size)] origin-center animate-[spin_var(--loader-speed)_linear_infinite] overflow-visible will-change-transform"
        viewBox={`0 0 ${size} ${size}`}
        height={size}
        width={size}
      >
        <circle
          className="stroke-fg-muted opacity-25 transition-[stroke] duration-500 ease-out"
          cx={centerPoint}
          cy={centerPoint}
          r={radius}
          pathLength="100"
          strokeWidth={`${stroke}px`}
          fill="none"
        />
        <circle
          className="stroke-fg-muted animate-loader-ring-stretch fill-none transition-[stroke] duration-500 ease-out will-change-[stroke-dasharray,_stroke-dashoffset] [stroke-dasharray:1_200] [stroke-dashoffset:0] [stroke-linecap:round]"
          cx={centerPoint}
          cy={centerPoint}
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
