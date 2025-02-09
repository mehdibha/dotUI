"use client";

import { ProgressBar as AriaProgressBar } from "react-aria-components";
import type { ProgressBarProps } from "react-aria-components";

interface LoaderProps extends ProgressBarProps {
  size?: number;
}

function Loader({ size = 20, ...props }: LoaderProps) {
  return (
    <AriaProgressBar
      {...props}
      className="size-10"
      isIndeterminate
      style={
        {
          "--size": `${size}px`,
          width: "var(--size)",
          height: "var(--size)",
        } as React.CSSProperties
      }
    >
      <div className="relative left-1/2 top-1/2 h-full w-full">
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="animate-line-spinner absolute left-[-10%] top-[-3.9%] h-[8%] w-[24%] rounded-sm bg-current"
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
