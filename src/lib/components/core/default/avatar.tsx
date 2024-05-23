"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { tv } from "tailwind-variants";
import { cn } from "@/lib/utils/classes";

// TODO: clean the types

const avatarVariants = tv({
  base: "relative inline-flex h-10 w-10 shrink-0 overflow-hidden bg-bg-muted",
  variants: {
    shape: {
      circle: "rounded-full",
      square: "rounded-sm",
    },
  },
  defaultVariants: {
    shape: "circle",
  },
});

const AvatarRoot = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & {
    shape?: "circle" | "square";
  }
>(({ className, shape = "circle", ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(avatarVariants({ shape, className }))}
    {...props}
  />
));
AvatarRoot.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full select-none items-center justify-center",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

type AvatarProps = React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image> & {
  fallback: React.ReactNode;
  shape?: "circle" | "square";
  imageProps?: Omit<React.ComponentPropsWithoutRef<typeof AvatarImage>, "src" | "alt">;
  fallBackProps?: React.ComponentProps<typeof AvatarFallback>;
} & {
  src?: string;
  alt?: string;
};

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ fallback, imageProps, fallBackProps, src, alt, ...avatarRootProps }, ref) => {
  const [status, setStatus] = React.useState<"idle" | "loading" | "loaded" | "error">(
    "idle"
  );
  return (
    <AvatarRoot ref={ref} {...avatarRootProps}>
      {status === "error" ? (
        <AvatarFallback {...fallBackProps}>{fallback}</AvatarFallback>
      ) : null}
      <AvatarPrimitive.Image
        src={src}
        alt={alt}
        {...imageProps}
        onLoadingStatusChange={(status) => {
          imageProps?.onLoadingStatusChange?.(status);
          setStatus(status);
        }}
      />
    </AvatarRoot>
  );
});
Avatar.displayName = "Avatar";

type AvatarGroupProps = React.HTMLAttributes<HTMLDivElement> & {
  max?: number;
  total?: number;
  shape?: "circle" | "square";
  renderCount?: (count: number) => React.ReactNode;
  countProps?: React.HTMLAttributes<HTMLSpanElement>;
};

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  (
    {
      children: children_,
      max = 5,
      className,
      total,
      shape,
      renderCount,
      countProps,
      ...props
    },
    ref
  ) => {
    const clampedMax = max < 2 ? 2 : max;
    const children = React.Children.toArray(children_).filter((child) => {
      return React.isValidElement(child);
    }) as React.ReactElement[];
    const totalCount = total ?? children.length;
    const avatarsToShow = totalCount <= clampedMax ? clampedMax : clampedMax - 1;
    const extraCount = totalCount - avatarsToShow;

    return (
      <div
        ref={ref}
        {...props}
        className={cn("flex -space-x-2 *:ring *:ring-bg", className)}
      >
        {children.slice(0, avatarsToShow).map((child) => {
          return React.cloneElement(child, {
            shape,
          });
        })}
        {extraCount > 1 && (
          <span
            ref={ref}
            className={cn(
              avatarVariants({ shape }),
              "items-center justify-center text-sm text-fg-muted"
            )}
            {...countProps}
          >
            {renderCount ? renderCount(extraCount) : `+${extraCount}`}
          </span>
        )}
      </div>
    );
  }
);
AvatarGroup.displayName = "AvatarGroup";

export { Avatar, AvatarRoot, AvatarImage, AvatarFallback, AvatarGroup };
