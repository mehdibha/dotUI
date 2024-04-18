import * as React from "react";
import { Loader2Icon } from "lucide-react";
import { cn, cva, type VariantProps } from "@/lib/utils/classes";

const inputVariants = cva(
  [
    "flex items-center w-full transition-colors rounded-md overflow-hidden border bg-transparent text-sm shadow-sm focus-within:ring-1 focus-within:ring-border-focus",
  ],
  {
    variants: {
      size: {
        sm: "h-8 [&_svg]:size-4",
        md: "h-9 [&_svg]:size-4",
        lg: "h-10 [&_svg]:size-5",
      },
      status: {
        error: "ring-1 ring-border-danger",
        success: "ring-1 ring-border-success",
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
    return <span className={cn("flex", className)}>{children}</span>;
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
            "font-inherit h-full w-full appearance-none border-none bg-transparent px-3 py-1 placeholder:text-fg-muted focus:outline-none disabled:cursor-not-allowed disabled:text-fg-disabled"
          )}
          {...inputProps}
        />
        <InnerVisual className="ml-1 mr-3" loading={showSuffixLoading}>
          {suffix}
        </InnerVisual>
      </span>
    );
  }
);

Input.displayName = "Input";

export { Input, inputVariants };
