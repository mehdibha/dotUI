"use client";

import * as React from "react";
import {
  OTPInput,
  type RenderProps,
  type OTPInputProps,
  type SlotProps,
  OTPInputContext,
} from "input-otp";
import { Dot } from "lucide-react";
import { type VariantProps, cn, cva } from "@/lib/utils/classes";

const RootVariants = cva("flex items-center has-[:disabled]:opacity-10 disabled:cursor-not-allowed has-[:disabled]:cursor-not-allowed", {
  variants: {
    size: {
      sm: "gap-1",
      md: "gap-2",
      lg: "gap-3",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const SlotVariants = cva(
  "relative flex h-10 w-10 items-center justify-center rounded-md border text-sm transition-all bg-transparent",
  {
    variants: {
      variant: {
        default: "",
        success: "ring-1 ring-border-success text-fg-onMutedSuccess",
        error: "ring-1 ring-border-danger text-fg-onMutedDanger",
      },
      size: {
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-12 w-12",
      },
      disabled: {
        true: "border-border-disabled bg-bg-disabled text-fg-disabled",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

type InputOTPRenderFn = (props: RenderProps) => React.ReactNode;
export type InputOTPProps = Omit<
  OTPInputProps,
  "render" | "children" | "size" | "containerClassName" | "maxLength"
> & { length: number } & VariantProps<typeof SlotVariants> &
  (
    | {
        render?: never;
        children?: never;
      }
    | {
        render: InputOTPRenderFn;
        children?: never;
      }
  );

const InputOTP = React.forwardRef<React.ElementRef<typeof OTPInput>, InputOTPProps>(
  ({ className, render, size, variant, disabled, length, ...props }, ref) => {
    return (
      <OTPInput
        ref={ref}
        containerClassName={cn(RootVariants({ size }), className)}
        className="disabled:cursor-not-allowed"
        disabled={disabled}
        maxLength={length}
        render={
          render ??
          (({ slots }) =>
            slots.map((slot, index) => (
              <InputOTPSlotBase
                key={index}
                size={size}                             
                variant={variant}
                disabled={disabled}
                {...slot}
              />
            )))
        }
        {...props}
      />
    );
  }
);
InputOTP.displayName = "InputOTP";

const InputOTPSlotBase = React.forwardRef<
  React.ElementRef<"div">,
  SlotProps & VariantProps<typeof SlotVariants> & React.ComponentPropsWithoutRef<"div">
>(
  (
    { char, hasFakeCaret, isActive, variant, size, disabled, className, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          SlotVariants({ variant, size, disabled, className }),
          isActive &&
            "z-10 border-border bg-transparent ring-2 ring-border-focus ring-offset-background has-[:disabled]:opacity-10"
        )}
        {...props}
      >
        {char}
        {hasFakeCaret && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
          </div>
        )}
      </div>
    );
  }
);
InputOTPSlotBase.displayName = "InputOTPSlotBase";

const InputOTPRoot = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, containerClassName, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cn(
      "flex items-center gap-2 has-[:disabled]:opacity-50",
      containerClassName
    )}
    className={cn("disabled:cursor-not-allowed", className)}
    {...props}
  />
));
InputOTPRoot.displayName = "InputOTPRoot";

const InputOTPSlot = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & { index: number } & VariantProps<
      typeof SlotVariants
    >
>(({ index, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext);
  const SlotProps = inputOTPContext.slots[index];

  return <InputOTPSlotBase ref={ref} {...props} {...SlotProps} />;
});
InputOTPSlot.displayName = "InputOTPSlot";

const InputOTPSeparator = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ ...props }, ref) => (
  <div ref={ref} role="separator" {...props}>
    <Dot />
  </div>
));
InputOTPSeparator.displayName = "InputOTPSeparator";

export { InputOTP, InputOTPRoot, InputOTPSlot, InputOTPSeparator };
