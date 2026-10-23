"use client";

import type * as React from "react";
import * as KeyboardPrimitives from "react-aria-components/Keyboard";
import { tv } from "tailwind-variants";

const kbdVariants = tv({
  slots: {
    group: "inline-flex items-center gap-1",
    kbd: "pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-xs text-fg-muted select-ui **:[svg]:not-with-[size]:size-3 border px-1 font-sans text-xs font-medium",
  },
});

const { group, kbd } = kbdVariants();

/* -------------------------------------------------------------------------- */

interface KbdGroupProps extends React.HTMLAttributes<HTMLElement> {}

const KbdGroup = ({ className, ...props }: KbdGroupProps) => {
  return <kbd data-kbd-group="" className={group({ className })} {...props} />;
};

/* -------------------------------------------------------------------------- */

interface KbdProps extends React.ComponentProps<
  typeof KeyboardPrimitives.Keyboard
> {}

const Kbd = ({ className, ...props }: KbdProps) => {
  return (
    <KeyboardPrimitives.Keyboard
      data-kbd=""
      className={kbd({ className })}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

export type { KbdGroupProps, KbdProps };
export { Kbd, KbdGroup };
