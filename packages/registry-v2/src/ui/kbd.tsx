"use client";

import { Keyboard } from "react-aria-components";
import { tv } from "tailwind-variants";

const newKbdStyles = tv({
  slots: {
    group: "inline-flex items-center gap-1",
    kbd: [
      "pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-sm bg-muted px-1 font-sans text-xs font-medium text-fg-muted select-none",
      "[&_svg:not([class*='size-'])]:size-3",
    ],
  },
});

const { group, kbd } = newKbdStyles();

/* -----------------------------------------------------------------------------------------------*/

interface KbdGroupProps extends React.HTMLAttributes<HTMLElement> {}
const KbdGroup = ({ className, ...props }: KbdGroupProps) => {
  return <kbd className={group({ className })} {...props} />;
};

/* -----------------------------------------------------------------------------------------------*/

type KbdProps = React.HTMLAttributes<HTMLElement>;
const Kbd = ({ className, ...props }: KbdProps) => {
  return <Keyboard className={kbd({ className })} {...props} />;
};

/* -----------------------------------------------------------------------------------------------*/

const CompoundKbd = Object.assign(Kbd, {
  Group: KbdGroup,
});
export { CompoundKbd as Kbd, KbdGroup };
export type { KbdProps };
