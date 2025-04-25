"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { motion, Transition } from "motion/react";
import { Switch as AriaSwitch } from "react-aria-components";
import { cn } from "@/lib/utils";
import { focusRingGroup } from "@/lib/focus-styles";

const TRANSITION: Transition = { type: "spring", bounce: 0.05, duration: 0.2 };

interface ModeSwitchProps extends React.ComponentProps<typeof AriaSwitch> {}
export const ModeSwitch = ({ className, ...props }: ModeSwitchProps) => {
  return (
    <AriaSwitch className="group" {...props}>
      {({ isSelected }) => (
        <>
          <span
            className={cn(
              focusRingGroup(),
              "group-selected:justify-end text-fg-muted border-field flex cursor-pointer items-center justify-start rounded-full border p-0.5 [&_svg]:size-4",
              className
            )}
          >
            <span className="group-selected:text-fg relative flex items-center justify-center px-3 py-2">
              <MoonIcon />
              <motion.span layout />
              {isSelected && (
                <motion.span
                  layoutDependency={false}
                  layoutId="mode-siwtch-cursor"
                  transition={TRANSITION}
                  className="bg-bg-inverse/10 absolute inset-0 rounded-full"
                />
              )}
            </span>
            <span className="group-not-selected:text-fg relative flex items-center justify-center px-3 py-2">
              <SunIcon />
              {!isSelected && (
                <motion.span
                  layoutDependency={false}
                  layoutId="mode-siwtch-cursor"
                  transition={TRANSITION}
                  className="bg-bg-inverse/10 absolute inset-0 rounded-full"
                />
              )}
            </span>
          </span>
        </>
      )}
    </AriaSwitch>
  );
};
