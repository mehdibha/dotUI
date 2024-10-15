"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Maximize2Icon, SmartphoneIcon } from "lucide-react";
import { Button } from "@/registry/ui/default/core/button";
import * as icons from "@/__icons__";

const MotionButton = motion.create(Button);

const transitionProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

export const Preview = ({ currentSection }: { currentSection: string }) => {
  return (
    <motion.div
      layout
      className="overflow-hidden rounded-lg border"
      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
    >
      <div className="bg-bg-muted flex h-10 items-center justify-between pl-4 pr-2">
        <p className="text-fg-muted text-sm">Preview</p>
        <div className="flex items-center gap-2">
          <Button variant="quiet" shape="square" size="sm">
            <Maximize2Icon />
          </Button>
          <Button variant="quiet" shape="square" size="sm">
            <SmartphoneIcon />
          </Button>
        </div>
      </div>
      <div className="p-6">
        <AnimatePresence mode="popLayout">
          {currentSection === "colors" && (
            <motion.div
              key={0}
              className="grid grid-cols-2 gap-2"
              {...transitionProps}
            >
              <motion.div layout>
                <p>Neutral</p>
                <Button>Button 1 </Button>
              </motion.div>

              {/* <Button layout>Button 1</Button>
            <MotionButton layout>Button 2</MotionButton>
            <MotionButton layout>Button 3</MotionButton>
            <MotionButton layout>Button 5</MotionButton> */}
            </motion.div>
          )}
          {currentSection === "typography" && (
            <motion.div key={1} {...transitionProps}>
              <motion.p layout className="text-4xl font-bold">
                Heading
              </motion.p>
              <motion.p layout className="mt-2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </motion.p>
            </motion.div>
          )}
          {currentSection === "icons" && (
            <motion.div
              key={2}
              className="grid grid-cols-8 gap-4"
              {...transitionProps}
            >
              {Object.entries(icons).map(([key, Icon]) => {
                const MotionIcon = motion.create(Icon);
                return (
                  <MotionIcon key={`icon-${key}`} layout className="size-5" />
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
