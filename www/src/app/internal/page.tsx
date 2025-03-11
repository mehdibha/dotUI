"use client";

import React from "react";
import { AnimatePresence, motion } from "motion/react";

export default function Demo() {
  const [show, setShow] = React.useState(false);
  const [isAnimating, setAnimating] = React.useState(false);

  return (
    <div>
      <div className="size-30">
        <button
          onClick={() => {
            setShow(!show);
          }}
        >
          toggle
        </button>
        <AnimatePresence>
          {show && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 40 }}
              exit={{ height: 0 }}
              transition={{ duration: 1.5 }}
              onAnimationStart={() => {
                setAnimating(true);
              }}
              onAnimationComplete={() => {
                setAnimating(false);
              }}
              style={{ overflow: show ? "visible" : "hidden" }}
            >
              <div className="size-10 bg-red-500" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <p>{isAnimating ? "animating" : "not animating"}</p>
    </div>
  );
}
