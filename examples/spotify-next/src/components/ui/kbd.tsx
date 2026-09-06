"use client";

import * as KeyboardPrimitive from "react-aria-components/Keyboard";
import { tv, type VariantProps } from "tailwind-variants";
const kbdVariants = tv({
  slots: {
    group: "inline-flex items-center gap-1",
    kbd: [
      "pointer-events-none inline-flex w-fit items-center justify-center gap-1 text-fg-muted select-ui",
      "**:[svg]:not-with-[size]:size-3",
      "h-5 min-w-5 rounded-sm bg-muted px-1 font-sans text-xs font-medium",
    ],
  },
});

interface KbdGroupProps extends React.HTMLAttributes<HTMLElement> {}

const KbdGroup = ({ className, ...props }: KbdGroupProps) => {
  const { group } = kbdVariants();
  return <kbd data-kbd-group="" className={group({ className })} {...props} />;
};

interface KbdProps extends React.ComponentProps<
  typeof KeyboardPrimitive.Keyboard
> {}

const Kbd = ({ className, ...props }: KbdProps) => {
  const { kbd } = kbdVariants();
  return (
    <KeyboardPrimitive.Keyboard
      data-kbd=""
      className={kbd({ className })}
      {...props}
    />
  );
};

export type { KbdGroupProps, KbdProps };
export { Kbd, KbdGroup };
