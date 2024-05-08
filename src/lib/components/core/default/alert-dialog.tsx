"use client";

import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { Button, type ButtonProps } from "@/lib/components/core/default/button";
import { cn } from "@/lib/utils/classes";

const AlertDialogRoot = AlertDialogPrimitive.Root;

type AlertDialogTriggerProps =
  | (Omit<
      React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Trigger>,
      "asChild"
    > & {
      asChild: true;
      loading?: never;
      prefix?: never;
      suffix?: never;
      variant?: never;
      size?: never;
      shape?: never;
    })
  | (Omit<ButtonProps, "asChild"> & { asChild?: false });

const AlertDialogTrigger = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  AlertDialogTriggerProps
>(({ children, asChild = false, ...props }, ref) => {
  if (asChild) {
    const _props = props as React.ComponentPropsWithoutRef<
      typeof AlertDialogPrimitive.Trigger
    >;
    return (
      <AlertDialogPrimitive.Trigger ref={ref} asChild {..._props}>
        {children}
      </AlertDialogPrimitive.Trigger>
    );
  }
  return (
    <AlertDialogPrimitive.Trigger ref={ref} asChild>
      {asChild ? children : <Button {...props}>{children}</Button>}
    </AlertDialogPrimitive.Trigger>
  );
});
AlertDialogTrigger.displayName = "AlertDialogTrigger";

const AlertDialogPortal = AlertDialogPrimitive.Portal;

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => {
  return (
    <AlertDialogPortal>
      <AlertDialogPrimitive.Overlay className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
        <AlertDialogPrimitive.Content
          {...props}
          ref={ref}
          className={cn(
            "m-4 flex max-h-[min(800px,80vh)] max-w-xs flex-col space-y-6 rounded-lg border bg-bg p-6 sm:max-w-md",
            className
          )}
        />
      </AlertDialogPrimitive.Overlay>
    </AlertDialogPortal>
  );
});
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;

const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => (
  <header
    className={cn("flex flex-col space-y-2 text-center sm:text-left", className)}
    {...props}
  />
);
AlertDialogHeader.displayName = "AlertDialogHeader";

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold sm:text-2xl", className)}
    {...props}
  />
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;

const AlertDialogInset = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("-mx-6 flex-grow overflow-y-auto", className)} {...props} />
);
AlertDialogInset.displayName = "AlertDialogInset";

const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-row items-center border-t max-[500px]:flex-col-reverse sm:justify-end sm:space-x-2 sm:border-none",
      "max-sm:rounded-b-[inherit] max-sm:[&>*:not(:last-child):not(:first-child)]:rounded-none max-sm:[&>*]:w-full",
      "min-[501px]:max-sm:[&>*:first-child]:rounded-e-none min-[501px]:max-sm:[&>*:first-child]:rounded-es-[inherit] min-[501px]:max-sm:[&>*:first-child]:rounded-ss-none min-[501px]:max-sm:[&>*:last-child]:rounded-s-none min-[501px]:max-sm:[&>*:last-child]:rounded-ee-[inherit] min-[501px]:max-sm:[&>*:last-child]:rounded-se-none min-[501px]:max-sm:[&>*:not(:first-child)]:ml-[-1px] min-[501px]:max-sm:[&>*:not(:first-child)]:border-s",
      "max-sm:[&>*:only-child]:rounded-b-[inherit]",
      "max-[500px]:[&>*:first-child]:rounded-b-[inherit] max-[500px]:[&>*:first-child]:rounded-t-none max-[500px]:[&>*:last-child]:rounded-none max-[500px]:[&>*:not(:last-child)]:border-t",
      "max-sm:-mx-6 max-sm:!-mb-6",
      className
    )}
    {...props}
  />
);
AlertDialogFooter.displayName = "AlertDialogFooter";

type AlertDialogActionProps =
  | (Omit<
      React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>,
      "asChild"
    > & {
      asChild: true;
      loading?: never;
      prefix?: never;
      suffix?: never;
      variant?: never;
      size?: never;
      shape?: never;
    })
  | (Omit<ButtonProps, "asChild"> & { asChild?: false });

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  AlertDialogActionProps
>(({ className, children, asChild, ...props }, ref) => {
  if (asChild) {
    const _props = props as React.ComponentPropsWithoutRef<
      typeof AlertDialogPrimitive.Action
    >;
    return (
      <AlertDialogPrimitive.Action ref={ref} asChild className={className} {..._props}>
        {children}
      </AlertDialogPrimitive.Action>
    );
  }
  return (
    <AlertDialogPrimitive.Action ref={ref} asChild>
      <Button
        variant={{ initial: "ghost", sm: "primary" }}
        size={{ initial: "lg", sm: "md" }}
        className={cn("text-md h-12 sm:h-10 sm:text-sm", className)}
        {...props}
      >
        {children}
      </Button>
    </AlertDialogPrimitive.Action>
  );
});
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;

type AlertDialogCancelProps =
  | (Omit<
      React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>,
      "asChild"
    > & {
      asChild: true;
      loading?: never;
      prefix?: never;
      suffix?: never;
      variant?: never;
      size?: never;
      shape?: never;
    })
  | (Omit<ButtonProps, "asChild"> & { asChild?: false });

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  AlertDialogCancelProps
>(({ className, asChild, children, ...props }, ref) => {
  if (asChild) {
    const _props = props as React.ComponentPropsWithoutRef<
      typeof AlertDialogPrimitive.Action
    >;
    return (
      <AlertDialogPrimitive.Cancel ref={ref} asChild className={className} {..._props}>
        {children}
      </AlertDialogPrimitive.Cancel>
    );
  }
  return (
    <AlertDialogPrimitive.Cancel ref={ref} asChild>
      <Button
        variant={{ initial: "ghost", sm: "outline" }}
        size={{ initial: "lg", sm: "md" }}
        className={cn("text-md h-12 w-full sm:h-10 sm:w-auto sm:text-sm", className)}
        {...props}
      >
        {children}
      </Button>
    </AlertDialogPrimitive.Cancel>
  );
});
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;

export {
  AlertDialogRoot,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogInset,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
};
