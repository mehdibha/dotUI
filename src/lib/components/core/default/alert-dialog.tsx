"use client";

import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import {
  Button,
  buttonVariants,
  type ButtonProps,
} from "@/lib/components/core/default/button";
import { cn } from "@/lib/utils/classes";
import { Separator } from "./separator";

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
            "m-4 max-w-sm rounded-lg bg-bg sm:max-w-md sm:space-y-6 sm:p-6 border",
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
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
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
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;

const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex items-center border-t sm:justify-end sm:space-x-2 sm:border-none",
      className
    )}
    {...props}
  />
);
AlertDialogFooter.displayName = "AlertDialogFooter";

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

type AlertDialogCancelProps = React.ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Cancel
>;

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(
      buttonVariants({
        variant: { initial: "ghost", sm: "outline" },
        size: { initial: "lg", sm: "md" },
        className:
          "text-md h-12 w-full rounded-none rounded-bl-lg sm:h-10 sm:w-auto sm:rounded-md sm:text-sm",
      }),
      className
    )}
    {...props}
  />
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;

type AlertDialogActionProps = React.ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Action
>;

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  AlertDialogActionProps
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(
      buttonVariants({
        variant: { initial: "ghost", sm: "primary" },
        size: { initial: "lg", sm: "md" },
        className:
          "text-md h-12 w-full rounded-none rounded-br-lg sm:h-10 sm:w-auto sm:rounded-md sm:text-sm",
      }),
      className
    )}
    {...props}
  />
));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;

const AlertDialogBody = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-4 sm:p-0", className)} {...props} />
));
AlertDialogBody.displayName = "AlertDialogBody";

type AlertDialogProps = React.ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Root
> & {
  title?: string;
  description?: string;
  trigger?: React.ReactNode;
  cancel: Omit<AlertDialogCancelProps, "children"> & { label?: React.ReactNode };
  action: Omit<AlertDialogActionProps, "children"> & { label?: React.ReactNode };
};

const AlertDialog = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Root>,
  AlertDialogProps
>(
  (
    {
      trigger,
      title,
      description,
      cancel: { label: cancelLabel, ...cancelProps },
      action: { label: actionLabel, ...actionProps },
      children,
      ...props
    },
    ref
  ) => {
    return (
      <AlertDialogRoot {...props}>
        {trigger}
        <AlertDialogContent ref={ref}>
          <AlertDialogBody>
            <AlertDialogHeader>
              <AlertDialogTitle>{title}</AlertDialogTitle>
              <AlertDialogDescription>{description}</AlertDialogDescription>
            </AlertDialogHeader>
            {children}
          </AlertDialogBody>
          <AlertDialogFooter>
            <AlertDialogCancel {...cancelProps}>{cancelLabel}</AlertDialogCancel>
            <Separator
              orientation="vertical"
              decorative
              className="visible h-auto self-stretch sm:hidden"
            />
            <AlertDialogAction {...actionProps}>{actionLabel}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogRoot>
    );
  }
);
AlertDialog.displayName = "AlertDialog";

export {
  AlertDialog,
  AlertDialogRoot,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
