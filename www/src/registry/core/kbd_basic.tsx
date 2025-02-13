"use client";

import { Keyboard } from "react-aria-components";
import { tv } from "tailwind-variants";

const KbdStyles = tv({
  base: "text-fg-muted bg-bg inline-flex min-w-5 items-center justify-center rounded-sm border p-1 text-xs leading-none",
});

type KbdProps = React.HTMLAttributes<HTMLElement>;
const Kbd = ({ className, ...props }: KbdProps) => {
  return <Keyboard className={KbdStyles({ className })} {...props} />;
};

export type { KbdProps };
export { Kbd, KbdStyles };
