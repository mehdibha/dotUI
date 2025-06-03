import type { Transition } from "motion/react";
import React from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useMeasure } from "react-use";

const TRANSITION: Transition = {
  type: "spring",
  bounce: 0,
  duration: 0.35,
};

export function Collapsible({
  show,
  children,
  className,
  ...props
}: {
  show: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const [ref, { height }] = useMeasure<HTMLDivElement>();
  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: height }}
            exit={{ height: 0 }}
            transition={TRANSITION}
            className={cn("overflow-hidden", className)}
            {...props}
          >
            <div ref={ref}>{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
