"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { LayoutGroup, motion } from "motion/react";
import { Switch as AriaSwitch } from "react-aria-components";
import { tv } from "tailwind-variants";
import type { Transition } from "motion/react";
import type { VariantProps } from "tailwind-variants";

import { focusRingGroup } from "@dotui/ui/lib/focus-styles";
import { cn } from "@dotui/ui/lib/utils";

const TRANSITION: Transition = { type: "spring", bounce: 0.05, duration: 0.2 };

const themeModeSwitchStyles = tv({
  slots: {
    root: "group",
    container: [
      focusRingGroup(),
      "border-border-field bg-bg text-fg-muted group-selected:justify-end flex cursor-pointer items-center justify-start border p-0.5 [&_svg]:size-4",
    ],
    iconContainer: "relative flex size-full items-center justify-center",
    cursor: "bg-bg-inverse/10 absolute inset-0 block",
  },
  variants: {
    size: {
      sm: {
        container: "h-8 [&_svg]:size-3",
        iconContainer: "px-2",
      },
      md: {
        container: "h-9 [&_svg]:size-4",
        iconContainer: "px-3",
      },
      lg: {
        container: "h-10 [&_svg]:size-5",
        iconContainer: "px-4",
      },
    },
    shape: {
      rounded: {
        container: "rounded-full",
        cursor: "rounded-full",
      },
      square: {
        container: "rounded-md",
        cursor: "rounded-sm",
      },
    },
  },
  defaultVariants: {
    size: "md",
    shape: "rounded",
  },
});

interface ThemeModeSwitchProps
  extends React.ComponentProps<typeof AriaSwitch>,
    VariantProps<typeof themeModeSwitchStyles> {}

export const ThemeModeSwitch = ({
  className,
  size,
  shape,
  ...props
}: ThemeModeSwitchProps) => {
  const { root, container, iconContainer, cursor } = themeModeSwitchStyles({
    size,
    shape,
  });
  const layoutId = React.useId();

  return (
    <AriaSwitch className={root()} {...props}>
      {({ isSelected }) => (
        <LayoutGroup id={layoutId}>
          <span className={cn(container(), className)}>
            <span className={cn(iconContainer(), "group-selected:text-fg")}>
              <MoonIcon />
              <motion.span layout />
              {!isSelected && (
                <motion.span
                  layoutDependency={false}
                  layoutId="mode-siwtch-cursor"
                  transition={TRANSITION}
                  className={cursor()}
                />
              )}
            </span>
            <span className={cn(iconContainer(), "group-not-selected:text-fg")}>
              <SunIcon />
              {isSelected && (
                <motion.span
                  layoutDependency={false}
                  layoutId="mode-siwtch-cursor"
                  transition={TRANSITION}
                  className={cursor()}
                />
              )}
            </span>
          </span>
        </LayoutGroup>
      )}
    </AriaSwitch>
  );
};
