import * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
  InfoIcon,
} from "@/__registry__/icons";

const alertStyles = tv({
  slots: {
    root: "flex items-center gap-4 rounded-lg border p-4 [&_svg]:size-4",
    title: "mr-1 font-medium leading-normal tracking-tight",
    content: "text-sm",
  },
  variants: {
    variant: {
      default: { root: "text-fg border" },
      success: { root: "border-border-success text-fg-success border" },
      warning: { root: "border-border-warning text-fg-warning border" },
      danger: { root: "border-border-danger text-fg-danger border" },
      info: { root: "border-border-accent text-fg-accent border" },
    },
    fill: {
      true: "",
    },
  },
  compoundVariants: [
    { variant: "default", fill: true, className: { root: "bg-bg-muted" } },
    {
      variant: "success",
      fill: true,
      className: { root: "bg-bg-success-muted" },
    },
    {
      variant: "warning",
      fill: true,
      className: { root: "bg-bg-warning-muted" },
    },
    {
      variant: "danger",
      fill: true,
      className: { root: "bg-bg-danger-muted" },
    },
    { variant: "info", fill: true, className: { root: "bg-bg-accent-muted" } },
  ],
  defaultVariants: {
    variant: "default",
    fill: false,
  },
});

const icons = {
  default: <InfoIcon />,
  danger: <AlertCircleIcon />,
  success: <CheckCircle2Icon />,
  warning: <AlertTriangleIcon />,
  info: <InfoIcon />,
};
interface AlertProps extends AlertRootProps {
  title?: React.ReactNode;
  icon?: React.ReactNode | null;
  action?: React.ReactNode;
}
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ variant = "default", title, children, icon, action, ...props }, ref) => {
    return (
      <AlertRoot variant={variant} {...props} ref={ref}>
        {icon || icons[variant]}
        <div className="flex-1 space-y-0.5">
          {title && <AlertTitle>{title}</AlertTitle>}
          {children && <AlertContent>{children}</AlertContent>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </AlertRoot>
    );
  }
);
Alert.displayName = "Alert";

interface AlertRootProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof alertStyles> {}
const AlertRoot = React.forwardRef<HTMLDivElement, AlertRootProps>(
  ({ className, variant, fill, ...props }, ref) => {
    const { root } = alertStyles({ variant, fill });
    return (
      <div role="alert" className={root({ className })} {...props} ref={ref} />
    );
  }
);
AlertRoot.displayName = "AlertRoot";

interface AlertTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof alertStyles> {} // TODO VERIFY THIS
const AlertTitle = React.forwardRef<HTMLHeadingElement, AlertTitleProps>(
  ({ className, ...props }, ref) => {
    const { title } = alertStyles();
    return <h3 className={title({ className })} {...props} ref={ref} />;
  }
);
AlertTitle.displayName = "AlertTitle";

interface AlertContentProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof alertStyles> {} // TODO VERIFY THIS
const AlertContent = ({ className, ...props }: AlertContentProps) => {
  const { content } = alertStyles();
  return <section className={content({ className })} {...props} />;
};

export type { AlertProps, AlertRootProps, AlertTitleProps, AlertContentProps };
export { Alert, AlertRoot, AlertTitle, AlertContent };
