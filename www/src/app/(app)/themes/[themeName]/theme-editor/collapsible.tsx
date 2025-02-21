import { AnimatePresence, motion, type Transition } from "motion/react";
import { useMeasure } from "react-use";
import { cn } from "@/lib/utils";

const TRANSITION: Transition = {
  type: "spring",
  bounce: 0,
  duration: 0.25,
};

export function Collapsible({
  show,
  children,
  className,
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
            animate={{ height: height, overflow: "visible" }}
            exit={{ height: 0 }}
            transition={TRANSITION}
            className={cn("overflow-hidden", className)}
          >
            <div ref={ref}>{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
