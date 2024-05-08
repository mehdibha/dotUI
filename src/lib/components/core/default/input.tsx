import * as React from "react";
import { Loader2Icon } from "lucide-react";
import { cn, cva, type VariantProps } from "@/lib/utils/classes";

const inputVariants = cva(
  [
    "flex items-center w-full transition-colors rounded-md overflow-hidden border bg-bg text-sm shadow-sm focus-within:border-border-focus focus-within:ring focus-within:ring-1 focus-within:outline-border-focus",
  ],
  {
    variants: {
      size: {
        sm: "h-8 [&_svg]:size-4",
        md: "h-9 [&_svg]:size-4",
        lg: "h-10 [&_svg]:size-5",
      },
      status: {
        error: "border-border-danger",
        success: "border-border-success",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "prefix">,
    VariantProps<typeof inputVariants> {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  loading?: boolean;
  loaderPosition?: "prefix" | "suffix";
}

const InnerVisual = ({
  loading,
  className,
  children,
}: {
  loading?: boolean;
  className?: string;
  children?: React.ReactNode;
}) => {
  if (loading) {
    return (
      <span className={cn("flex", className)}>
        <Loader2Icon className="animate-spin" />
      </span>
    );
  }
  if (children) {
    return <span className={cn("flex text-fg-muted", className)}>{children}</span>;
  }
  return null;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      style,
      className,
      type,
      size,
      status,
      prefix,
      suffix,
      children,
      disabled,
      loading,
      loaderPosition = "suffix",
      ...inputProps
    },
    ref
  ) => {
    const showPrefixLoading = loading && loaderPosition === "prefix";
    const showSuffixLoading = loading && loaderPosition === "suffix";

    return (
      <span
        style={style}
        className={cn(
          inputVariants({ size, status, className }),
          disabled && "cursor-not-allowed border-border-disabled bg-bg-disabled"
        )}
      >
        <InnerVisual className="ml-3" loading={showPrefixLoading}>
          {prefix}
        </InnerVisual>
        <input
          ref={ref}
          type={type}
          disabled={disabled}
          className={cn(
            "font-inherit flex h-full w-full appearance-none items-center border-none bg-transparent px-3 placeholder:text-fg-muted focus:outline-none disabled:cursor-not-allowed disabled:text-fg-disabled",
            "file:mt-[5px] file:cursor-pointer file:rounded-md file:border-none file:bg-bg-neutral file:px-2 file:py-0.5 file:text-fg-onNeutral file:outline-none file:transition-colors file:hover:bg-bg-neutral-hover",
            {
              "file:mt-[3px]": size === "sm",
              "file:mt-[7px]": size === "lg",
            }
          )}
          {...inputProps}
        />
        {children}
        <InnerVisual className="ml-1 mr-3" loading={showSuffixLoading}>
          {suffix}
        </InnerVisual>
      </span>
    );
  }
);

Input.displayName = "Input";

export { Input, inputVariants };
