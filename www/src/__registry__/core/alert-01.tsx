"use client";

import * as React from "react";
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
  InfoIcon,
} from "lucide-react";
import { tv, type VariantProps } from "tailwind-variants";
import { createScopedContext } from "@/lib/helpers";

const alertStyles = tv({
  slots: {
    root: "flex items-center gap-4 rounded-lg border p-4 [&_svg]:size-4",
    title: "mr-1 font-medium leading-normal tracking-tight",
    content: "text-sm",
  },
  variants: {
    variant: {
      neutral: { root: "text-fg border" },
      success: { root: "border-border-success text-fg-success border" },
      warning: { root: "border-border-warning text-fg-warning border" },
      danger: { root: "border-border-danger text-fg-danger border" },
      info: { root: "border-border-accent text-fg-accent border" },
    },
  },
  defaultVariants: {
    variant: "neutral",
  },
});

const { root, title, content } = alertStyles();

const [AlertProvider, useAlertContext] =
  createScopedContext<VariantProps<typeof alertStyles>>("AlertRoot");

const icons = {
  neutral: <InfoIcon />,
  danger: <AlertCircleIcon />,
  success: <CheckCircle2Icon />,
  warning: <AlertTriangleIcon />,
  info: <InfoIcon />,
};

interface AlertProps extends AlertRootProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

function Alert({
  variant = "neutral",
  title,
  description,
  action,
  ...props
}: AlertProps) {
  return (
    <AlertRoot variant={variant} {...props}>
      {icons[variant]}
      <div className="flex-1 space-y-0.5">
        <AlertTitle>{title}</AlertTitle>
        {description && <AlertContent>{description}</AlertContent>}
      </div>
      {action}
    </AlertRoot>
  );
}

interface AlertRootProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof alertStyles> {}

function AlertRoot({ className, variant, ...props }: AlertRootProps) {
  return (
    <AlertProvider variant={variant}>
      <div role="alert" className={root({ variant, className })} {...props} />
    </AlertProvider>
  );
}

interface AlertTitleProps extends React.ComponentProps<"h5"> {}

function AlertTitle({ className, ...props }: AlertTitleProps) {
  const { variant } = useAlertContext("AlertTitle");
  return <h5 className={title({ variant, className })} {...props} />;
}

interface AlertContentProps extends React.ComponentProps<"p"> {}

function AlertContent({ className, ...props }: AlertContentProps) {
  const { variant } = useAlertContext("AlertTitle");
  return <p className={content({ variant, className })} {...props} />;
}

export type { AlertProps, AlertRootProps, AlertTitleProps, AlertContentProps };
export { Alert, AlertRoot, AlertTitle, AlertContent };
