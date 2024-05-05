"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { tv } from "tailwind-variants";
import { Label } from "./label";

const switchVariants = tv({
  slots: {
    root: "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
    thumb:
      "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
  },
  variants: {
    size: {
      sm: {
        root: "",
        thumb: "",
      },
      md: {
        root: "",
        thumb: "",
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});

// const Switch = React.forwardRef<
//   React.ElementRef<typeof SwitchPrimitives.Root>,
//   React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
// >(({ className, ...props }, ref) => (
//   <SwitchPrimitives.Root
//     className={switchVariants({ size: "md", className }).root()}
//     {...props}
//     ref={ref}
//   >
//     <SwitchPrimitives.Thumb className={switchVariants({ size: "md" }).thumb()} />
//   </SwitchPrimitives.Root>
// ));
// Switch.displayName = SwitchPrimitives.Root.displayName;

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, children, ...props }, ref) => {
  if (children) {
    return (
      <Label className="flex items-center space-x-2">
        <SwitchPrimitives.Root
          className={switchVariants({ size: "md", className }).root()}
          {...props}
          ref={ref}
        >
          <SwitchPrimitives.Thumb className={switchVariants({ size: "md" }).thumb()} />
        </SwitchPrimitives.Root>
        <span>{children}</span>
      </Label>
    );
  }

  return (
    <SwitchPrimitives.Root
      className={switchVariants({ size: "md", className }).root()}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb className={switchVariants({ size: "md" }).thumb()} />
    </SwitchPrimitives.Root>
  );
});
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
