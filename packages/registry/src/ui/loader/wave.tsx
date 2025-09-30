"use client";

import { motion } from "motion/react";
import { ProgressBar as AriaProgressBar } from "react-aria-components";
import type { ProgressBarProps } from "react-aria-components";

import { cn } from "@dotui/registry/lib/utils";

interface LoaderProps extends ProgressBarProps {
  size?: number;
}

function Loader({ size = 20, className, ...props }: LoaderProps) {
  return (
    <AriaProgressBar
      className={cn("flex items-center justify-between", className)}
      aria-label="loading..."
      {...props}
      isIndeterminate
      style={
        {
          "--size": `${size}px`,
          width: `var(--size)`,
          height: `calc(var(--size) * 0.9)`,
        } as React.CSSProperties
      }
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <motion.div
          key={index}
          className="h-full w-[2px] rounded-full bg-current"
          animate={{
            scaleY: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.1,
          }}
        />
      ))}
    </AriaProgressBar>
  );
}

export type { LoaderProps };
export { Loader };
