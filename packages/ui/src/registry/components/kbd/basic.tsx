"use client";

import { Keyboard } from "react-aria-components";
import { tv } from "tailwind-variants";

const KbdStyles = tv({
  base: "inline-flex min-w-5 items-center justify-center rounded-sm border bg-bg p-1 text-xs leading-none text-fg-muted",
});

type KbdProps = React.HTMLAttributes<HTMLElement>;
const Kbd = ({ className, ...props }: KbdProps) => {
  return <Keyboard className={KbdStyles({ className })} {...props} />;
};

export type { KbdProps };
export { Kbd, KbdStyles };
