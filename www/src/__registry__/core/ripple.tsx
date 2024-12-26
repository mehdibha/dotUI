"use client";

import type { FC } from "react";
import type { HTMLMotionProps } from "framer-motion";
import { AnimatePresence, m } from "framer-motion";
import type { RippleType } from "@/registry/hooks/use-ripple";

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
    <>
      {ripples.map((ripple) => {
        const duration = clamp(
          0.01 * ripple.size,
          0.2,
          ripple.size > 100 ? 0.75 : 0.5
        );

        return (
          <AnimatePresence key={ripple.key} mode="popLayout">
            <m.span
              initial={{ opacity: 0.1, scale: 0.5 }}
              animate={{ opacity: 0.4, scale: 2 }}
              // className="nextui-ripple"
              // exit={{ opacity: 0 }}
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
              // transition={{ duration }}
              onAnimationComplete={() => {
                onClear(ripple.key);
              }}
              {...motionProps}
            />
          </AnimatePresence>
        );
      })}
    </>
  );
};
Ripple.displayName = "NextUI.Ripple";
