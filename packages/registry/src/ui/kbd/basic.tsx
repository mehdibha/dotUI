"use client";

import { Keyboard as AriaKeyboard } from "react-aria-components";
import { tv } from "tailwind-variants";

const KbdStyles = tv({
  slots: {
    group: "inline-flex items-center gap-1",
    kbd: [
      "pointer-events-none inline-flex h-5 w-fit min-w-5 select-none items-center justify-center gap-1 rounded-sm bg-muted px-1 font-medium font-sans text-fg-muted text-xs",
      "[&_svg:not([class*='size-'])]:size-3",
    ],
  },
});

const { group, kbd } = KbdStyles();

/* -----------------------------------------------------------------------------------------------*/

interface KbdGroupProps extends React.HTMLAttributes<HTMLElement> {}

const KbdGroup = ({ className, ...props }: KbdGroupProps) => {
  return <kbd className={group({ className })} {...props} />;
};

/* -----------------------------------------------------------------------------------------------*/

interface KbdProps extends React.ComponentProps<typeof AriaKeyboard> {}

const Kbd = ({ className, ...props }: KbdProps) => {
  return <AriaKeyboard className={kbd({ className })} {...props} />;
};

/* -----------------------------------------------------------------------------------------------*/

export { KbdGroup, Kbd };
export type { KbdProps, KbdGroupProps };
