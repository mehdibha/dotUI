"use client";

import { Keyboard } from "react-aria-components";
import { tv } from "tailwind-variants";

const KbdStyles = tv({
  base: "text-fg-muted bg-bg border-border-active rounded-md border px-1.5 py-0.5 text-sm tracking-widest",
});

type KbdProps = React.HTMLAttributes<HTMLElement>;
const Kbd = ({ className, ...props }: KbdProps) => {
  return <Keyboard className={KbdStyles({ className })} {...props} />;
};

export type { KbdProps };
export { Kbd, KbdStyles };
