"use client";

import type { FC } from "react";
import type { HTMLMotionProps } from "motion/react";
import { AnimatePresence, motion } from "motion/react";
import type { RippleType } from "@/modules/registry/hooks/use-ripple";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export interface RippleProps extends React.HTMLAttributes<"span"> {
  ripples: RippleType[];
  color?: string;
  motionProps?: HTMLMotionProps<"span">;
  style?: React.CSSProperties;
  onClear: (key: React.Key) => void;
}

export const Ripple: FC<RippleProps> = (props) => {
  const {
    ripples = [],
    motionProps,
    color = "currentColor",
    style,
    onClear,
  } = props;

  return (
    <AnimatePresence mode="popLayout">
      {ripples.map((ripple) => {
        const duration = clamp(
          0.01 * ripple.size,
          0.2,
          ripple.size > 100 ? 0.75 : 0.5
        );

        return (
          <motion.span
            key={ripple.key}
            initial={{ scale: 0, opacity: 0.35 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            style={{
              position: "absolute",
              backgroundColor: color,
              borderRadius: "100%",
              transformOrigin: "center",
              pointerEvents: "none",
              overflow: "hidden",
              inset: 0,
              zIndex: 0,
              top: ripple.y,
              left: ripple.x,
              width: `${ripple.size}px`,
              height: `${ripple.size}px`,
              ...style,
            }}
            transition={{ duration }}
            onAnimationComplete={() => {
              onClear(ripple.key);
            }}
            {...motionProps}
          />
        );
      })}
    </AnimatePresence>
  );
};
Ripple.displayName = "NextUI.Ripple";
