import * as React from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils/classes";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 disabled:bg-bg-disabled disabled:cursor-not-allowed disabled:text-fg-disabled",
  {
    variants: {
      variant: {
        primary:
          "bg-bg-primary text-fg-onPrimary hover:bg-bg-primary-hover active:bg-bg-primary-active",
        neutral:
          "bg-bg-neutral text-fg-onNeutral hover:bg-bg-neutral-hover active:bg-bg-neutral-active",
        link: "text-fg-link underline-offset-4 hover:text-fg-link-hover active:text-fg-link-active hover:underline",
        ghost:
          "text-fg hover:bg-bg-neutral-hover hover:text-fg-onNeutral active:bg-bg-neutral-active",
        outline:
          "border text-fg hover:border-border-hover hover:bg-bg-neutral-hover hover:text-fg-onNeutral active:border-border-active active:bg-bg-neutral-active disabled:bg-transparent disabled:border-border-disabled",
        danger:
          "bg-bg-danger text-fg-onDanger hover:bg-bg-danger-hover active:bg-bg-danger-active",
        success:
          "bg-bg-success text-fg-onSuccess hover:bg-bg-success-hover active:bg-bg-success-active",
        warning:
          "bg-bg-warning text-fg-onWarning hover:bg-bg-warning-hover active:bg-bg-warning-active",
      },
      size: {
        sm: "h-8 px-3 [&_svg]:size-4",
        md: "h-9 px-4 [&_svg]:size-4",
        lg: "h-10 px-6 [&_svg]:size-5",
      },
      shape: {
        default: "",
        square: "",
        circle: "rounded-full",
      },
    },
    compoundVariants: [
      {
        size: "sm",
        shape: ["square", "circle"],
        className: "w-8 px-0",
      },
      {
        size: "md",
        shape: ["square", "circle"],
        className: "w-9 px-0",
      },
      {
        size: "lg",
        shape: ["square", "circle"],
        className: "w-10 px-0",
      },
    ],
    defaultVariants: {
      variant: "neutral",
      size: "md",
      shape: "default",
    },
  }
);

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "prefix">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      shape,
      asChild = false,
      children,
      disabled = false,
      loading = false,
      prefix,
      suffix,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, shape, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {(prefix ?? loading) && (
          <span className="pointer-events-none mr-2">
            {loading ? (
              <>
                <Loader2Icon className="size-6 animate-spin" aria-hidden="true" />
                <span className="sr-only">loading</span>
              </>
            ) : (
              prefix
            )}
          </span>
        )}
        <Slottable>{children}</Slottable>
        {suffix && <span className="ml-2">{suffix}</span>}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
