import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva, cn } from "@/utils/classes";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-80",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        sparkle: "",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "px-5 py-1 min-h-[28px]",
        lg: "h-11 px-8",
        xl: "h-13 px-10 py-4 text-md",
        icon: "h-10 w-10",
        "icon-sm": "h-6 w-6",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    if (variant === "sparkle") {
      return (
        <button
          className={cn(
            "group relative grid overflow-hidden rounded-full duration-300",
            buttonVariants({ size, className })
          )}
        >
          <span>
            <span
              className={cn(
                "spark mask-gradient animate-flip before:animate-rotate absolute inset-0 h-[100%] w-[100%] overflow-hidden rounded-lg [mask:linear-gradient(white,_transparent_50%)] before:absolute before:aspect-square before:w-[200%] before:rotate-[-90deg] before:bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)] before:content-[''] before:[inset:0_auto_auto_50%] before:[translate:-50%_-15%]",
                { "rounded-full": size === "sm" }
              )}
            />
          </span>
          <span
            className={cn(
              "backdrop absolute inset-[1px] rounded-md bg-secondary transition-colors duration-200 group-hover:bg-primary",
              { "rounded-full": size === "sm" }
            )}
          />
          <span className="z-10">{props.children}</span>
        </button>
      );
    }
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
