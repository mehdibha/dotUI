// AUTO-GENERATED - DO NOT EDIT
// Run "pnpm build" to regenerate

export const ui = [
	{
		name: "accordion",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/accordion/basic.tsx",
						target: "ui/accordion.tsx",
						content: `"use client";

import {
  DisclosureGroup as AriaDisclosureGroup,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const accordionStyles = tv({
  base: "**:data-disclosure:not-last:border-b",
});

interface AccordionProps
  extends React.ComponentProps<typeof AriaDisclosureGroup> {}
function Accordion({ className, ...props }: AccordionProps) {
  return (
    <AriaDisclosureGroup
      data-accordion=""
      className={composeRenderProps(className, (c) =>
        accordionStyles({ className: c }),
      )}
      {...props}
    />
  );
}

export { Accordion };

export type { AccordionProps };
`,
					},
				],
			},
		},
	},
	{
		name: "alert",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/alert/basic.tsx",
						target: "ui/alert.tsx",
						content: `import { tv } from "tailwind-variants";
import type * as React from "react";
import type { VariantProps } from "tailwind-variants";

const alertVariants = tv({
  slots: {
    base: "relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-lg border bg-card px-4 py-3 text-sm has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
    title: "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
    description:
      "col-start-2 grid justify-items-start gap-1 text-muted-foreground text-sm [&_p]:leading-relaxed",
  },
  variants: {
    variant: {
      neutral: {
        base: "text-fg",
      },
      danger: {
        base: "bg-danger-muted text-fg-danger *:data-[slot=alert-description]:text-fg-danger/90 [&>svg]:text-current",
      },
      warning: {
        base: "text-fg-warning *:data-[slot=alert-description]:text-fg-warning/90 [&>svg]:text-current",
      },
      info: {
        base: "text-fg-info *:data-[slot=alert-description]:text-fg-info/90 [&>svg]:text-current",
      },
      success: {
        base: "text-fg-success *:data-[slot=alert-description]:text-fg-success/90 [&>svg]:text-current",
      },
    },
  },
  defaultVariants: {
    variant: "neutral",
  },
});

const { base, title, description } = alertVariants();

/* -----------------------------------------------------------------------------------------------*/

interface AlertProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof alertVariants> {}

function Alert({ className, variant, ...props }: AlertProps) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={base({ variant, className })}
      {...props}
    />
  );
}

/* -----------------------------------------------------------------------------------------------*/

interface AlertTitleProps extends React.ComponentProps<"div"> {}

function AlertTitle({ className, ...props }: AlertTitleProps) {
  return (
    <div data-slot="alert-title" className={title({ className })} {...props} />
  );
}

/* -----------------------------------------------------------------------------------------------*/

interface AlertDescriptionProps extends React.ComponentProps<"div"> {}

function AlertDescription({ className, ...props }: AlertDescriptionProps) {
  return (
    <div
      data-slot="alert-description"
      className={description({ className })}
      {...props}
    />
  );
}

/* -----------------------------------------------------------------------------------------------*/

interface AlertActionProps extends React.ComponentProps<"div"> {}

function AlertAction({ className, ...props }: AlertActionProps) {
  return <div data-slot="alert-action" {...props} />;
}

/* -----------------------------------------------------------------------------------------------*/

export { Alert, AlertTitle, AlertDescription, AlertAction };

export type {
  AlertProps,
  AlertTitleProps,
  AlertDescriptionProps,
  AlertActionProps,
};
`,
					},
				],
			},
		},
	},
	{
		name: "avatar",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/avatar/basic.tsx",
						target: "ui/avatar.tsx",
						content: `"use client";

import * as React from "react";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

import { useImageLoadingStatus } from "@dotui/registry/hooks/use-image-loading-status";
import { createContext } from "@dotui/registry/lib/context";
import type { ImageLoadingStatus } from "@dotui/registry/hooks/use-image-loading-status";

const avatarStyles = tv({
  slots: {
    group:
      "-space-x-2 flex flex-wrap *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-bg",
    root: "relative inline-flex shrink-0 overflow-hidden rounded-full bg-bg align-middle",
    image: "aspect-square size-full",
    fallback: "flex size-full select-none items-center justify-center bg-muted",
    placeholder:
      "flex size-full h-full animate-pulse items-center justify-center bg-muted",
  },
  variants: {
    size: {
      sm: { group: "*:data-[slot=avatar]:size-8", root: "size-8" },
      md: { group: "*:data-[slot=avatar]:size-10", root: "size-10" },
      lg: { group: "*:data-[slot=avatar]:size-12", root: "size-12" },
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const { group, root, image, fallback, placeholder } = avatarStyles();

/* -----------------------------------------------------------------------------------------------*/

interface AvatarGroupProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof avatarStyles> {}

const AvatarGroup = ({ className, size, ...props }: AvatarGroupProps) => {
  return <div className={group({ className, size })} {...props} />;
};

/* -----------------------------------------------------------------------------------------------*/

interface AvatarProps
  extends AvatarImageProps,
    VariantProps<typeof avatarStyles> {
  fallback?: React.ReactNode;
}
const Avatar = ({
  className,
  style,
  fallback,
  size,
  ...props
}: AvatarProps) => {
  return (
    <AvatarRoot className={className} style={style} size={size}>
      <AvatarImage {...props} />
      <AvatarFallback>{fallback}</AvatarFallback>
      <AvatarPlaceholder />
    </AvatarRoot>
  );
};

/* -----------------------------------------------------------------------------------------------*/

const [AvatarInternalContext, useAvatarInternalContext] = createContext<{
  status: ImageLoadingStatus;
  setStatus: (status: ImageLoadingStatus) => void;
}>({
  name: "AvatarRoot",
  strict: true,
});

interface AvatarRootProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof avatarStyles> {}
function AvatarRoot({ className, size, ...props }: AvatarRootProps) {
  const [status, setStatus] = React.useState<ImageLoadingStatus>("idle");

  return (
    <AvatarInternalContext value={{ status, setStatus }}>
      <span
        data-slot="avatar"
        className={root({ className, size })}
        {...props}
      />
    </AvatarInternalContext>
  );
}

/* -----------------------------------------------------------------------------------------------*/

interface AvatarImageProps extends Omit<React.ComponentProps<"img">, "src"> {
  src?: string;
}

function AvatarImage({
  src,
  alt,
  className,
  referrerPolicy,
  crossOrigin,
  ...props
}: AvatarImageProps) {
  const status = useImageLoadingStatus(src, { referrerPolicy, crossOrigin });
  const { setStatus } = useAvatarInternalContext("AvatarImage");

  React.useLayoutEffect(() => {
    if (status !== "idle") {
      setStatus(status);
    }
  }, [status, setStatus]);

  if (status === "loaded")
    return (
      <img
        slot="avatar-image"
        className={image({ className })}
        src={src}
        alt={alt}
        {...props}
      />
    );

  return null;
}

/* -----------------------------------------------------------------------------------------------*/

type AvatarFallbackProps = React.HTMLAttributes<HTMLSpanElement>;

const AvatarFallback = ({ className, ...props }: AvatarFallbackProps) => {
  const { status } = useAvatarInternalContext("AvatarFallback");
  if (status === "error")
    return (
      <span
        slot="avatar-fallback"
        className={fallback({ className })}
        {...props}
      />
    );
  return null;
};

/* -----------------------------------------------------------------------------------------------*/

interface AvatarPlaceholderProps extends React.ComponentProps<"span"> {}

const AvatarPlaceholder = ({ className, ...props }: AvatarPlaceholderProps) => {
  const { status } = useAvatarInternalContext("AvatarPlaceholder");
  if (["idle", "loading"].includes(status))
    return <span className={placeholder({ className })} {...props} />;
  return null;
};

/* -----------------------------------------------------------------------------------------------*/

const CompoundAvatar = Object.assign(Avatar, {
  Group: AvatarGroup,
  Root: AvatarRoot,
  Image: AvatarImage,
  Fallback: AvatarFallback,
  Placeholder: AvatarPlaceholder,
});

export {
  CompoundAvatar as Avatar,
  AvatarGroup,
  AvatarRoot,
  AvatarImage,
  AvatarFallback,
  AvatarPlaceholder,
};

export type {
  AvatarGroupProps,
  AvatarProps,
  AvatarRootProps,
  AvatarImageProps,
  AvatarFallbackProps,
  AvatarPlaceholderProps,
};
`,
					},
				],
			},
		},
	},
	{
		name: "badge",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/badge/basic.tsx",
						target: "ui/badge.tsx",
						content: `import { tv } from "tailwind-variants";
import type * as React from "react";
import type { VariantProps } from "tailwind-variants";

const badgeStyles = tv({
  base: "inline-flex w-fit shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-md px-2 py-0.5 font-medium text-xs [&>svg]:pointer-events-none [&>svg]:size-3",
  variants: {
    variant: {
      default: "bg-neutral text-fg-on-neutral",
      danger: "bg-danger text-fg-on-danger",
      success: "bg-success text-fg-on-success",
      warning: "bg-warning text-fg-on-warning",
      info: "bg-info text-fg-on-info",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface BadgeProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof badgeStyles> {}
const Badge = ({ className, variant, ...props }: BadgeProps) => {
  return (
    <span
      role="presentation"
      className={badgeStyles({ variant, className })}
      {...props}
    />
  );
};

export type { BadgeProps };
export { Badge };
`,
					},
				],
			},
		},
	},
	{
		name: "breadcrumbs",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/breadcrumbs/basic.tsx",
						target: "ui/breadcrumbs.tsx",
						content: `"use client";

import { ChevronRightIcon } from "lucide-react";
import {
  Breadcrumb as AriaBreadcrumb,
  Breadcrumbs as AriaBreadcrumbs,
  Link as AriaLink,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type { BreadcrumbsProps as AriaBreadcrumbsProps } from "react-aria-components";

const breadcrumbsStyles = tv({
  slots: {
    root: "wrap-break-word flex flex-wrap items-center gap-1.5 text-fg-muted text-sm [&_svg]:size-4",
    item: "inline-flex items-center gap-1",
    link: [
      "focus-reset focus-visible:focus-ring",
      "inline-flex items-center gap-1 rounded px-0.5 current:text-fg leading-none transition-colors disabled:cursor-default disabled:not-current:text-fg-disabled hover:[a]:text-fg",
    ],
  },
});

const { root, item, link } = breadcrumbsStyles();

interface BreadcrumbsProps<T extends object> extends AriaBreadcrumbsProps<T> {
  ref?: React.RefObject<HTMLOListElement>;
}
const Breadcrumbs = <T extends object>({
  className,
  ...props
}: BreadcrumbsProps<T>) => {
  return <AriaBreadcrumbs className={root({ className })} {...props} />;
};

type BreadcrumbProps = BreadcrumbItemProps &
  Omit<BreadcrumbLinkProps, "children">;
const Breadcrumb = ({ ref, children, ...props }: BreadcrumbProps) => {
  return (
    <BreadcrumbItem ref={ref} {...props}>
      {composeRenderProps(children, (children, { isCurrent }) => (
        <>
          <BreadcrumbLink {...props}>{children}</BreadcrumbLink>
          {!isCurrent && <ChevronRightIcon />}
        </>
      ))}
    </BreadcrumbItem>
  );
};

interface BreadcrumbItemProps
  extends React.ComponentProps<typeof AriaBreadcrumb> {}
const BreadcrumbItem = ({ className, ...props }: BreadcrumbItemProps) => (
  <AriaBreadcrumb
    className={composeRenderProps(className, (className) =>
      item({ className }),
    )}
    {...props}
  />
);

interface BreadcrumbLinkProps extends React.ComponentProps<typeof AriaLink> {}
const BreadcrumbLink = ({ className, ...props }: BreadcrumbLinkProps) => (
  <AriaLink
    className={composeRenderProps(className, (className) =>
      link({ className }),
    )}
    {...props}
  />
);

export { Breadcrumbs, Breadcrumb, BreadcrumbItem, BreadcrumbLink };

export type {
  BreadcrumbsProps,
  BreadcrumbProps,
  BreadcrumbItemProps,
  BreadcrumbLinkProps,
};
`,
					},
				],
				registryDependencies: ["focus-styles"],
			},
		},
	},
	{
		name: "button",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/button/basic.tsx",
						target: "ui/button.tsx",
						content: `"use client";

import {
  Button as AriaButton,
  ButtonContext as AriaButtonContext,
  Link as AriaLink,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type * as React from "react";
import type { VariantProps } from "tailwind-variants";

import { useButtonAspect } from "@dotui/registry/hooks/use-button-aspect";
import { createVariantsContext } from "@dotui/registry/lib/context";
import { Loader } from "@dotui/registry/ui/loader";

const buttonStyles = tv({
  base: [
    "relative box-border inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm leading-normal transition-[background-color,border-color,color,box-shadow] data-icon-only:px-0",
    "*:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2",
    // svg
    "[&_svg]:pointer-events-none [&_svg]:not-with-[size]:size-4 [&_svg]:shrink-0",
    // focus state
    "focus-reset focus-visible:focus-ring",
    // disabled state
    "disabled:cursor-default disabled:border-border-disabled disabled:bg-disabled disabled:text-fg-disabled",
    // pending state
    "pending:cursor-default pending:border-border-disabled pending:bg-disabled pending:text-transparent pending:**:not-data-[slot=spinner]:not-in-data-[slot=spinner]:opacity-0 pending:**:data-[slot=spinner]:text-fg-muted",
  ],
  variants: {
    variant: {
      default:
        "border pressed:border-border-active bg-neutral pressed:bg-neutral-active text-fg-on-neutral hover:border-border-hover hover:bg-neutral-hover",
      primary:
        "pending:border-0 bg-primary pressed:bg-primary-active text-fg-on-primary [--color-disabled:var(--neutral-500)] [--color-fg-disabled:var(--neutral-300)] hover:bg-primary-hover disabled:border-0",
      quiet: "bg-transparent pressed:bg-inverse/20 text-fg hover:bg-inverse/10",
      link: "text-fg underline-offset-4 hover:underline",
      warning:
        "bg-warning pressed:bg-warning-active text-fg-on-warning hover:bg-warning-hover",
      danger:
        "bg-danger pressed:bg-danger-active text-fg-on-danger hover:bg-danger-hover",
    },
    size: {
      sm: "h-8 px-3 has-[>svg]:px-2.5 data-icon-only:not-with-[size]:not-with-[w]:w-8",
      md: "h-9 px-4 has-[>svg]:px-3 data-icon-only:not-with-[size]:not-with-[w]:w-9",
      lg: "h-10 px-5 has-[>svg]:px-4 data-icon-only:not-with-[size]:not-with-[w]:w-10",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

type ButtonVariants = VariantProps<typeof buttonStyles>;

const [ButtonProvider, useContextProps] = createVariantsContext<
  ButtonVariants,
  React.ComponentProps<typeof AriaButton>
>(AriaButtonContext);

/* -----------------------------------------------------------------------------------------------*/

interface ButtonProps
  extends React.ComponentProps<typeof AriaButton>,
    ButtonVariants {
  aspect?: "default" | "square" | "auto";
}

const Button = (localProps: ButtonProps) => {
  const {
    variant,
    size,
    aspect = "auto",
    className,
    slot,
    style,
    children,
    ...props
  } = useContextProps(localProps);

  const isIconOnly = useButtonAspect(children, aspect);

  return (
    <AriaButton
      data-button=""
      data-icon-only={isIconOnly || undefined}
      className={composeRenderProps(className, (cn) =>
        buttonStyles({ variant, size, className: cn }),
      )}
      slot={slot}
      style={style}
      {...props}
    >
      {composeRenderProps(children, (children, { isPending }) => (
        <>
          {isPending && (
            <Loader
              data-slot="spinner"
              aria-label="loading"
              className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2"
              size={16}
            />
          )}
          {typeof children === "string" ? (
            <span className="truncate">{children}</span>
          ) : (
            children
          )}
        </>
      ))}
    </AriaButton>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface LinkButtonProps
  extends React.ComponentProps<typeof AriaLink>,
    VariantProps<typeof buttonStyles> {
  aspect?: "default" | "square" | "auto";
}

const LinkButton = (localProps: LinkButtonProps) => {
  const {
    variant,
    size,
    aspect = "auto",
    className,
    slot,
    style,
    children,
    ...props
  } = useContextProps(localProps);

  const isIconOnly = useButtonAspect(children, aspect);

  return (
    <AriaLink
      data-slot="button"
      data-button=""
      data-icon-only={isIconOnly || undefined}
      className={composeRenderProps(className, (cn) =>
        buttonStyles({ variant, size, className: cn }),
      )}
      slot={slot}
      style={style}
      {...props}
    >
      {composeRenderProps(children, (children) => (
        <>
          {typeof children === "string" ? (
            <span className="truncate">{children}</span>
          ) : (
            children
          )}
        </>
      ))}
    </AriaLink>
  );
};

/* -----------------------------------------------------------------------------------------------*/

export type { ButtonProps, LinkButtonProps };

export { Button, LinkButton, ButtonProvider, buttonStyles };
`,
					},
				],
				registryDependencies: ["loader", "focus-styles"],
			},
			ripple: {
				files: [
					{
						type: "registry:ui",
						path: "ui/button/ripple.tsx",
						target: "ui/button.tsx",
						content: `"use client";

import {
  Button as AriaButton,
  ButtonContext as AriaButtonContext,
  Link as AriaLink,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type * as React from "react";
import type { VariantProps } from "tailwind-variants";

import { useButtonAspect } from "@dotui/registry/hooks/use-button-aspect";
import { createVariantsContext } from "@dotui/registry/lib/context";
import { Loader } from "@dotui/registry/ui/loader";

const buttonStyles = tv({
  base: [
    "ripple relative box-border inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm leading-normal transition-[background-color,border-color,color,box-shadow] data-icon-only:px-0",
    "*:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2",
    // focus state
    "focus-reset focus-visible:focus-ring",
    // disabled state
    "disabled:cursor-default disabled:border-border-disabled disabled:bg-disabled disabled:text-fg-disabled",
    // pending state
    "pending:cursor-default pending:border-border-disabled pending:bg-disabled pending:text-transparent pending:**:not-data-[slot=spinner]:not-in-data-[slot=spinner]:opacity-0 pending:**:data-[slot=spinner]:text-fg-muted",
  ],
  variants: {
    variant: {
      default:
        "border pressed:border-border-active bg-neutral pressed:bg-neutral-active text-fg-on-neutral hover:border-border-hover hover:bg-neutral-hover",
      primary:
        "pending:border-0 bg-primary pressed:bg-primary-active text-fg-on-primary [--color-disabled:var(--neutral-500)] [--color-fg-disabled:var(--neutral-300)] hover:bg-primary-hover disabled:border-0",
      quiet: "bg-transparent pressed:bg-inverse/20 text-fg hover:bg-inverse/10",
      link: "text-fg underline-offset-4 hover:underline",
      warning:
        "bg-warning pressed:bg-warning-active text-fg-on-warning hover:bg-warning-hover",
      danger:
        "bg-danger pressed:bg-danger-active text-fg-on-danger hover:bg-danger-hover",
    },
    size: {
      sm: "h-8 px-3 data-icon-only:not-with-[size]:not-with-[w]:w-8 [&_svg]:size-4",
      md: "h-9 px-4 data-icon-only:not-with-[size]:not-with-[w]:w-9 [&_svg]:size-4",
      lg: "h-10 px-5 data-icon-only:not-with-[size]:not-with-[w]:w-10 [&_svg]:size-5",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

type ButtonVariants = VariantProps<typeof buttonStyles>;

const [ButtonProvider, useContextProps] = createVariantsContext<
  ButtonVariants,
  React.ComponentProps<typeof AriaButton>
>(AriaButtonContext);

/* -----------------------------------------------------------------------------------------------*/

interface ButtonProps
  extends React.ComponentProps<typeof AriaButton>,
    ButtonVariants {
  aspect?: "default" | "square" | "auto";
}

const Button = (localProps: ButtonProps) => {
  const {
    variant,
    size,
    aspect = "auto",
    className,
    slot,
    style,
    children,
    ...props
  } = useContextProps(localProps);

  const isIconOnly = useButtonAspect(children, aspect);

  return (
    <AriaButton
      data-slot="button"
      data-button=""
      data-icon-only={isIconOnly || undefined}
      className={composeRenderProps(className, (cn) =>
        buttonStyles({ variant, size, className: cn }),
      )}
      slot={slot}
      style={style}
      {...props}
    >
      {composeRenderProps(children, (children, { isPending }) => (
        <>
          {isPending && (
            <Loader
              data-slot="spinner"
              aria-label="loading"
              className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2"
              size={16}
            />
          )}
          {typeof children === "string" ? (
            <span className="truncate">{children}</span>
          ) : (
            children
          )}
        </>
      ))}
    </AriaButton>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface LinkButtonProps
  extends React.ComponentProps<typeof AriaLink>,
    VariantProps<typeof buttonStyles> {
  aspect?: "default" | "square" | "auto";
}

const LinkButton = (localProps: LinkButtonProps) => {
  const {
    variant,
    size,
    aspect = "auto",
    className,
    slot,
    style,
    children,
    ...props
  } = useContextProps(localProps);

  const isIconOnly = useButtonAspect(children, aspect);

  return (
    <AriaLink
      data-slot="button"
      data-button=""
      data-icon-only={isIconOnly || undefined}
      className={composeRenderProps(className, (cn) =>
        buttonStyles({ variant, size, className: cn }),
      )}
      slot={slot}
      style={style}
      {...props}
    >
      {composeRenderProps(children, (children) => (
        <>
          {typeof children === "string" ? (
            <span className="truncate">{children}</span>
          ) : (
            children
          )}
        </>
      ))}
    </AriaLink>
  );
};

/* -----------------------------------------------------------------------------------------------*/

export type { ButtonProps, LinkButtonProps };

export { Button, LinkButton, ButtonProvider, buttonStyles };
`,
					},
				],
			},
		},
	},
	{
		name: "calendar",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/calendar/basic.tsx",
						target: "ui/calendar.tsx",
						content: `"use client";

import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
  Calendar as AriaCalendar,
  CalendarCell as AriaCalendarCell,
  CalendarContext as AriaCalendarContext,
  CalendarGrid as AriaCalendarGrid,
  CalendarGridBody as AriaCalendarGridBody,
  CalendarGridHeader as AriaCalendarGridHeader,
  CalendarHeaderCell as AriaCalendarHeaderCell,
  Heading as AriaHeading,
  RangeCalendar as AriaRangeCalendar,
  RangeCalendarContext as AriaRangeCalendarContext,
  RangeCalendarStateContext as AriaRangeCalendarStateContext,
  composeRenderProps,
  useSlottedContext,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type {
  CalendarProps as AriaCalendarProps,
  RangeCalendarProps as AriaRangeCalendarProps,
  DateValue,
} from "react-aria-components";
import type { VariantProps } from "tailwind-variants";

import { Button } from "@dotui/registry/ui/button";

const calendarStyles = tv({
  slots: {
    root: "flex flex-col gap-4",
    header: "flex items-center justify-between gap-2",
    grid: "w-full border-collapse",
    gridHeader: "",
    gridHeaderCell: "font-normal text-fg-muted text-xs",
    gridBody: "",
  },
  variants: {
    standalone: {
      true: {
        root: "rounded-md border bg-bg p-3",
      },
    },
  },
});

const calendarCellStyles = tv({
  slots: {
    cellRoot:
      "flex outside-month:hidden items-center justify-center outline-none selection-end:rounded-r-md selection-start:rounded-l-md",
    cell: [
      "focus-reset focus-visible:focus-ring",
      "my-1 flex size-8 cursor-pointer unavailable:cursor-default items-center justify-center rounded-md pressed:bg-inverse/20 text-sm unavailable:text-fg-disabled unavailable:not-data-disabled:line-through transition-colors read-only:cursor-default hover:bg-inverse/10 hover:unavailable:bg-transparent hover:read-only:bg-transparent disabled:cursor-default disabled:bg-transparent disabled:text-fg-disabled",
    ],
  },
  variants: {
    variant: {
      primary: {},
      accent: {},
    },
    range: {
      true: {
        cellRoot:
          "selected: selected:bg-inverse/10 selected:invalid:bg-danger-muted selected:invalid:text-fg-danger",
        cell: "selection-end:invalid:bg-danger selection-start:invalid:bg-danger selection-end:invalid:text-fg-on-danger selection-start:invalid:text-fg-on-danger",
      },
      false: {
        cell: "selected:invalid:bg-danger selected:invalid:text-fg-on-danger",
      },
    },
  },
  compoundVariants: [
    {
      variant: "primary",
      range: false,
      className: {
        cell: "selected:bg-primary selected:text-fg-on-primary",
      },
    },
    {
      variant: "accent",
      range: false,
      className: {
        cell: "selected:bg-accent selected:text-fg-on-accent",
      },
    },
    {
      variant: "primary",
      range: true,
      className: {
        cell: "selection-end:bg-primary selection-start:bg-primary selection-end:text-fg-on-primary selection-start:text-fg-on-primary",
      },
    },
    {
      variant: "accent",
      range: true,
      className: {
        cell: "selection-end:bg-accent selection-start:bg-accent selection-end:text-fg-on-accent selection-start:text-fg-on-accent",
      },
    },
  ],
  defaultVariants: {
    variant: "accent",
  },
});

const { root, header, grid, gridHeader, gridHeaderCell, gridBody } =
  calendarStyles();

const { cellRoot, cell } = calendarCellStyles();

/* -----------------------------------------------------------------------------------------------*/

type CalendarProps<T extends DateValue> =
  | ({
      mode?: "single";
    } & AriaCalendarProps<T>)
  | ({
      mode: "range";
    } & AriaRangeCalendarProps<T>);

const Calendar = <T extends DateValue>({
  mode,
  className,
  ...props
}: CalendarProps<T>) => {
  const rangeCalendarContext = useSlottedContext(AriaRangeCalendarContext);
  const calendarContext = useSlottedContext(AriaCalendarContext);

  if (mode === "range" || rangeCalendarContext) {
    const standalone = Object.keys(rangeCalendarContext ?? {}).length === 0;
    return (
      <AriaRangeCalendar
        className={composeRenderProps(
          className as AriaRangeCalendarProps<T>["className"],
          (className) => root({ standalone, className }),
        )}
        {...(props as AriaRangeCalendarProps<T>)}
      >
        {composeRenderProps(
          props.children as AriaRangeCalendarProps<T>["children"],
          (children) =>
            children ?? (
              <>
                <CalendarHeader />
                <CalendarGrid />
              </>
            ),
        )}
      </AriaRangeCalendar>
    );
  }

  const standalone = !!calendarContext;
  return (
    <AriaCalendar
      className={composeRenderProps(
        className as AriaCalendarProps<T>["className"],
        (className) => root({ standalone, className }),
      )}
      {...(props as AriaCalendarProps<T>)}
    >
      {composeRenderProps(
        props.children as AriaCalendarProps<T>["children"],
        (children) =>
          children ?? (
            <>
              <CalendarHeader />
              <CalendarGrid />
            </>
          ),
      )}
    </AriaCalendar>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface CalendarHeaderProps extends React.ComponentProps<"header"> {}

const CalendarHeader = ({ className, ...props }: CalendarHeaderProps) => {
  return (
    <header className={header({ className })} {...props}>
      {props.children ?? (
        <>
          <Button slot="previous" variant="default" size="sm">
            <ChevronLeftIcon />
          </Button>
          <AriaHeading className="font-medium text-sm" />
          <Button slot="next" variant="default" size="sm">
            <ChevronRightIcon />
          </Button>
        </>
      )}
    </header>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface CalendarGridProps
  extends React.ComponentProps<typeof AriaCalendarGrid> {}

const CalendarGrid = ({ className, ...props }: CalendarGridProps) => {
  return (
    <AriaCalendarGrid className={grid({ className })} {...props}>
      {props.children ?? (
        <>
          <CalendarGridHeader>
            {(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
          </CalendarGridHeader>
          <CalendarGridBody>
            {(date) => <CalendarCell date={date} />}
          </CalendarGridBody>
        </>
      )}
    </AriaCalendarGrid>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface CalendarGridHeaderProps
  extends React.ComponentProps<typeof AriaCalendarGridHeader> {}
const CalendarGridHeader = ({
  className,
  ...props
}: CalendarGridHeaderProps) => {
  return (
    <AriaCalendarGridHeader className={gridHeader({ className })} {...props} />
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface CalendarHeaderCellProps
  extends React.ComponentProps<typeof AriaCalendarHeaderCell> {}
const CalendarHeaderCell = ({
  className,
  ...props
}: CalendarHeaderCellProps) => {
  return (
    <AriaCalendarHeaderCell
      className={gridHeaderCell({ className })}
      {...props}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface CalendarGridBodyProps
  extends React.ComponentProps<typeof AriaCalendarGridBody> {}
const CalendarGridBody = ({ className, ...props }: CalendarGridBodyProps) => {
  return (
    <AriaCalendarGridBody className={gridBody({ className })} {...props} />
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface CalendarCellProps
  extends React.ComponentProps<typeof AriaCalendarCell>,
    Omit<VariantProps<typeof calendarCellStyles>, "range"> {}
const CalendarCell = ({
  variant = "accent",
  children,
  className,
  ...props
}: CalendarCellProps) => {
  const rangeCalendarState = React.use(AriaRangeCalendarStateContext);
  const range = !!rangeCalendarState;

  return (
    <AriaCalendarCell
      {...props}
      className={composeRenderProps(className, (className) =>
        cellRoot({
          range,
          variant,
          className,
        }),
      )}
    >
      {composeRenderProps(
        children,
        (
          _,
          {
            isSelected,
            isFocused,
            isHovered,
            isPressed,
            isUnavailable,
            isDisabled,
            isFocusVisible,
            isInvalid,
            isOutsideMonth,
            isOutsideVisibleRange,
            isSelectionEnd,
            isSelectionStart,
            formattedDate,
          },
        ) => (
          <span
            data-slot="calendar-cell"
            data-rac=""
            data-focused={isFocused || undefined}
            data-selected={isSelected || undefined}
            data-hovered={isHovered || undefined}
            data-pressed={isPressed || undefined}
            data-unavailable={isUnavailable || undefined}
            data-disabled={isDisabled || undefined}
            data-focus-visible={isFocusVisible || undefined}
            data-invalid={isInvalid || undefined}
            data-outside-month={isOutsideMonth || undefined}
            data-outside-visible-range={isOutsideVisibleRange || undefined}
            data-selection-end={isSelectionEnd || undefined}
            data-selection-start={isSelectionStart || undefined}
            className={cell({
              range,
              variant,
            })}
          >
            {formattedDate}
          </span>
        ),
      )}
    </AriaCalendarCell>
  );
};

export {
  Calendar,
  CalendarHeader,
  CalendarGrid,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarGridBody,
  CalendarCell,
  calendarStyles,
};

export type {
  CalendarProps,
  CalendarHeaderProps,
  CalendarGridProps,
  CalendarGridHeaderProps,
  CalendarHeaderCellProps,
  CalendarGridBodyProps,
  CalendarCellProps,
};
`,
					},
				],
				registryDependencies: ["button", "text", "focus-styles"],
			},
		},
	},
	{
		name: "card",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/card/basic.tsx",
						target: "ui/card.tsx",
						content: `import { tv } from "tailwind-variants";
import type * as React from "react";

const cardStyles = tv({
  slots: {
    root: "flex flex-col gap-6 rounded-xl border bg-card py-6 text-fg shadow-sm",
    header:
      "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
    title: "font-semibold leading-none",
    description: "text-fg-muted text-sm",
    action: "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
    content: "flex-1 px-6",
    footer: "flex items-center px-6 [.border-t]:pt-6",
  },
});

const { root, header, title, description, action, content, footer } =
  cardStyles();

/* -----------------------------------------------------------------------------------------------*/

interface CardProps extends React.ComponentProps<"div"> {}

function Card({ className, ...props }: CardProps) {
  return <div data-slot="card" className={root({ className })} {...props} />;
}

/* -----------------------------------------------------------------------------------------------*/

interface CardHeaderProps extends React.ComponentProps<"div"> {}

function CardHeader({ className, ...props }: CardHeaderProps) {
  return (
    <div data-slot="card-header" className={header({ className })} {...props} />
  );
}

/* -----------------------------------------------------------------------------------------------*/

interface CardTitleProps extends React.ComponentProps<"div"> {}

function CardTitle({ className, ...props }: CardTitleProps) {
  return (
    <div data-slot="card-title" className={title({ className })} {...props} />
  );
}

/* -----------------------------------------------------------------------------------------------*/

interface CardDescriptionProps extends React.ComponentProps<"div"> {}

function CardDescription({ className, ...props }: CardDescriptionProps) {
  return (
    <div
      data-slot="card-description"
      className={description({ className })}
      {...props}
    />
  );
}

/* -----------------------------------------------------------------------------------------------*/

interface CardActionProps extends React.ComponentProps<"div"> {}

function CardAction({ className, ...props }: CardActionProps) {
  return (
    <div data-slot="card-action" className={action({ className })} {...props} />
  );
}

/* -----------------------------------------------------------------------------------------------*/

interface CardContentProps extends React.ComponentProps<"div"> {}

function CardContent({ className, ...props }: CardContentProps) {
  return (
    <div
      data-slot="card-content"
      className={content({ className })}
      {...props}
    />
  );
}

/* -----------------------------------------------------------------------------------------------*/

interface CardFooterProps extends React.ComponentProps<"div"> {}

function CardFooter({ className, ...props }: CardFooterProps) {
  return (
    <div data-slot="card-footer" className={footer({ className })} {...props} />
  );
}

/* -----------------------------------------------------------------------------------------------*/

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};

export type {
  CardProps,
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardActionProps,
  CardContentProps,
  CardFooterProps,
};
`,
					},
				],
				registryDependencies: ["button", "text", "focus-styles"],
			},
		},
	},
	{
		name: "checkbox-group",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/checkbox-group/basic.tsx",
						target: "ui/checkbox-group.tsx",
						content: `"use client";

import {
  CheckboxGroup as AriaCheckboxGroup,
  composeRenderProps,
} from "react-aria-components";
import type { CheckboxGroupProps } from "react-aria-components";

import { fieldStyles } from "@dotui/registry/ui/field";

const { field } = fieldStyles();

const CheckboxGroup = ({ className, ...props }: CheckboxGroupProps) => {
  return (
    <AriaCheckboxGroup
      className={composeRenderProps(className, (className) =>
        field({ className }),
      )}
      {...props}
    />
  );
};

export type { CheckboxGroupProps };
export { CheckboxGroup };
`,
					},
				],
				registryDependencies: ["field", "checkbox"],
			},
		},
	},
	{
		name: "checkbox",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/checkbox/basic.tsx",
						target: "ui/checkbox.tsx",
						content: `"use client";

import { CheckIcon, MinusIcon } from "lucide-react";
import {
  Checkbox as AriaCheckbox,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type * as React from "react";
import type { CheckboxRenderProps } from "react-aria-components";

import { createContext } from "@dotui/registry/lib/context";
import { cn } from "@dotui/registry/lib/utils";

const checkboxStyles = tv({
  slots: {
    root: [
      "focus-reset focus-visible:focus-ring",
      "flex items-center gap-2 text-sm leading-none has-data-[slot=description]:items-start",
      "disabled:cursor-not-allowed disabled:text-fg-disabled",
    ],
    indicator: [
      "flex size-4 shrink-0 items-center justify-center rounded-sm border border-border-control bg-transparent text-transparent",
      "transition-[background-color,border-color,box-shadow,color] duration-75",
      // selected state
      "selected:border-transparent selected:bg-primary selected:text-fg-on-primary",
      // read-only state
      "read-only:cursor-default",
      // disabled state
      "disabled:cursor-not-allowed disabled:border-border-disabled selected:disabled:bg-disabled selected:disabled:text-fg-disabled indeterminate:disabled:bg-disabled",
      // invalid state
      "invalid:border-border-danger invalid:selected:bg-danger-muted invalid:selected:text-fg-onMutedDanger",
      // indeterminate state
      "indeterminate:border-transparent indeterminate:bg-primary indeterminate:text-fg-on-primary",
    ],
  },
});

const { root, indicator } = checkboxStyles();

const [InternalCheckboxProvider, useInternalCheckbox] =
  createContext<CheckboxRenderProps>({
    strict: true,
  });

/* -----------------------------------------------------------------------------------------------*/

interface CheckboxProps extends React.ComponentProps<typeof AriaCheckbox> {}

const Checkbox = ({ className, ...props }: CheckboxProps) => {
  return (
    <AriaCheckbox
      data-slot="checkbox"
      className={composeRenderProps(className, (className) =>
        props.children
          ? root({ className })
          : indicator({
              className: cn(className, "focus-reset focus-visible:focus-ring"),
            }),
      )}
      {...props}
    >
      {composeRenderProps(props.children, (children, renderProps) => {
        return children ? (
          <InternalCheckboxProvider value={renderProps}>
            {children}
          </InternalCheckboxProvider>
        ) : renderProps.isIndeterminate ? (
          <MinusIcon className="size-3" />
        ) : (
          <CheckIcon className="size-3" />
        );
      })}
    </AriaCheckbox>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface CheckboxIndicatorProps extends React.ComponentProps<"div"> {}

const CheckboxIndicator = ({ className, ...props }: CheckboxIndicatorProps) => {
  const ctx = useInternalCheckbox("CheckboxIndicator");
  return (
    <div
      data-rac=""
      data-selected={ctx.isSelected || undefined}
      data-indeterminate={ctx.isIndeterminate || undefined}
      data-pressed={ctx.isPressed || undefined}
      data-hovered={ctx.isHovered || undefined}
      data-focused={ctx.isFocused || undefined}
      data-focus-visible={ctx.isFocusVisible || undefined}
      data-disabled={ctx.isDisabled || undefined}
      data-readonly={ctx.isReadOnly || undefined}
      data-invalid={ctx.isInvalid || undefined}
      data-required={ctx.isRequired || undefined}
      className={indicator({ className })}
      {...props}
    >
      {ctx.isIndeterminate ? (
        <MinusIcon className="size-2.5" />
      ) : (
        <CheckIcon className="size-3" />
      )}
    </div>
  );
};

/* -----------------------------------------------------------------------------------------------*/

export { Checkbox, CheckboxIndicator };

export type { CheckboxProps, CheckboxIndicatorProps };
`,
					},
				],
				registryDependencies: ["focus-styles"],
			},
		},
	},
	{
		name: "color-area",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/color-area/basic.tsx",
						target: "ui/color-area.tsx",
						content: `"use client";

import {
  ColorArea as AriaColorArea,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

import { ColorThumb } from "@dotui/registry/ui/color-thumb";

const colorAreaStyles = tv({
  base: "block size-48 min-w-20 rounded-md disabled:[background:var(--color-disabled)]!",
});

/* -----------------------------------------------------------------------------------------------*/

type ColorAreaProps = React.ComponentProps<typeof AriaColorArea>;

const ColorArea = ({ className, ...props }: ColorAreaProps) => {
  return (
    <AriaColorArea
      className={composeRenderProps(className, (className) =>
        colorAreaStyles({ className }),
      )}
      {...props}
    >
      {props.children || <ColorThumb />}
    </AriaColorArea>
  );
};

/* -----------------------------------------------------------------------------------------------*/

export { ColorArea };

export type { ColorAreaProps };
`,
					},
				],
				registryDependencies: ["color-thumb"],
			},
		},
	},
	{
		name: "color-editor",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/color-editor/basic.tsx",
						target: "ui/color-editor.tsx",
						content: `import React from "react";
import { getColorChannels } from "react-aria-components";

import { cn } from "@dotui/registry/lib/utils";
import { ColorArea } from "@dotui/registry/ui/color-area";
import { ColorField } from "@dotui/registry/ui/color-field";
import { ColorSlider } from "@dotui/registry/ui/color-slider";
import { Input } from "@dotui/registry/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@dotui/registry/ui/select";

type ColorFormat = "hex" | "rgb" | "hsl" | "hsb";

interface ColorEditorProps extends React.ComponentProps<"div"> {
  colorFormat?: ColorFormat;
  showAlphaChannel?: boolean;
  showFormatSelector?: boolean;
}

const ColorEditor = ({
  colorFormat: ColorFormatProp = "hex",
  showAlphaChannel = false,
  showFormatSelector = true,
  className,
  ...props
}: ColorEditorProps) => {
  const [colorFormat, setColorFormat] =
    React.useState<ColorFormat>(ColorFormatProp);

  return (
    <div className={cn("mx-auto flex flex-col gap-2", className)} {...props}>
      <div className="flex gap-2">
        <ColorArea
          colorSpace="hsb"
          xChannel="saturation"
          yChannel="brightness"
        />
        <ColorSlider
          defaultValue="#000000"
          orientation="vertical"
          colorSpace="hsb"
          channel="hue"
        />
        {showAlphaChannel && (
          <ColorSlider
            defaultValue="#000000"
            orientation="vertical"
            colorSpace="hsb"
            channel="alpha"
          />
        )}
      </div>
      <div
        className={cn(
          "flex flex-col gap-2",
          colorFormat === "hex" && "flex-row",
        )}
      >
        {showFormatSelector && (
          <Select
            aria-label="Color format"
            value={colorFormat}
            onChange={(key) => setColorFormat(key as ColorFormat)}
            className={cn("w-auto", colorFormat === "hex" && "flex-1")}
          >
            <SelectTrigger size="sm" className="w-full" />
            <SelectContent>
              <SelectItem id="hex">Hex</SelectItem>
              <SelectItem id="rgb">RGB</SelectItem>
              <SelectItem id="hsl">HSL</SelectItem>
              <SelectItem id="hsb">HSB</SelectItem>
            </SelectContent>
          </Select>
        )}
        <div className="flex flex-1 items-center gap-2">
          {colorFormat === "hex" ? (
            <ColorField aria-label="Hex" className="w-10 flex-1">
              <Input size="sm" className="w-full" />
            </ColorField>
          ) : (
            getColorChannels(colorFormat).map((channel) => (
              <ColorField
                key={channel}
                colorSpace={colorFormat}
                channel={channel}
                className="w-10 flex-1"
              >
                <Input size="sm" className="w-full" />
              </ColorField>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export { ColorEditor };
export type { ColorEditorProps };
`,
					},
				],
				registryDependencies: ["color-area", "color-slider", "select"],
			},
		},
	},
	{
		name: "color-field",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/color-field/basic.tsx",
						target: "ui/color-field.tsx",
						content: `"use client";

import {
  ColorField as AriaColorField,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type * as React from "react";

import { fieldStyles } from "@dotui/registry/ui/field/basic";

const colorFieldStyles = tv({
  base: [fieldStyles().field({ orientation: "vertical" }), ""],
});

interface ColorFieldProps extends React.ComponentProps<typeof AriaColorField> {}

const ColorField = ({ className, ...props }: ColorFieldProps) => {
  return (
    <AriaColorField
      className={composeRenderProps(className, (className) =>
        colorFieldStyles({ className }),
      )}
      {...props}
    />
  );
};

export { ColorField };
export type { ColorFieldProps };
`,
					},
				],
				registryDependencies: ["field", "input"],
			},
		},
	},
	{
		name: "color-picker",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/color-picker/basic.tsx",
						target: "ui/color-picker.tsx",
						content: `"use client";

import { useContext } from "react";
import {
  ColorPicker as AriaColorPicker,
  ColorPickerStateContext as AriaColorPickerStateContext,
  composeRenderProps,
} from "react-aria-components";
import type {
  ColorPickerProps as AriaColorPickerProps,
  ColorPickerState,
} from "react-aria-components";

import { Button } from "@dotui/registry/ui/button";
import { ColorSwatch } from "@dotui/registry/ui/color-swatch";
import { Dialog, DialogContent } from "@dotui/registry/ui/dialog";
import { Overlay } from "@dotui/registry/ui/overlay";
import type { ButtonProps } from "@dotui/registry/ui/button";
import type {
  DialogContentProps,
  DialogProps,
} from "@dotui/registry/ui/dialog";

interface ColorPickerProps
  extends AriaColorPickerProps,
    Omit<DialogProps, "children"> {}

const ColorPicker = ({
  defaultOpen,
  isOpen,
  onOpenChange,
  ...props
}: ColorPickerProps) => {
  return (
    <AriaColorPicker {...props}>
      {composeRenderProps(props.children, (children) => (
        <Dialog
          defaultOpen={defaultOpen}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        >
          {children}
        </Dialog>
      ))}
    </AriaColorPicker>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface ColorPickerTriggerProps extends Omit<ButtonProps, "children"> {
  children?: React.ReactNode | ((props: ColorPickerState) => React.ReactNode);
}

const ColorPickerTrigger = ({
  children,
  ...props
}: ColorPickerTriggerProps) => {
  const state = useContext(AriaColorPickerStateContext)!;
  return (
    <Button {...props}>
      {children ? (
        typeof children === "function" ? (
          children(state)
        ) : (
          children
        )
      ) : (
        <>
          <ColorSwatch />
          <span className="truncate">{state.color.toString("hex")}</span>
        </>
      )}
    </Button>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface ColorPickerContentProps extends DialogContentProps {}
const ColorPickerContent = ({
  children,
  ...props
}: ColorPickerContentProps) => {
  return (
    <Overlay type="popover">
      <DialogContent {...props}>{children}</DialogContent>
    </Overlay>
  );
};

/* -----------------------------------------------------------------------------------------------*/

export { ColorPicker, ColorPickerTrigger, ColorPickerContent };
export type {
  ColorPickerProps,
  ColorPickerTriggerProps,
  ColorPickerContentProps,
};
`,
					},
				],
				registryDependencies: [
					"button",
					"color-area",
					"color-field",
					"color-slider",
					"color-swatch",
					"dialog",
					"select",
				],
			},
		},
	},
	{
		name: "color-slider",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/color-slider/basic.tsx",
						target: "ui/color-slider.tsx",
						content: `"use client";

import { useSlotId } from "@react-aria/utils";
import {
  ColorSlider as AriaColorSlider,
  SliderOutput as AriaSliderOutput,
  SliderTrack as AriaSliderTrack,
  composeRenderProps,
  Provider,
  TextContext,
} from "react-aria-components";
import { tv } from "tailwind-variants";

import { ColorThumb } from "@dotui/registry/ui/color-thumb";

const colorSliderStyles = tv({
  slots: {
    root: "flex flex-col gap-2",
    output: "text-fg-muted text-sm",
    track:
      "relative rounded-md before:absolute before:inset-0 before:z-[-1] before:rounded-[inherit] before:bg-[repeating-conic-gradient(#e6e6e6_0%_25%,#fff_0%_50%)] before:bg-center before:bg-size-[16px_16px] before:content-[''] orientation-horizontal:**:data-[slot=color-thumb]:top-1/2 orientation-vertical:**:data-[slot=color-thumb]:left-1/2 disabled:[background:var(--color-disabled)]!",
  },
  variants: {
    orientation: {
      horizontal: {
        root: "w-48",
        track: "h-6 w-full",
      },
      vertical: {
        root: "h-48 items-center",
        track: "w-6 flex-1",
      },
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

const { root, track, output } = colorSliderStyles();

/* -----------------------------------------------------------------------------------------------*/

interface ColorSliderProps
  extends React.ComponentProps<typeof AriaColorSlider> {}

const ColorSlider = ({ className, ...props }: ColorSliderProps) => {
  const descriptionId = useSlotId();
  return (
    <Provider
      values={[[TextContext, { slot: "description", id: descriptionId }]]}
    >
      <AriaColorSlider
        className={composeRenderProps(className, (cn, { orientation }) =>
          root({ orientation, className: cn }),
        )}
        aria-describedby={descriptionId}
        {...props}
      >
        {props.children ?? <ColorSliderControl />}
      </AriaColorSlider>
    </Provider>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface ColorSliderControlProps
  extends React.ComponentProps<typeof AriaSliderTrack> {}

const ColorSliderControl = ({
  className,
  ...props
}: ColorSliderControlProps) => {
  return (
    <AriaSliderTrack
      data-slot="color-slider-control"
      className={composeRenderProps(className, (cn, { orientation }) =>
        track({ orientation, className: cn }),
      )}
      {...props}
    >
      {props.children ?? <ColorThumb />}
    </AriaSliderTrack>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface ColorSliderOutputProps
  extends React.ComponentProps<typeof AriaSliderOutput> {}

const ColorSliderOutput = ({ className, ...props }: ColorSliderOutputProps) => {
  return (
    <AriaSliderOutput
      className={composeRenderProps(className, (className) =>
        output({ className }),
      )}
      {...props}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

export { ColorSlider, ColorSliderControl, ColorSliderOutput };

export type {
  ColorSliderProps,
  ColorSliderControlProps,
  ColorSliderOutputProps,
};
`,
					},
				],
				registryDependencies: ["field", "color-thumb"],
			},
		},
	},
	{
		name: "color-swatch-picker",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/color-swatch-picker/basic.tsx",
						target: "ui/color-swatch-picker.tsx",
						content: `"use client";

import {
  ColorSwatchPicker as AriaColorSwatchPicker,
  ColorSwatchPickerItem as AriaColorSwatchPickerItem,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type React from "react";

import { ColorSwatch } from "@dotui/registry/ui/color-swatch";

const colorSwatchPickerStyles = tv({
  slots: {
    root: "flex flex-wrap gap-1",
    item: [
      "relative size-8 rounded-md transition-shadow focus:z-10 *:data-[slot=color-swatch]:size-full *:data-[slot=color-swatch]:rounded-[inherit]",
      // focus state
      "focus-reset focus-visible:focus-ring",
      // disabled state
      "disabled:cursor-not-allowed disabled:*:data-[slot=color-swatch]:[background:color-mix(in_oklab,var(--color-disabled)_90%,var(--color))]!",
      // selected state
      "before:absolute before:inset-0 before:scale-90 selected:before:scale-100 before:rounded-[inherit] before:bg-bg before:opacity-0 selected:before:opacity-100 before:outline-2 before:outline-inverse before:transition-[opacity,scale] before:duration-100 before:content-['']",
    ],
  },
});

const { root, item } = colorSwatchPickerStyles();

/* -----------------------------------------------------------------------------------------------*/

interface ColorSwatchPickerProps
  extends React.ComponentProps<typeof AriaColorSwatchPicker> {}

const ColorSwatchPicker = ({ className, ...props }: ColorSwatchPickerProps) => {
  return (
    <AriaColorSwatchPicker
      className={composeRenderProps(className, (className) =>
        root({ className }),
      )}
      {...props}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface ColorSwatchPickerItemProps
  extends React.ComponentProps<typeof AriaColorSwatchPickerItem> {}
const ColorSwatchPickerItem = ({
  className,
  style,
  ...props
}: ColorSwatchPickerItemProps) => {
  return (
    <AriaColorSwatchPickerItem
      className={composeRenderProps(className, (className) =>
        item({ className }),
      )}
      style={composeRenderProps(
        style,
        (style, { color }) =>
          ({
            "--color": color.toString(),
            ...style,
          }) as React.CSSProperties,
      )}
      {...props}
    >
      <ColorSwatch className="size-full rounded-[inherit]" />
    </AriaColorSwatchPickerItem>
  );
};

/* -----------------------------------------------------------------------------------------------*/

const CompoundColorSwatchPicker = Object.assign(ColorSwatchPicker, {
  Item: ColorSwatchPickerItem,
});

export type { ColorSwatchPickerProps, ColorSwatchPickerItemProps };
export {
  CompoundColorSwatchPicker as ColorSwatchPicker,
  ColorSwatchPickerItem,
};
`,
					},
				],
				registryDependencies: ["focus-styles", "color-swatch"],
			},
		},
	},
	{
		name: "color-swatch",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/color-swatch/basic.tsx",
						target: "ui/color-swatch.tsx",
						content: `"use client";

import {
  ColorSwatch as AriaColorSwatch,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const colorSwatchStyles = tv({
  base: "relative size-5 rounded-sm border",
});

interface ColorSwatchProps
  extends React.ComponentProps<typeof AriaColorSwatch> {}
const ColorSwatch = ({ className, style, ...props }: ColorSwatchProps) => {
  return (
    <AriaColorSwatch
      data-slot="color-swatch"
      className={composeRenderProps(className, (className) =>
        colorSwatchStyles({ className }),
      )}
      style={composeRenderProps(style, (style, { color }) => ({
        ...style,
        background: \`linear-gradient(\${color}, \${color}),
        repeating-conic-gradient(#CCC 0% 25%, white 0% 50%) 50% / 16px 16px\`,
      }))}
      {...props}
    />
  );
};

export type { ColorSwatchProps };
export { ColorSwatch };
`,
					},
				],
			},
		},
	},
	{
		name: "color-thumb",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/color-thumb/basic.tsx",
						target: "ui/color-thumb.tsx",
						content: `"use client";

import { ColorThumb as AriaColorThumb } from "react-aria-components";
import { tv } from "tailwind-variants";
import type { ColorThumbProps as AriaColorThumbProps } from "react-aria-components";

const colorThumbStyles = tv({
  base: [
    "focus-reset focus-visible:focus-ring",
    "z-30 size-6 rounded-full border-2 border-white ring-1 ring-black/40 disabled:border-border-disabled disabled:bg-disabled!",
    "group-orientation-horizontal/color-slider:top-1/2 group-orientation-vertical/color-slider:left-1/2",
  ],
});

interface ColorThumbProps extends Omit<AriaColorThumbProps, "className"> {
  className?: string;
}
const ColorThumb = ({ className, ...props }: ColorThumbProps) => {
  return (
    <AriaColorThumb
      data-slot="color-thumb"
      className={colorThumbStyles({ className })}
      {...props}
    />
  );
};

export type { ColorThumbProps };
export { ColorThumb };
`,
					},
				],
				registryDependencies: ["focus-styles"],
			},
		},
	},
	{
		name: "combobox",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/combobox/basic.tsx",
						target: "ui/combobox.tsx",
						content: `"use client";

import React from "react";
import { useResizeObserver } from "@react-aria/utils";
import { ChevronDownIcon } from "lucide-react";
import { mergeProps } from "react-aria";
import {
  ComboBox as AriaCombobox,
  GroupContext as AriaGroupContext,
  PopoverContext as AriaPopoverContext,
  composeRenderProps,
  Provider,
} from "react-aria-components";
import type { ComboBoxProps as AriaComboboxProps } from "react-aria-components";

import { cn } from "@dotui/registry/lib/utils";
import { Button } from "@dotui/registry/ui/button";
import { fieldStyles } from "@dotui/registry/ui/field";
import { Input, InputAddon, InputGroup } from "@dotui/registry/ui/input";
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
  ListBoxVirtualizer,
} from "@dotui/registry/ui/list-box";
import { Popover } from "@dotui/registry/ui/popover";
import type { InputGroupProps } from "@dotui/registry/ui/input";
import type { ListBoxProps } from "@dotui/registry/ui/list-box";
import type { PopoverProps } from "@dotui/registry/ui/popover";

/* -----------------------------------------------------------------------------------------------*/

interface ComboboxProps<T extends object>
  extends Omit<AriaComboboxProps<T>, "className"> {
  className?: string;
}
const Combobox = <T extends object>({
  menuTrigger = "focus",
  className,
  ...props
}: ComboboxProps<T>) => {
  return (
    <AriaCombobox
      menuTrigger={menuTrigger}
      className={fieldStyles().field({
        className: cn(className),
      })}
      {...props}
    >
      {composeRenderProps(props.children, (children) => (
        <ComboboxInner>{children}</ComboboxInner>
      ))}
    </AriaCombobox>
  );
};

/* -----------------------------------------------------------------------------------------------*/

/**
 *  This abstraction allows the Combobox to work with InputGroup and
 *  sync the trigger width with the popover dropdown.
 */

const ComboboxInner = ({ children }: { children: React.ReactNode }) => {
  const [menuWidth, setMenuWidth] = React.useState<string | undefined>(
    undefined,
  );

  const groupProps = React.use(AriaGroupContext);
  const popoverProps = React.use(AriaPopoverContext);
  const triggerRef = React.useRef<HTMLDivElement>(null);

  const onResize = React.useCallback(() => {
    if (triggerRef.current) {
      const triggerWidth = triggerRef.current.getBoundingClientRect().width;
      setMenuWidth(\`\${triggerWidth}px\`);
    }
  }, []);

  useResizeObserver({
    ref: triggerRef,
    onResize: onResize,
  });

  return (
    <Provider
      values={[
        [AriaGroupContext, mergeProps(groupProps, { ref: triggerRef })],
        [
          AriaPopoverContext,
          triggerRef.current
            ? {
                ...mergeProps(popoverProps, {
                  style: {
                    "--trigger-width": menuWidth,
                  } as React.CSSProperties,
                }),
                triggerRef,
              }
            : popoverProps,
        ],
      ]}
    >
      {children}
    </Provider>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface ComboboxInputProps extends InputGroupProps {
  placeholder?: string;
}

const ComboboxInput = ({ placeholder, ...props }: ComboboxInputProps) => {
  return (
    <InputGroup {...props}>
      <Input placeholder={placeholder} />
      <InputAddon>
        <Button variant="quiet">
          <ChevronDownIcon />
        </Button>
      </InputAddon>
    </InputGroup>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface ComboboxContentProps<T extends object>
  extends ListBoxProps<T>,
    Pick<
      PopoverProps,
      "placement" | "defaultOpen" | "isOpen" | "onOpenChange"
    > {
  virtulized?: boolean;
}

const ComboboxContent = <T extends object>({
  virtulized,
  placement,
  defaultOpen,
  isOpen,
  onOpenChange,
  ...props
}: ComboboxContentProps<T>) => {
  if (virtulized) {
    return (
      <Popover
        placement={placement}
        defaultOpen={defaultOpen}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className="w-auto overflow-hidden p-0"
      >
        <ListBoxVirtualizer>
          <ListBox {...props} className="h-80 w-48 overflow-y-auto p-0" />
        </ListBoxVirtualizer>
      </Popover>
    );
  }

  return (
    <Popover placement={placement}>
      <ListBox {...props} />
    </Popover>
  );
};

/* -----------------------------------------------------------------------------------------------*/

export {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ListBoxItem as ComboboxItem,
  ListBoxSection as ComboboxSection,
  ListBoxSectionHeader as ComboboxSectionHeader,
};

export type { ComboboxProps, ComboboxInputProps, ComboboxContentProps };
`,
					},
				],
				registryDependencies: ["field", "button", "input", "list-box", "overlay"],
			},
		},
	},
	{
		name: "command",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/command/basic.tsx",
						target: "ui/command.tsx",
						content: `"use client";

import { SearchIcon } from "lucide-react";
import {
  Autocomplete as AriaAutocomplete,
  useFilter,
} from "react-aria-components";
import { tv } from "tailwind-variants";

import { Input, InputAddon, InputGroup } from "@dotui/registry/ui/input";
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
  ListBoxVirtualizer,
} from "@dotui/registry/ui/list-box";
import { SearchField } from "@dotui/registry/ui/search-field";
import type { ListBoxProps } from "@dotui/registry/ui/list-box";
import type { PopoverProps } from "@dotui/registry/ui/popover";
import type { SearchFieldProps } from "@dotui/registry/ui/search-field";

const commandStyles = tv({
  slots: {
    base: [
      "in-drawer:rounded-[inherit] in-modal:rounded-[inherit] in-popover:rounded-[inherit] rounded-lg not-in-popover:not-in-modal:not-in-drawer:border not-in-popover:not-in-modal:not-in-drawer:bg-card",
      "**:data-[slot=list-box]:w-full **:data-[slot=list-box]:border-0 **:data-[slot=list-box]:bg-transparent",
      "**:data-[slot=search-field]:w-full **:data-[slot=search-field]:outline-none [&_[data-slot=search-field]_[data-slot=input-group]]:rounded-b-none [&_[data-slot=search-field]_[data-slot=input-group]]:border-0 [&_[data-slot=search-field]_[data-slot=input-group]]:border-b [&_[data-slot=search-field]_[data-slot=input-group]]:bg-transparent",
      "in-modal:w-full",
    ],
  },
});

const { base } = commandStyles();

/* -----------------------------------------------------------------------------------------------*/

interface CommandProps extends React.ComponentProps<"div"> {}

function Command({ className, ...props }: CommandProps) {
  const { contains } = useFilter({
    sensitivity: "base",
    ignorePunctuation: true,
  });

  return (
    <AriaAutocomplete filter={contains}>
      <div {...props} className={base({ className })}></div>
    </AriaAutocomplete>
  );
}

/* -----------------------------------------------------------------------------------------------*/

interface CommandInputProps extends SearchFieldProps {
  placeholder?: string;
}

const CommandInput = ({ placeholder, ...props }: CommandInputProps) => {
  return (
    <SearchField {...props}>
      {/* TODO: Remove this */}
      <InputGroup className="w-full">
        <InputAddon>
          <SearchIcon />
        </InputAddon>
        <Input placeholder={placeholder} />
      </InputGroup>
    </SearchField>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface CommandContentProps<T extends object> extends ListBoxProps<T> {
  placement?: PopoverProps["placement"];
  virtulized?: boolean;
}

const CommandContent = <T extends object>({
  virtulized,
  placement,
  ...props
}: CommandContentProps<T>) => {
  if (virtulized) {
    return (
      <ListBoxVirtualizer>
        <ListBox {...props} className="h-80 w-48 overflow-y-auto p-0" />
      </ListBoxVirtualizer>
    );
  }

  return <ListBox {...props} />;
};

/* -----------------------------------------------------------------------------------------------*/

export {
  Command,
  CommandInput,
  CommandContent,
  ListBoxItem as CommandItem,
  ListBoxSection as CommandSection,
  ListBoxSectionHeader as CommandSectionHeader,
};

export type { CommandProps, CommandContentProps, CommandInputProps };
`,
					},
				],
			},
		},
	},
	{
		name: "date-field",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/date-field/basic.tsx",
						target: "ui/date-field.tsx",
						content: `"use client";

import {
  DateField as AriaDateField,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type {
  DateFieldProps as AriaDateFieldProps,
  DateValue,
} from "react-aria-components";

import { fieldStyles } from "@dotui/registry/ui/field";

const dateFieldStyles = tv({
  base: [fieldStyles().field({ orientation: "vertical" })],
});

/* -----------------------------------------------------------------------------------------------*/

interface DateFieldProps<T extends DateValue> extends AriaDateFieldProps<T> {}

const DateField = <T extends DateValue>({
  className,
  ...props
}: DateFieldProps<T>) => {
  return (
    <AriaDateField
      className={composeRenderProps(className, (className) =>
        dateFieldStyles({ className }),
      )}
      {...props}
    />
  );
};

export type { DateFieldProps };
export { DateField };
`,
					},
				],
				registryDependencies: ["field", "input"],
			},
		},
	},
	{
		name: "date-picker",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/date-picker/basic.tsx",
						target: "ui/date-picker.tsx",
						content: `"use client";

import { useContext } from "react";
import { CalendarIcon } from "lucide-react";
import {
  DateRangePicker as AriaDataRangePicker,
  DatePicker as AriaDatePicker,
  RangeCalendarContext as AriaRangeCalendarContext,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type {
  DateRangePickerProps as AriaDataRangePickerProps,
  DatePickerProps as AriaDatePickerProps,
  DateValue,
} from "react-aria-components";

import { Button } from "@dotui/registry/ui/button";
import {
  DialogContent,
  type DialogContentProps,
} from "@dotui/registry/ui/dialog";
import { DateInput, InputAddon, InputGroup } from "@dotui/registry/ui/input";
import { Overlay, type OverlayProps } from "@dotui/registry/ui/overlay";
import type { InputGroupProps } from "@dotui/registry/ui/input";

const datePickerStyles = tv({
  base: "flex flex-col items-start gap-2",
});

type DatePickerProps<T extends DateValue> =
  | ({
      mode?: "single";
    } & AriaDatePickerProps<T>)
  | ({
      mode: "range";
    } & AriaDataRangePickerProps<T>);

const DatePicker = <T extends DateValue>({
  mode = "single",
  className,
  ...props
}: DatePickerProps<T>) => {
  if (mode === "range") {
    return (
      <AriaDataRangePicker
        className={composeRenderProps(
          className as AriaDataRangePickerProps<T>["className"],
          (className) => datePickerStyles({ className }),
        )}
        {...(props as AriaDataRangePickerProps<T>)}
      />
    );
  }

  return (
    <AriaDatePicker
      className={composeRenderProps(
        className as AriaDatePickerProps<T>["className"],
        (className) => datePickerStyles({ className }),
      )}
      {...(props as AriaDatePickerProps<T>)}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface DatePickerInputProps extends InputGroupProps {}

const DatePickerInput = (props: DatePickerInputProps) => {
  const rangeCalendarContext = useContext(AriaRangeCalendarContext);
  const mode = rangeCalendarContext ? "range" : "single";

  return (
    <InputGroup {...props}>
      {mode === "single" ? (
        <DateInput />
      ) : (
        <>
          <DateInput slot="start" />
          <span>–</span>
          <DateInput slot="end" />
        </>
      )}
      <InputAddon>
        <Button>
          <CalendarIcon />
        </Button>
      </InputAddon>
    </InputGroup>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface DatePickerContentProps
  extends DialogContentProps,
    Pick<OverlayProps, "type" | "mobileType" | "popoverProps"> {}

const DatePickerContent = ({
  children,
  type = "popover",
  mobileType,
  popoverProps,
  ...props
}: DatePickerContentProps) => {
  return (
    <Overlay type={type} mobileType={mobileType} popoverProps={popoverProps}>
      <DialogContent {...props}>{children}</DialogContent>
    </Overlay>
  );
};

export type { DatePickerProps, DatePickerContentProps, DatePickerInputProps };
export { DatePicker, DatePickerContent, DatePickerInput };
`,
					},
				],
				registryDependencies: ["button", "calendar", "field", "input", "dialog"],
			},
		},
	},
	{
		name: "dialog",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/dialog/basic.tsx",
						target: "ui/dialog.tsx",
						content: `"use client";

import {
  Dialog as AriaDialog,
  DialogTrigger as AriaDialogTrigger,
  Heading as AriaHeading,
  Text as AriaText,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type * as React from "react";

const dialogStyles = tv({
  slots: {
    content:
      "relative flex flex-col gap-4 in-data-popover:p-4 p-6 outline-none",
    header: "flex flex-col gap-2 text-left",
    heading:
      "font-semibold in-popover:font-medium in-popover:text-base text-lg leading-none",
    description: "text-fg-muted text-sm",
    body: "flex flex-1 flex-col gap-2",
    inset: "-mx-6 in-popover:-mx-4 border bg-muted in-popover:px-4 px-6 py-4",
    footer: "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
  },
});

const { content, header, heading, description, body, footer, inset } =
  dialogStyles();

/* -----------------------------------------------------------------------------------------------*/

interface DialogProps extends React.ComponentProps<typeof AriaDialogTrigger> {}

const Dialog = (props: DialogProps) => {
  return <AriaDialogTrigger {...props} />;
};

/* -----------------------------------------------------------------------------------------------*/

interface DialogContentProps extends React.ComponentProps<typeof AriaDialog> {}

const DialogContent = ({ className, ...props }: DialogContentProps) => {
  return (
    <AriaDialog
      data-slot="dialog-content"
      className={content({ className })}
      {...props}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface DialogHeaderProps extends React.ComponentProps<"header"> {}

const DialogHeader = ({ className, ...props }: DialogHeaderProps) => {
  return <header className={header({ className })} {...props} />;
};

/* -----------------------------------------------------------------------------------------------*/

interface DialogHeadingProps extends React.ComponentProps<typeof AriaHeading> {}

const DialogHeading = ({ className, ...props }: DialogHeadingProps) => {
  return <AriaHeading className={heading({ className })} {...props} />;
};

/* -----------------------------------------------------------------------------------------------*/

interface DialogDescriptionProps
  extends Omit<React.ComponentProps<typeof AriaText>, "slot"> {}

const DialogDescription = ({ className, ...props }: DialogDescriptionProps) => {
  return (
    <AriaText
      slot="description"
      className={description({ className })}
      {...props}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface DialogBodyProps extends React.ComponentProps<"div"> {}

const DialogBody = ({ className, ...props }: DialogBodyProps) => {
  return <div className={body({ className })} {...props} />;
};

/* -----------------------------------------------------------------------------------------------*/

type DialogFooterProps = React.ComponentProps<"footer">;

const DialogFooter = ({ className, ...props }: DialogFooterProps) => {
  return <footer className={footer({ className })} {...props} />;
};

/* -----------------------------------------------------------------------------------------------*/

type DialogInsetProps = React.ComponentProps<"div">;

const DialogInset = ({ className, ...props }: DialogInsetProps) => {
  return <div className={inset({ className })} {...props} />;
};

/* -----------------------------------------------------------------------------------------------*/

export {
  Dialog,
  DialogHeader,
  DialogHeading,
  DialogDescription,
  DialogContent,
  DialogBody,
  DialogFooter,
  DialogInset,
};

export type {
  DialogProps,
  DialogBodyProps,
  DialogHeaderProps,
  DialogHeadingProps,
  DialogDescriptionProps,
  DialogContentProps,
  DialogFooterProps,
  DialogInsetProps,
};
`,
					},
				],
				registryDependencies: ["overlay"],
			},
		},
	},
	{
		name: "disclosure",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/disclosure/basic.tsx",
						target: "ui/disclosure.tsx",
						content: `"use client";

import { ChevronDownIcon } from "lucide-react";
import {
  Button as AriaButton,
  Disclosure as AriaDisclosure,
  DisclosurePanel as AriaDisclosurePanel,
  Heading as AriaHeading,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const disclosureStyles = tv({
  slots: {
    root: "group/disclosure w-full disabled:text-fg-disabled **:data-button:[&[slot=trigger]]:w-full **:data-button:[&[slot=trigger]]:justify-between **:data-button:[&[slot=trigger]]:text-left disabled:**:[svg]:text-fg-disabled",
    heading: "flex",
    button: [
      "focus-reset focus-visible:focus-ring",
      "flex flex-1 cursor-interactive items-start justify-between gap-4 rounded-md py-3 text-left font-medium text-sm transition-shadow disabled:pointer-events-none",
    ],
    panel:
      "h-(--disclosure-panel-height) overflow-clip text-fg-muted text-sm opacity-0 duration-300 ease-fluid-out group-expanded/disclosure:opacity-100 motion-safe:transition-[height,opacity]",
  },
});

const { root, panel, heading, button } = disclosureStyles();

/* ---------------------------------------------------------------------------------*/

interface DisclosureProps extends React.ComponentProps<typeof AriaDisclosure> {}

function Disclosure({ className, ...props }: DisclosureProps) {
  return (
    <AriaDisclosure
      data-disclosure=""
      className={composeRenderProps(className, (c) => root({ className: c }))}
      {...props}
    />
  );
}

/* ---------------------------------------------------------------------------------*/

interface DisclosurePanelProps
  extends React.ComponentProps<typeof AriaDisclosurePanel> {}

function DisclosurePanel({ className, ...props }: DisclosurePanelProps) {
  return (
    <AriaDisclosurePanel
      data-disclosure-panel=""
      className={composeRenderProps(className, (c) => panel({ className: c }))}
      {...props}
    >
      <div className="pb-3">{props.children}</div>
    </AriaDisclosurePanel>
  );
}

/* ---------------------------------------------------------------------------------*/

interface DisclosureTriggerProps
  extends React.ComponentProps<typeof AriaButton> {}

function DisclosureTrigger(props: DisclosureTriggerProps) {
  return (
    <AriaHeading className={heading()}>
      <AriaButton
        slot="trigger"
        data-disclosure-trigger=""
        className={button()}
        {...props}
      >
        {composeRenderProps(props.children, (children) => (
          <>
            {children}
            <ChevronDownIcon className="pointer-events-none size-4 shrink-0 translate-y-0.5 text-fg-muted transition-transform duration-200" />
          </>
        ))}
      </AriaButton>
    </AriaHeading>
  );
}

/* ---------------------------------------------------------------------------------*/

export { Disclosure, DisclosurePanel, DisclosureTrigger };

export type { DisclosureProps, DisclosurePanelProps, DisclosureTriggerProps };
`,
					},
				],
			},
		},
	},
	{
		name: "drawer",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/drawer/basic.tsx",
						target: "ui/drawer.tsx",
						content: `"use client";

import {
  Modal as AriaModal,
  ModalOverlay as AriaModalOverlay,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type React from "react";

const drawerVariants = tv({
  slots: {
    underlay:
      "group/overlay fixed inset-0 z-50 before:fixed before:inset-0 before:bg-bg/40 before:opacity-100 entering:before:opacity-0 exiting:before:opacity-0 before:transition-opacity before:duration-500 before:ease-fluid-out before:content-['']",
    overlay:
      "fixed z-50 flex flex-col border bg-bg transition-[translate] duration-500 ease-fluid-out will-change-[translate]",
  },
  variants: {
    placement: {
      top: {
        overlay:
          "entering:-translate-y-full exiting:-translate-y-full top-0 max-h-[calc(var(--visual-viewport-height)*0.8)] min-h-20 w-screen translate-y-0 rounded-b-xl border-t-0",
      },
      bottom: {
        overlay:
          "-translate-y-full top-(--visual-viewport-height) max-h-[calc(var(--visual-viewport-height)*0.8)] min-h-20 w-screen entering:translate-y-0 exiting:translate-y-0 rounded-t-xl border-b-0",
      },
      left: {
        overlay:
          "entering:-translate-x-full exiting:-translate-x-full top-0 left-0 h-(--visual-viewport-height) min-w-20 max-w-[80vw] translate-x-0 rounded-r-xl border-l-0",
      },
      right: {
        overlay:
          "top-0 right-0 h-(--visual-viewport-height) min-w-20 max-w-[80vw] entering:translate-x-full exiting:translate-x-full translate-x-0 rounded-l-xl border-r-0",
      },
    },
  },
  defaultVariants: {
    placement: "bottom",
  },
});

const { overlay, underlay } = drawerVariants();

interface DrawerProps extends React.ComponentProps<typeof AriaModal> {
  placement?: "top" | "bottom" | "left" | "right";
}

function Drawer({
  isDismissable = true,
  className,
  style,
  placement,
  ...props
}: DrawerProps) {
  return (
    <AriaModalOverlay
      className={underlay()}
      isDismissable={isDismissable}
      data-slot="drawer"
      {...props}
    >
      <AriaModal
        className={composeRenderProps(className, (className) =>
          overlay({ placement, className }),
        )}
        style={composeRenderProps(style, (style) => ({
          "--drawer-margin": "calc(var(--spacing)*24)",
          ...style,
        }))}
        {...props}
      />
    </AriaModalOverlay>
  );
}

export type { DrawerProps };
export { Drawer };
`,
					},
				],
			},
		},
	},
	{
		name: "drop-zone",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/drop-zone/basic.tsx",
						target: "ui/drop-zone.tsx",
						content: `"use client";

import {
  DropZone as AriaDropZone,
  Text as AriaText,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type * as React from "react";

const dropZoneStyles = tv({
  slots: {
    dropzone:
      "flex w-60 flex-col items-center justify-center gap-2 rounded-md border-2 drop-target:border-border-focus border-dashed drop-target:bg-accent-muted p-6 text-sm focus-visible:border-border-focus disabled:border-border-disabled disabled:text-fg-disabled",
    label: "text-base",
  },
});

const { dropzone, label } = dropZoneStyles();

interface DropZoneProps extends React.ComponentProps<typeof AriaDropZone> {}
const DropZone = ({ className, ...props }: DropZoneProps) => {
  return (
    <AriaDropZone
      className={composeRenderProps(className, (className) =>
        dropzone({ className }),
      )}
      {...props}
    />
  );
};

interface DropZoneLabelProps
  extends Omit<React.ComponentProps<typeof AriaText>, "slot"> {}
const DropZoneLabel = ({ className, ...props }: DropZoneLabelProps) => {
  return <AriaText slot="label" className={label({ className })} {...props} />;
};

export type { DropZoneProps, DropZoneLabelProps };
export { DropZone, DropZoneLabel };
`,
					},
				],
			},
		},
	},
	{
		name: "empty",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/empty/basic.tsx",
						target: "ui/empty.tsx",
						content: `import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

const emptyVariants = tv({
  slots: {
    base: "flex min-w-0 flex-1 flex-col items-center justify-center gap-6 text-balance rounded-lg border-dashed p-6 text-center md:p-12",
    header: "flex max-w-sm flex-col items-center gap-2 text-center",
    title: "font-medium text-lg tracking-tight",
    description:
      "text-fg-muted text-sm/relaxed [&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
    content:
      "flex w-full min-w-0 max-w-sm flex-col items-center gap-4 text-balance text-sm",
    media:
      "mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
  },
  variants: {
    variant: {
      default: {
        media: "bg-transparent",
      },
      icon: {
        media:
          "flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-fg [&_svg:not([class*='size-'])]:size-6",
      },
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const { base, header, title, description, content, media } = emptyVariants();

/* -----------------------------------------------------------------------------------------------*/

interface EmptyProps extends React.ComponentProps<"div"> {}

const Empty = ({ className, ...props }: EmptyProps) => {
  return <div data-slot="empty" className={base({ className })} {...props} />;
};

/* -----------------------------------------------------------------------------------------------*/

interface EmptyHeaderProps extends React.ComponentProps<"div"> {}

const EmptyHeader = ({ className, ...props }: EmptyHeaderProps) => {
  return (
    <div
      data-slot="empty-header"
      className={header({ className })}
      {...props}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface EmptyTitleProps extends React.ComponentProps<"div"> {}

const EmptyTitle = ({ className, ...props }: EmptyTitleProps) => {
  return (
    <div data-slot="empty-title" className={title({ className })} {...props} />
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface EmptyDescriptionProps extends React.ComponentProps<"div"> {}

const EmptyDescription = ({ className, ...props }: EmptyDescriptionProps) => {
  return (
    <div
      data-slot="empty-description"
      className={description({ className })}
      {...props}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface EmptyContentProps extends React.ComponentProps<"div"> {}

const EmptyContent = ({ className, ...props }: EmptyContentProps) => {
  return (
    <div
      data-slot="empty-content"
      className={content({ className })}
      {...props}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface EmptyMediaProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof emptyVariants> {}
const EmptyMedia = ({ variant, className, ...props }: EmptyMediaProps) => {
  return (
    <div
      data-slot="empty-media"
      className={media({ variant, className })}
      {...props}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

export {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
};

export type {
  EmptyProps,
  EmptyHeaderProps,
  EmptyTitleProps,
  EmptyDescriptionProps,
  EmptyContentProps,
  EmptyMediaProps,
};
`,
					},
				],
			},
		},
	},
	{
		name: "field",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/field/basic.tsx",
						target: "ui/field.tsx",
						content: `"use client";

import { useSlotId } from "@react-aria/utils";
import {
  FieldError as AriaFieldError,
  Label as AriaLabel,
  CheckboxContext,
  composeRenderProps,
  LabelContext,
  Provider,
  TextContext,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type React from "react";
import type { VariantProps } from "tailwind-variants";

import { useSkeletonText } from "@dotui/registry/ui/skeleton";
import { Text } from "@dotui/registry/ui/text";

const fieldStyles = tv({
  slots: {
    fieldset: [
      "flex flex-col gap-6",
      "has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3",
    ],
    legend: ["mb-3 font-medium text-base"],
    fieldGroup:
      "group/field-group @container/field-group flex w-full flex-col gap-7 has-data-[slot=checkbox]:gap-1.5 has-data-[slot=radio]:gap-1.5 data-[slot=checkbox-group]:gap-3 *:data-[slot=field-group]:gap-4",
    field:
      "flex items-start gap-2 invalid:has-data-[slot=field-error]:**:data-[slot=description]:hidden",
    fieldContent: "flex flex-col gap-1",
    label: [
      "inline-flex items-center gap-px text-fg text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:text-fg-disabled [&_svg]:size-3",
      // Required state
      "in-data-required:after:ml-0.5 in-data-required:after:text-fg-danger in-data-required:after:content-['*']",
      // Disabled state
      "in-disabled:cursor-not-allowed in-disabled:text-fg-disabled",
      // Invalid state
      "in-data-invalid:text-fg-danger",
    ],
    description: ["text-fg-muted text-xs", "in-data-disabled:text-fg-disabled"],
    fieldError: "text-fg-danger text-xs",
  },
  variants: {
    orientation: {
      horizontal: {
        field:
          "flex-row items-center gap-2 has-data-[slot=description]:items-start",
      },
      vertical: {
        field: "flex-col gap-2",
      },
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});

const {
  fieldset,
  legend,
  fieldGroup,
  field,
  fieldContent,
  label,
  description,
  fieldError,
} = fieldStyles();

/* -----------------------------------------------------------------------------------------------*/

interface FieldsetProps extends React.ComponentProps<"fieldset"> {}

function Fieldset({ className, ...props }: FieldsetProps) {
  return (
    <fieldset
      data-slot="fieldset"
      className={fieldset({ className })}
      {...props}
    />
  );
}

/* -----------------------------------------------------------------------------------------------*/

interface LegendProps extends React.ComponentProps<"legend"> {}

function Legend({ className, ...props }: LegendProps) {
  return (
    <legend data-slot="legend" className={legend({ className })} {...props} />
  );
}

/* -----------------------------------------------------------------------------------------------*/

interface FieldGroupProps extends React.ComponentProps<"div"> {}

function FieldGroup({ className, ...props }: FieldGroupProps) {
  return (
    <div
      data-slot="field-group"
      className={fieldGroup({ className })}
      {...props}
    />
  );
}

/* -----------------------------------------------------------------------------------------------*/

interface FieldProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof fieldStyles> {}

const Field = ({ children, className, orientation, ...props }: FieldProps) => {
  const inputId = useSlotId();
  const descriptionId = useSlotId();
  return (
    <div
      data-slot="field"
      className={field({ className, orientation })}
      {...props}
    >
      <Provider
        values={[
          [
            CheckboxContext,
            {
              id: inputId,
              "aria-describedby": descriptionId,
            },
          ],
          [LabelContext, { htmlFor: inputId }],
          [TextContext, { slot: "description", id: descriptionId }],
        ]}
      >
        {children}
      </Provider>
    </div>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface FieldContentProps extends React.ComponentProps<"div"> {}

const FieldContent = ({ className, ...props }: FieldContentProps) => {
  return (
    <div
      data-slot="field-content"
      className={fieldContent({ className })}
      {...props}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface LabelProps extends React.ComponentProps<typeof AriaLabel> {}

const Label = ({ children, className, ...props }: LabelProps) => {
  children = useSkeletonText(children);
  return (
    <AriaLabel
      data-slot="label"
      data-label=""
      className={label({ className })}
      {...props}
    >
      {children}
    </AriaLabel>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface DescriptionProps
  extends Omit<React.ComponentProps<typeof Text>, "slot"> {}

const Description = ({ className, ...props }: DescriptionProps) => {
  return (
    <Text
      data-slot="description"
      slot="description"
      className={description({ className })}
      {...props}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface FieldErrorProps extends React.ComponentProps<typeof AriaFieldError> {}
const FieldError = ({ className, ...props }: FieldErrorProps) => {
  return (
    <AriaFieldError
      data-slot="field-error"
      className={composeRenderProps(className, (className) =>
        fieldError({ className }),
      )}
      {...props}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

export {
  Fieldset,
  Legend,
  FieldGroup,
  Field,
  FieldContent,
  Label,
  Description,
  FieldError,
};

export { fieldStyles };

export type {
  FieldsetProps,
  LegendProps,
  FieldContentProps,
  LabelProps,
  DescriptionProps,
  FieldErrorProps,
  FieldGroupProps,
  FieldProps,
};
`,
					},
				],
			},
		},
	},
	{
		name: "file-trigger",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/file-trigger/basic.tsx",
						target: "ui/file-trigger.tsx",
						content: `"use client";

import { FileTrigger } from "react-aria-components";
import type { FileTriggerProps } from "react-aria-components";

export type { FileTriggerProps };
export { FileTrigger };
`,
					},
				],
			},
		},
	},
	{
		name: "group",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/group/basic.tsx",
						target: "ui/group.tsx",
						content: `"use client";

import {
  Group as AriaGroup,
  SeparatorContext as AriaSeparatorContext,
  TextContext as AriaTextContext,
  composeRenderProps,
  Provider,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type * as React from "react";
import type { VariantProps } from "tailwind-variants";

const groupStyles = tv({
  slots: {
    root: [
      "flex w-fit items-stretch",
      "has-data-[slot=group]:gap-2",
      "*:hover:z-1 *:focus-visible:z-10 *:has-[input]:z-2 *:[input]:z-2",
      // "*:focus-visible:z-10 *:focus-within:z-10 *:focus:z-10! *:data-[slot=input]:z-2 *:hover:z-3 *:pressed:z-10 *:has-[input]:z-2 *:data-[slot=input]:not-data-focused:z-2",

      // "[&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit",
      // "[&>input]:flex-1",
      // "has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-md",
      // "[&>[data-slot=select]>[data-slot=button]]:bg-blue-500",

      "*:data-[slot=label]:rounded-md *:data-[slot=label]:border *:data-[slot=label]:bg-card *:data-[slot=label]:px-4",
    ],
    separator: "",
    text: "flex items-center gap-2 rounded-md border bg-card px-4 font-medium text-sm shadow-xs [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none",
  },
  variants: {
    orientation: {
      horizontal: {
        root: [
          "-space-x-px not-has-[>[data-slot=group]]:*:not-last:rounded-r-none not-has-[>[data-slot=group]]:*:not-first:rounded-l-none",
          "not-has-[>[data-slot=group]]:*:not-last:data-[slot=select]:*:data-[slot=button]:rounded-r-none not-has-[>[data-slot=group]]:*:not-[:nth-child(2)]:data-[slot=select]:*:data-[slot=button]:rounded-l-none",
        ],
        separator: "",
      },
      vertical: {
        root: "flex-col not-has-[>[data-slot=group]]:*:not-first:rounded-t-none not-has-[>[data-slot=group]]:*:not-last:rounded-b-none",
        separator: "",
      },
    },
  },
});

const { root, separator, text } = groupStyles();

/* -----------------------------------------------------------------------------------------------*/

interface GroupProps
  extends React.ComponentProps<typeof AriaGroup>,
    VariantProps<typeof groupStyles> {}

const Group = ({
  orientation = "horizontal",
  className,
  ...props
}: GroupProps) => {
  return (
    <Provider
      values={[
        [
          AriaSeparatorContext,
          {
            orientation:
              orientation === "horizontal" ? "vertical" : "horizontal",
            className: separator({ orientation }),
          },
        ],
        [AriaTextContext, { className: text({ orientation }) }],
      ]}
    >
      <AriaGroup
        data-slot="group"
        className={composeRenderProps(className, (className) =>
          root({ className, orientation }),
        )}
        {...props}
      />
    </Provider>
  );
};

/* -----------------------------------------------------------------------------------------------*/

export { Group };

export type { GroupProps };
`,
					},
				],
				registryDependencies: ["button"],
			},
		},
	},
	{
		name: "input",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/input/basic.tsx",
						target: "ui/input.tsx",
						content: `"use client";

import React, { useCallback } from "react";
import { mergeProps, mergeRefs, useLayoutEffect } from "@react-aria/utils";
import { useControlledState } from "@react-stately/utils";
import { chain } from "react-aria";
import {
  DateInput as AriaDateInput,
  DateSegment as AriaDateSegment,
  Group as AriaGroup,
  Input as AriaInput,
  InputContext as AriaInputContext,
  TextArea as AriaTextArea,
  TextAreaContext as AriaTextAreaContext,
  composeRenderProps,
  Provider,
  useContextProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type { DateInputProps as AriaDateInputProps } from "react-aria-components";
import type { VariantProps } from "tailwind-variants";

import { createContext } from "@dotui/registry/lib/context";

const inputStyles = tv({
  slots: {
    group: [
      "group/input-group transition-[border-color,box-shadow]",

      "flex cursor-text items-center rounded-md border border-border-field bg-neutral text-base shadow-xs sm:text-sm",

      "gap-2 has-[>input]:px-3 has-[>input]:py-1 has-[>textarea]:py-2 has-[>textarea]:**:data-[slot=input-addon]:w-full has-[>textarea]:**:data-[slot=input-addon]:px-2",

      "has-[>textarea]:min-h-16 has-[>textarea]:flex-col has-[>textarea]:[&:not([class*='h-'])]:h-auto",

      // focus state
      // "focus-reset has-[[data-slot=input][data-focused]]:focus-input has-[[data-slot=textarea][data-focused]]:focus-input",
      "focus-reset focus-within:focus-input",

      // disabled state
      "has-[input[data-disabled]]:cursor-default has-[input[data-disabled]]:border-border-disabled has-[input[data-disabled]]:bg-disabled has-[input[data-disabled]]:text-fg-disabled",

      // invalid state
      "has-[input[data-invalid]]:border-border-danger focus-within:has-[input[data-invalid]]:border-border",
    ],
    addon: [
      "flex items-center gap-2 text-fg-muted",

      "[&>kbd]:rounded-xs [&>svg:not([class*='size-'])]:size-4",

      "first:group-has-[>input]/input-group:has-[>_[data-slot=button]]:-ml-1.75 last:group-has-[>input]/input-group:has-[>_[data-slot=button]]:-mr-1.75",
      "first:group-has-[>input]/input-group:group-data-[size=sm]/input-group:has-[>_[data-slot=button]]:-ml-2.25 last:group-has-[>input]/input-group:group-data-[size=sm]/input-group:has-[>_[data-slot=button]]:-mr-2.25",
      "first:group-has-[>input]/input-group:group-data-[size=lg]/input-group:has-[>_[data-slot=button]]:-ml-1.75 last:group-has-[>input]/input-group:group-data-[size=lg]/input-group:has-[>_[data-slot=button]]:-mr-1.75",

      "[&_[data-slot=button]>svg:not([class*='size-'])]:size-3.5",

      "group-data-[size=sm]/input-group:**:data-[slot=button]:h-6 group-data-[size=sm]/input-group:[&_[data-slot=button][data-icon-only]]:w-6",
      "group-data-[size=lg]/input-group:**:data-[slot=button]:h-7 group-data-[size=lg]/input-group:[&_[data-slot=button][data-icon-only]]:w-7",
      "**:data-[slot=button]:h-6 [&_[data-slot=button][data-icon-only]]:w-6",

      "**:data-[slot=button]:px-2 **:data-[slot=button]:text-sm **:data-[slot=button]:has-[>svg]:px-2 [&_[data-slot=button]:not([class*='rounded-full'])]:rounded-sm [&_[data-slot=button]]:[&>svg:not([class*='size-'])]:size-3.5",

      "[&_[data-slot=button][data-icon-only]]:px-0",
    ],
    input: "placeholder:text-fg-muted disabled:placeholder:text-fg-disabled",
    textArea: "placeholder:text-fg-muted disabled:placeholder:text-fg-disabled",
  },
  variants: {
    size: {
      sm: {
        group: "has-[>input]:h-8",
      },
      md: {
        group: "has-[>input]:h-9",
      },
      lg: {
        group: "has-[>input]:h-10",
      },
    },
    inGroup: {
      true: {
        input: ["min-w-0 flex-1 bg-transparent outline-none"],
        textArea:
          "min-h-0 resize-none rounded-none bg-transparent px-2 shadow-none outline-none",
      },
      false: {
        input: [
          "rounded-md border border-border-field bg-neutral px-3 py-2 shadow-xs",
          "focus-reset data-[slot=date-input]:focus-within:focus-input data-[slot=input]:focus:focus-input text-base transition-[border-color,box-shadow] sm:text-sm",
          "disabled:cursor-not-allowed disabled:border-border-disabled disabled:bg-disabled disabled:text-fg-disabled",
          "invalid:border-border-danger invalid:text-fg-danger focus-within:has-[input[data-invalid]]:border-border",
          "data-[slot=date-input]:cursor-text",
        ],
        textArea: [
          "flex min-h-16 resize-none rounded-md border border-border-field bg-neutral px-3 py-2 shadow-xs",
          "focus-reset focus:focus-input text-base transition-[border-color,box-shadow] sm:text-sm",
          "disabled:cursor-not-allowed disabled:border-border-disabled disabled:bg-disabled disabled:text-fg-disabled",
          "invalid:border-border-danger invalid:text-fg-danger focus-within:has-[input[data-invalid]]:border-border",
        ],
      },
    },
  },
  compoundVariants: [
    {
      inGroup: false,
      size: "sm",
      className: {
        input: "h-8",
      },
    },
    {
      inGroup: false,
      size: "md",
      className: {
        input: "h-9",
      },
    },
    {
      inGroup: false,
      size: "lg",
      className: {
        input: "h-10",
      },
    },
  ],
  defaultVariants: {
    size: "md",
    inGroup: false,
  },
});

const { group, input, textArea, addon } = inputStyles();

/* -----------------------------------------------------------------------------------------------*/

const [InputGroupContext, useInputGroupContext] = createContext<boolean>({
  name: "InputGroupContext",
  strict: false,
});

/* -----------------------------------------------------------------------------------------------*/

interface InputGroupProps
  extends React.ComponentProps<typeof AriaGroup>,
    Pick<VariantProps<typeof inputStyles>, "size"> {}

const InputGroup = ({
  className,
  children,
  size = "md",
  ...props
}: InputGroupProps) => {
  const inputRef = React.useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const [inputContextProps, mergedInputRef] = useContextProps(
    {},
    inputRef as React.RefObject<HTMLInputElement>,
    AriaInputContext,
  );
  const [textAreaContextProps, mergedTextAreaRef] = useContextProps(
    {},
    inputRef as React.RefObject<HTMLTextAreaElement>,
    AriaTextAreaContext,
  );
  const inputProps = { ...inputContextProps, ref: mergedInputRef };
  const textAreaProps = { ...textAreaContextProps, ref: mergedTextAreaRef };

  const onPointerDown = (event: React.PointerEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest("input, button, a")) return;
    const input = inputRef.current;
    if (!input) return;
    requestAnimationFrame(() => {
      input.focus();
    });
  };

  return (
    <AriaGroup
      role="presentation"
      data-slot="input-group"
      data-size={size}
      className={composeRenderProps(className, (className) =>
        group({ size, className }),
      )}
      {...mergeProps(props, { onPointerDown })}
    >
      {composeRenderProps(children, (children) => (
        <Provider
          values={[
            [AriaInputContext, inputProps],
            [AriaTextAreaContext, textAreaProps],
            [InputGroupContext, true],
          ]}
        >
          {children}
        </Provider>
      ))}
    </AriaGroup>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface InputProps
  extends Omit<React.ComponentProps<typeof AriaInput>, "size">,
    Pick<VariantProps<typeof inputStyles>, "size"> {}

const Input = ({ size = "md", className, ...props }: InputProps) => {
  const inGroup = useInputGroupContext("Input");
  return (
    <AriaInput
      data-slot="input"
      data-in-group={inGroup || undefined}
      data-size={size}
      className={composeRenderProps(className, (className) =>
        input({ className, inGroup, size }),
      )}
      {...props}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface TextAreaProps
  extends Omit<React.ComponentProps<typeof AriaTextArea>, "size">,
    Pick<VariantProps<typeof inputStyles>, "size"> {}

const TextArea = ({
  ref,
  className,
  onChange,
  size = "md",
  ...props
}: TextAreaProps) => {
  const inGroup = useInputGroupContext("TextArea");
  const [inputValue, setInputValue] = useControlledState(
    props.value,
    props.defaultValue ?? "",
    () => {},
  );
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  const onHeightChange = useCallback(() => {
    if (inputRef.current) {
      const input = inputRef.current;
      const prevAlignment = input.style.alignSelf;
      const prevOverflow = input.style.overflow;
      const prevFlex = input.style.flex; // Store the flex value

      const isFirefox = "MozAppearance" in input.style;
      if (!isFirefox) {
        input.style.overflow = "hidden";
      }
      input.style.flex = "none"; // Temporarily disable flex
      input.style.alignSelf = "start";
      input.style.height = "auto";
      // offsetHeight - clientHeight accounts for the border/padding.
      input.style.height = \`\${input.scrollHeight + (input.offsetHeight - input.clientHeight)}px\`;
      input.style.overflow = prevOverflow;
      input.style.alignSelf = prevAlignment;
      input.style.flex = prevFlex; // Restore the flex value
    }
  }, []);

  useLayoutEffect(() => {
    if (inputRef.current) {
      onHeightChange();
    }
  }, [onHeightChange, inputValue, inputRef]);

  return (
    <AriaTextArea
      ref={mergeRefs(inputRef, ref)}
      data-slot="textarea"
      data-in-group={inGroup || undefined}
      onChange={chain(onChange, setInputValue)}
      className={composeRenderProps(className, (className) =>
        textArea({ className, inGroup }),
      )}
      {...props}
    />
  );
};

interface InputAddonProps extends React.ComponentProps<"div"> {}

function InputAddon({ className, ...props }: InputAddonProps) {
  return (
    <div
      role="group"
      data-slot="input-addon"
      className={addon({ className })}
      {...props}
    />
  );
}

/* -----------------------------------------------------------------------------------------------*/

const dateInputStyles = tv({
  slots: {
    dateSegment:
      "select-none rounded px-0.5 type-literal:px-0 outline-hidden placeholder-shown:not-data-disabled:not-data-focused:text-fg-muted focus:bg-accent focus:text-fg-on-accent focus:caret-transparent disabled:text-fg-disabled",
  },
});

const { dateSegment } = dateInputStyles();

/* -----------------------------------------------------------------------------------------------*/

interface DateInputProps
  extends Omit<AriaDateInputProps, "children">,
    Pick<VariantProps<typeof inputStyles>, "size"> {
  children?: AriaDateInputProps["children"];
}

const DateInput = ({ className, size, ...props }: DateInputProps) => {
  const inGroup = useInputGroupContext("DateInput");
  return (
    <AriaDateInput
      data-slot="date-input"
      data-in-group={inGroup || undefined}
      className={composeRenderProps(className, (className) =>
        input({ className, inGroup, size }),
      )}
      {...props}
    >
      {props.children
        ? props.children
        : (segment) => <DateSegment segment={segment} />}
    </AriaDateInput>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface DateSegmentProps
  extends React.ComponentProps<typeof AriaDateSegment> {}

const DateSegment = ({ className, ...props }: DateSegmentProps) => {
  return (
    <AriaDateSegment
      className={composeRenderProps(className, (className) =>
        dateSegment({ className }),
      )}
      {...props}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

export { Input, TextArea, InputGroup, InputAddon, DateInput, DateSegment };

export type {
  InputGroupProps,
  InputProps,
  TextAreaProps,
  InputAddonProps,
  DateInputProps,
  DateSegmentProps,
};
`,
					},
				],
				registryDependencies: ["focus-styles"],
				dependencies: ["@react-stately/utils", "react-aria"],
			},
		},
	},
	{
		name: "kbd",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/kbd/basic.tsx",
						target: "ui/kbd.tsx",
						content: `"use client";

import { Keyboard as AriaKeyboard } from "react-aria-components";
import { tv } from "tailwind-variants";

const KbdStyles = tv({
  slots: {
    group: "inline-flex items-center gap-1",
    kbd: [
      "pointer-events-none inline-flex h-5 w-fit min-w-5 select-none items-center justify-center gap-1 rounded-sm bg-muted px-1 font-medium font-sans text-fg-muted text-xs",
      "[&_svg:not([class*='size-'])]:size-3",
    ],
  },
});

const { group, kbd } = KbdStyles();

/* -----------------------------------------------------------------------------------------------*/

interface KbdGroupProps extends React.HTMLAttributes<HTMLElement> {}

const KbdGroup = ({ className, ...props }: KbdGroupProps) => {
  return <kbd className={group({ className })} {...props} />;
};

/* -----------------------------------------------------------------------------------------------*/

interface KbdProps extends React.ComponentProps<typeof AriaKeyboard> {}

const Kbd = ({ className, ...props }: KbdProps) => {
  return <AriaKeyboard className={kbd({ className })} {...props} />;
};

/* -----------------------------------------------------------------------------------------------*/

export { KbdGroup, Kbd };
export type { KbdProps, KbdGroupProps };
`,
					},
				],
			},
		},
	},
	{
		name: "link",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/link/basic.tsx",
						target: "ui/link.tsx",
						content: `"use client";

import { Link as AriaLink, composeRenderProps } from "react-aria-components";
import { tv } from "tailwind-variants";
import type { LinkProps as AriaLinkProps } from "react-aria-components";
import type { VariantProps } from "tailwind-variants";

const linkVariants = tv({
  base: [
    "focus-reset focus-visible:focus-ring",
    "inline-flex items-center gap-1 transition-colors disabled:text-fg-disabled",
  ],
  variants: {
    variant: {
      accent: "text-fg-accent",
      quiet: "font-medium text-fg underline underline-offset-2",
      unstyled: "",
    },
  },
  defaultVariants: {
    variant: "accent",
  },
});

interface LinkProps extends AriaLinkProps, VariantProps<typeof linkVariants> {}

const Link = ({ variant, ...props }: LinkProps) => {
  return (
    <AriaLink
      {...props}
      className={composeRenderProps(props.className, (className) =>
        linkVariants({ variant, className }),
      )}
    />
  );
};

export type { LinkProps };
export { Link, linkVariants };
`,
					},
				],
				registryDependencies: ["focus-styles"],
			},
		},
	},
	{
		name: "list-box",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/list-box/basic.tsx",
						target: "ui/list-box.tsx",
						content: `"use client";

import React from "react";
import { CheckIcon } from "lucide-react";
import {
  Header as AriaHeader,
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  ListBoxSection as AriaListBoxSection,
  TextContext as AriaTextContext,
  Virtualizer as AriaVirtualizer,
  composeRenderProps,
  LabelContext,
  ListLayout,
  ListStateContext,
  Provider,
  useSlottedContext,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type {
  LabelProps as AriaLabelProps,
  ListBoxItemProps as AriaListBoxItemProps,
  ListBoxProps as AriaListBoxProps,
  ListBoxSectionProps as AriaListBoxSectionProps,
  VirtualizerProps as AriaVirtualizerProps,
  ContextValue,
} from "react-aria-components";
import type { VariantProps } from "tailwind-variants";

const listboxStyles = tv({
  slots: {
    root: [
      "focus-reset focus-visible:focus-ring",
      "data-standalone:max-h-68 data-standalone:w-48 data-standalone:overflow-y-auto data-standalone:rounded-md data-standalone:border data-standalone:bg-card data-standalone:p-1 data-standalone:shadow-sm",
      "w-full p-1",
    ],
    item: [
      "relative flex cursor-pointer items-center gap-2 rounded-sm px-3 py-1.5 text-sm outline-hidden transition-colors focus:bg-inverse/10 disabled:pointer-events-none disabled:**:text-fg-disabled",
      "selection-multiple:pr-4 selection-single:pr-4",
    ],
    section: "",
    sectionTitle: "",
  },
  variants: {
    variant: {
      default: { item: "" },
      success: {
        item: "",
      },
      warning: {
        item: "",
      },
      danger: {
        item: "",
      },
    },
  },
});

const { root, item, section, sectionTitle } = listboxStyles();

/* -----------------------------------------------------------------------------------------------*/

interface ListBoxProps<T> extends AriaListBoxProps<T> {
  isLoading?: boolean;
}

const ListBox = <T extends object>({
  className,
  isLoading,
  ...props
}: ListBoxProps<T>) => {
  const standalone = !React.use(ListStateContext);
  return (
    <AriaListBox
      data-standalone={standalone || undefined}
      className={composeRenderProps(className, (cn) => root({ className: cn }))}
      {...props}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface ListBoxItemProps<T>
  extends AriaListBoxItemProps<T>,
    VariantProps<typeof listboxStyles> {}

const ListBoxItem = <T extends object>({
  className,
  variant,
  textValue: textValueProp,
  ...props
}: ListBoxItemProps<T>) => {
  const textValue =
    textValueProp ||
    (typeof props.children === "string" ? props.children : undefined);

  return (
    <AriaListBoxItem
      textValue={textValue}
      className={composeRenderProps(className, (cn) =>
        item({ className: cn, variant }),
      )}
      {...props}
    >
      {composeRenderProps(
        props.children,
        (children, { selectionMode, isSelected }) => (
          <ListBoxItemInner>
            {children}
            {selectionMode !== "none" && (
              <span className="pointer-events-none absolute right-2 flex size-3.5 items-center justify-center">
                {isSelected && <CheckIcon className="size-4" />}
              </span>
            )}
          </ListBoxItemInner>
        ),
      )}
    </AriaListBoxItem>
  );
};

const ListBoxItemInner = ({ children }: { children: React.ReactNode }) => {
  const labelProps = useSlottedContext(AriaTextContext, "label")!;
  return (
    <Provider
      values={[
        [
          LabelContext as React.Context<
            ContextValue<AriaLabelProps, HTMLElement>
          >,
          labelProps,
        ],
      ]}
    >
      {children}
    </Provider>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface ListBoxSectionProps<T> extends AriaListBoxSectionProps<T> {}

const ListBoxSection = <T extends object>({
  className,
  ...props
}: ListBoxSectionProps<T>) => {
  return (
    <AriaListBoxSection
      data-slot="listbox-section"
      className={section({ className })}
      {...props}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface ListBoxSectionHeaderProps
  extends React.ComponentProps<typeof AriaHeader> {}

const ListBoxSectionHeader = ({
  className,
  ...props
}: ListBoxSectionHeaderProps) => {
  return <AriaHeader className={sectionTitle({ className })} {...props} />;
};

/* -----------------------------------------------------------------------------------------------*/

interface ListBoxVirtualizerProps<T>
  extends Omit<AriaVirtualizerProps<T>, "layout"> {}

const ListBoxVirtualizer = <T extends object>({
  ...props
}: ListBoxVirtualizerProps<T>) => {
  return (
    <AriaVirtualizer
      layout={ListLayout}
      layoutOptions={{
        rowHeight: 32,
        padding: 4,
        gap: 0,
      }}
      {...props}
    />
  );
};
/* -----------------------------------------------------------------------------------------------*/

export {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
  ListBoxVirtualizer,
};

export type {
  ListBoxProps,
  ListBoxItemProps,
  ListBoxSectionProps,
  ListBoxSectionHeaderProps,
  ListBoxVirtualizerProps,
};
`,
					},
				],
				registryDependencies: ["text", "focus-styles"],
			},
		},
	},
	{
		name: "loader",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/loader/basic.tsx",
						target: "ui/loader.tsx",
						content: `"use client";

import {
  ProgressBar as AriaProgressBar,
  composeRenderProps,
} from "react-aria-components";
import type { ProgressBarProps } from "react-aria-components";

import { cn } from "@dotui/registry/lib/utils";

interface LoaderProps extends ProgressBarProps {
  size?: number;
  stroke?: number;
  speed?: number;
  strokeLength?: number;
}

function Loader({
  className,
  style,
  size = 20,
  stroke = 2,
  strokeLength = 0.25,
  speed = 0.8,
  ...props
}: LoaderProps) {
  const centerPoint = size / 2;
  const radius = Math.max(0, size / 2 - stroke / 2);

  return (
    <AriaProgressBar
      data-slot="loader"
      style={composeRenderProps(style, (style) => ({
        ...style,
        "--loader-size": \`\${size}px\`,
        "--loader-speed": \`\${speed}s\`,
        "--loader-stroke": "2",
        "--loader-dash": String(parseFloat(\`\${strokeLength}\`) * 100),
        "--loader-gap": String(100 - parseFloat(\`\${strokeLength}\`) * 100),
      }))}
      className={cn(
        "inline-flex size-(--loader-size) shrink-0 items-center justify-center",
        className,
      )}
      aria-label="loading..."
      {...props}
      isIndeterminate
    >
      <svg
        className="size-(--loader-size) origin-center animate-[spin_var(--loader-speed)_linear_infinite] overflow-visible will-change-transform"
        viewBox={\`\${centerPoint} \${centerPoint} \${size} \${size}\`}
        height={size}
        width={size}
      >
        <circle
          className="stroke-[color-mix(in_oklab,currentColor_20%,transparent)] transition-[stroke] duration-500 ease-out"
          cx={size}
          cy={size}
          r={radius}
          pathLength="100"
          strokeWidth={\`\${stroke}px\`}
          fill="none"
        />
        <circle
          className="fill-none stroke-current transition-[stroke] duration-500 ease-out [stroke-dasharray:var(--loader-dash),var(--loader-gap)] [stroke-dashoffset:0] [stroke-linecap:round]"
          cx={size}
          cy={size}
          r={radius}
          pathLength="100"
          strokeWidth={\`\${stroke}px\`}
          fill="none"
        />
      </svg>
    </AriaProgressBar>
  );
}

export type { LoaderProps };
export { Loader };
`,
					},
				],
			},
			ring: {
				files: [
					{
						type: "registry:ui",
						path: "ui/loader/ring.tsx",
						target: "ui/loader.tsx",
						content: `"use client";

import {
  ProgressBar as AriaProgressBar,
  composeRenderProps,
} from "react-aria-components";
import type { ProgressBarProps } from "react-aria-components";

import { cn } from "@dotui/registry/lib/utils";

interface LoaderProps extends ProgressBarProps {
  size?: number;
  stroke?: number;
  speed?: number;
  strokeLength?: number;
}

function Loader({
  className,
  style,
  size = 20,
  stroke = 2,
  strokeLength = 0.25,
  speed = 0.8,
  ...props
}: LoaderProps) {
  const centerPoint = size / 2;
  const radius = Math.max(0, size / 2 - stroke / 2);

  return (
    <AriaProgressBar
      data-slot="loader"
      style={composeRenderProps(style, (style) => ({
        ...style,
        "--loader-size": \`\${size}px\`,
        "--loader-speed": \`\${speed}s\`,
        "--loader-stroke": "2",
        "--loader-dash": String(parseFloat(\`\${strokeLength}\`) * 100),
        "--loader-gap": String(100 - parseFloat(\`\${strokeLength}\`) * 100),
      }))}
      className={cn(
        "inline-flex size-(--loader-size) shrink-0 items-center justify-center",
        className,
      )}
      aria-label="loading..."
      {...props}
      isIndeterminate
    >
      <svg
        className="size-(--loader-size) origin-center animate-[spin_var(--loader-speed)_linear_infinite] overflow-visible will-change-transform"
        viewBox={\`\${centerPoint} \${centerPoint} \${size} \${size}\`}
        height={size}
        width={size}
      >
        <circle
          className="stroke-[color-mix(in_oklab,currentColor_20%,transparent)] transition-[stroke] duration-500 ease-out"
          cx={size}
          cy={size}
          r={radius}
          pathLength="100"
          strokeWidth={\`\${stroke}px\`}
          fill="none"
        />
        <circle
          className="fill-none stroke-current transition-[stroke] duration-500 ease-out [stroke-dasharray:var(--loader-dash),_var(--loader-gap)] [stroke-dashoffset:0] [stroke-linecap:round]"
          cx={size}
          cy={size}
          r={radius}
          pathLength="100"
          strokeWidth={\`\${stroke}px\`}
          fill="none"
        />
      </svg>
    </AriaProgressBar>
  );
}

export type { LoaderProps };
export { Loader };
`,
					},
				],
			},
		},
	},
	{
		name: "menu",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/menu/basic.tsx",
						target: "ui/menu.tsx",
						content: `"use client";

import { CheckIcon, ChevronRightIcon } from "lucide-react";
import {
  Header as AriaHeader,
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  MenuSection as AriaMenuSection,
  MenuTrigger as AriaMenuTrigger,
  SubmenuTrigger as AriaSubmenuTrigger,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type * as React from "react";
import type {
  MenuItemProps as AriaMenuItemProps,
  MenuProps as AriaMenuProps,
  MenuSectionProps as AriaMenuSectionProps,
  MenuTriggerProps as AriaMenuTriggerProps,
  SubmenuTriggerProps as AriaSubmenuTriggerProps,
} from "react-aria-components";
import type { VariantProps } from "tailwind-variants";

import { cn } from "@dotui/registry/lib/utils";

const menuStyles = tv({
  base: [
    "max-h-[inherit] rounded-[inherit] p-1 outline-hidden",
    "group-data-[type=drawer]/overlay:p-2",
    "[&_.separator]:-mx-1 [&_.separator]:my-1 [&_.separator]:w-auto",
  ],
});

/* -----------------------------------------------------------------------------------------------*/

interface MenuProps extends AriaMenuTriggerProps {}

const Menu = (props: MenuProps) => {
  return <AriaMenuTrigger {...props} />;
};

/* -----------------------------------------------------------------------------------------------*/

interface MenuContentProps<T> extends AriaMenuProps<T> {}
const MenuContent = <T extends object>({
  className,
  ...props
}: MenuContentProps<T>) => {
  return (
    <AriaMenu
      className={composeRenderProps(className, (className) =>
        menuStyles({ className }),
      )}
      {...props}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface MenuSubProps extends AriaSubmenuTriggerProps {}

const MenuSub = (props: MenuSubProps) => {
  return <AriaSubmenuTrigger {...props} />;
};

/* -----------------------------------------------------------------------------------------------*/

const menuItemStyles = tv({
  base: [
    "flex cursor-pointer items-center gap-2 rounded-sm px-3 py-1.5 text-sm outline-hidden transition-colors focus:bg-inverse/10 disabled:pointer-events-none disabled:text-fg-disabled",
    "selection-multiple:pl-0 selection-single:pl-0",
    "group-data-[slot=drawer]/overlay:py-3 group-data-[slot=drawer]/overlay:text-base",
    "group-data-[slot=modal]/overlay:py-2 group-data-[slot=modal]/overlay:text-base",
    "[&_svg]:size-4",
    "[&_kbd]:bg-transparent [&_kbd]:text-fg-muted",
  ],
  variants: {
    variant: {
      default: "text-fg",
      success: "text-fg-success",
      warning: "text-fg-warning",
      accent: "text-fg-accent",
      danger: "text-fg-danger",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface MenuItemProps<T>
  extends AriaMenuItemProps<T>,
    VariantProps<typeof menuItemStyles> {}

const MenuItem = <T extends object>({
  className,
  variant,
  ...props
}: MenuItemProps<T>) => {
  return (
    <AriaMenuItem
      data-slot="menu-item"
      className={composeRenderProps(className, (className) =>
        menuItemStyles({ className, variant }),
      )}
      {...props}
    >
      {composeRenderProps(
        props.children,
        (children, { selectionMode, isSelected, hasSubmenu }) => (
          <>
            {selectionMode !== "none" && (
              <span className="flex w-8 items-center justify-center">
                {isSelected && (
                  <CheckIcon aria-hidden className="size-4 text-fg-accent" />
                )}
              </span>
            )}
            {children}
            {hasSubmenu && <ChevronRightIcon aria-hidden className="size-4" />}
          </>
        ),
      )}
    </AriaMenuItem>
  );
};

/* -----------------------------------------------------------------------------------------------*/

const menuSectionStyles = tv({
  base: "space-y-px pt-2",
});

interface MenuSectionProps<T> extends AriaMenuSectionProps<T> {}
const MenuSection = <T extends object>({
  children,
  className,
  ...props
}: MenuSectionProps<T>) => {
  return (
    <AriaMenuSection className={menuSectionStyles({ className })} {...props}>
      {children}
    </AriaMenuSection>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface MenuSectionHeaderProps
  extends React.ComponentProps<typeof AriaHeader> {}

const MenuSectionHeader = ({ className, ...props }: MenuSectionHeaderProps) => {
  return (
    <AriaHeader
      className={cn("font-medium text-fg-muted text-sm", className)}
      {...props}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

export { Menu, MenuItem, MenuContent, MenuSection, MenuSectionHeader, MenuSub };

export type {
  MenuProps,
  MenuContentProps,
  MenuItemProps,
  MenuSectionProps,
  MenuSectionHeaderProps,
  MenuSubProps,
};
`,
					},
				],
				registryDependencies: ["kbd", "overlay", "text"],
			},
		},
	},
	{
		name: "modal",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/modal/basic.tsx",
						target: "ui/modal.tsx",
						content: `"use client";

import {
  Modal as AriaModal,
  ModalOverlay as AriaModalOverlay,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type React from "react";

const modalStyles = tv({
  slots: {
    overlay: "group/modal absolute top-0 left-0 z-100 h-(--page-height) w-full",
    backdrop: [
      "size-full bg-bg/40 duration-200 group-exiting/modal:duration-150",
      "transition-opacity group-entering/modal:opacity-0 group-exiting/modal:opacity-0",
    ],
    modal: [
      "-translate-x-1/2 -translate-y-1/2 fixed top-[calc(var(--visual-viewport-height)/2)] left-1/2 max-h-(--visual-viewport-height) w-full max-w-[calc(100%-2rem)] rounded-lg border bg-bg shadow-lg sm:max-w-lg",
      "transition-[opacity,scale] ease-[cubic-bezier(0.165,0.84,0.44,1)]",
      "entering:scale-95 entering:opacity-0 duration-200",
      "exiting:scale-95 exiting:opacity-0 exiting:duration-150",
    ],
  },
});

const { overlay, modal, backdrop } = modalStyles();

/* -----------------------------------------------------------------------------------------------*/

interface ModalProps extends ModalOverlayProps {}

const Modal = ({ children, className, ...props }: ModalProps) => (
  <ModalOverlay {...props}>
    <ModalBackdrop />
    <ModalContent className={className}>{children}</ModalContent>
  </ModalOverlay>
);

/* -----------------------------------------------------------------------------------------------*/

interface ModalOverlayProps
  extends React.ComponentProps<typeof AriaModalOverlay> {}
const ModalOverlay = ({
  children,
  className,
  isDismissable = true,
  ...props
}: ModalOverlayProps) => (
  <AriaModalOverlay
    isDismissable={isDismissable}
    className={composeRenderProps(className, (className) =>
      overlay({ className }),
    )}
    {...props}
  >
    {children}
  </AriaModalOverlay>
);

/* -----------------------------------------------------------------------------------------------*/

interface ModalContentProps extends React.ComponentProps<typeof AriaModal> {}
const ModalContent = ({ children, className, ...props }: ModalContentProps) => (
  <AriaModal
    data-modal=""
    className={composeRenderProps(className, (className) =>
      modal({ className }),
    )}
    {...props}
  >
    {children}
  </AriaModal>
);

interface ModalBackdropProps extends React.ComponentProps<"div"> {}
const ModalBackdrop = ({ className, ...props }: ModalBackdropProps) => (
  <div className={backdrop({ className })} {...props} />
);

export { Modal, ModalOverlay, ModalContent, ModalBackdrop };

export type {
  ModalProps,
  ModalOverlayProps,
  ModalContentProps,
  ModalBackdropProps,
};
`,
					},
				],
			},
		},
	},
	{
		name: "number-field",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/number-field/basic.tsx",
						target: "ui/number-field.tsx",
						content: `"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import {
  ButtonContext as AriaButtonContext,
  NumberField as AriaNumberField,
  composeRenderProps,
  Provider,
  useSlottedContext,
} from "react-aria-components";
import type * as React from "react";

import { fieldStyles } from "@dotui/registry/ui/field";

interface NumberFieldProps
  extends React.ComponentProps<typeof AriaNumberField> {}
const NumberField = ({ className, ...props }: NumberFieldProps) => {
  return (
    <AriaNumberField
      data-slot="number-field"
      className={composeRenderProps(className, (className) =>
        fieldStyles().field({ className }),
      )}
      {...props}
    >
      {composeRenderProps(props.children, (children) => (
        <NumberFieldInner>{children}</NumberFieldInner>
      ))}
    </AriaNumberField>
  );
};

const NumberFieldInner = ({ children }: { children: React.ReactNode }) => {
  const incrementBtnCtx = useSlottedContext(AriaButtonContext, "increment");
  const decrementBtnCtx = useSlottedContext(AriaButtonContext, "decrement");
  return (
    <Provider
      values={[
        [
          AriaButtonContext,
          {
            slots: {
              increment: { ...incrementBtnCtx, children: <PlusIcon /> },
              decrement: { ...decrementBtnCtx, children: <MinusIcon /> },
            },
          },
        ],
      ]}
    >
      {children}
    </Provider>
  );
};

export type { NumberFieldProps };
export { NumberField };
`,
					},
				],
				registryDependencies: ["input", "field", "use-is-mobile"],
			},
		},
	},
	{
		name: "overlay",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/overlay/basic.tsx",
						target: "ui/overlay.tsx",
						content: `"use client";

import { useIsMobile } from "@dotui/registry/hooks/use-mobile";
import { Drawer } from "@dotui/registry/ui/drawer";
import { Modal } from "@dotui/registry/ui/modal";
import { Popover } from "@dotui/registry/ui/popover";
import type { DrawerProps } from "@dotui/registry/ui/drawer";
import type { ModalProps } from "@dotui/registry/ui/modal";
import type { PopoverProps } from "@dotui/registry/ui/popover";

type Type = "modal" | "popover" | "drawer";

type CommonProps =
  | "isDismissable"
  | "isOpen"
  | "defaultOpen"
  | "onOpenChange"
  | "isKeyboardDismissDisabled"
  | "shouldCloseOnInteractOutside";

interface OverlayProps extends Pick<ModalProps, CommonProps> {
  children?: React.ReactNode;
  type?: Type;
  mobileType?: Type | null;
  popoverProps?: Omit<PopoverProps, "children" | CommonProps>;
  modalProps?: Omit<ModalProps, "children" | CommonProps>;
  drawerProps?: Omit<DrawerProps, "children" | CommonProps>;
}

function Overlay({
  type = "modal",
  mobileType = "drawer",
  modalProps,
  popoverProps,
  drawerProps,
  ...props
}: OverlayProps) {
  const isMobile = useIsMobile();
  const resolvedType = mobileType ? (isMobile ? mobileType : type) : type;

  if (resolvedType === "popover") {
    return <Popover {...popoverProps} {...props} />;
  }

  if (resolvedType === "drawer") {
    return <Drawer {...drawerProps} {...props} />;
  }

  return <Modal {...modalProps} {...props} />;
}

export type { OverlayProps };
export { Overlay };
`,
					},
				],
				registryDependencies: ["modal", "popover", "drawer", "use-is-mobile"],
			},
		},
	},
	{
		name: "popover",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/popover/basic.tsx",
						target: "ui/popover.tsx",
						content: `"use client";

import {
  OverlayArrow as AriaOverlayArrow,
  Popover as AriaPopover,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type React from "react";

const popoverStyles = tv({
  slots: {
    popover: [
      "popover z-50 min-w-(--trigger-width) max-w-72 origin-(--trigger-anchor-point) overflow-y-auto rounded-md border bg-popover shadow-md forced-color-adjust-none",

      "transition-[transform,opacity,scale] duration-200 ease-out will-change-[transform,opacity,scale] [--slide-offset:calc(var(--spacing)*0.5)]",

      "entering:transform-(--origin) entering:scale-95 entering:opacity-0",
      "exiting:transform-(--origin) exiting:scale-95 exiting:opacity-0 exiting:duration-150",
      "placement-bottom:[--origin:translateY(calc(var(--slide-offset)*-1))] placement-left:[--origin:translateX(var(--slide-offset))] placement-right:[--origin:translateX(calc(var(--slide-offset)*-1))] placement-top:[--origin:translateY(var(--slide-offset))]",
    ],
    arrow: [
      "block [&>svg]:size-2.5 [&>svg]:fill-popover",
      "placement-left:[&>svg]:-rotate-90 placement-bottom:[&>svg]:rotate-180 placement-right:[&>svg]:rotate-90",
    ],
  },
});

const { popover, arrow } = popoverStyles();

interface PopoverProps extends React.ComponentProps<typeof AriaPopover> {
  showArrow?: boolean;
}
function Popover({ className, showArrow = false, ...props }: PopoverProps) {
  return (
    <AriaPopover
      data-popover=""
      className={composeRenderProps(className, (className) =>
        popover({ className }),
      )}
      {...props}
    >
      {composeRenderProps(props.children, (children) => (
        <>
          {children}
          {showArrow && <PopoverArrow />}
        </>
      ))}
    </AriaPopover>
  );
}

interface PopoverArrowProps extends React.ComponentProps<"svg"> {}
function PopoverArrow({ className, ...props }: PopoverArrowProps) {
  return (
    <AriaOverlayArrow>
      <svg
        width={12}
        height={12}
        viewBox="0 0 8 8"
        className={arrow({ className })}
        {...props}
      >
        <path d="M0 0 L4 4 L8 0" />
      </svg>
    </AriaOverlayArrow>
  );
}

export type { PopoverProps };
export { Popover };
`,
					},
				],
			},
		},
	},
	{
		name: "progress-bar",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/progress-bar/basic.tsx",
						target: "ui/progress-bar.tsx",
						content: `"use client";

import {
  ProgressBar as AriaProgress,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type * as React from "react";
import type { VariantProps } from "tailwind-variants";

import { createScopedContext } from "@dotui/registry/lib/context";

const progressStyles = tv({
  slots: {
    root: "flex w-60 flex-col gap-2",
    indicator: "relative h-2.5 w-full overflow-hidden rounded-full",
    filler: [
      "h-full w-full min-w-14 flex-1 origin-left bg-fg transition-transform",
      "indeterminate:mask-[linear-gradient(75deg,rgb(0,0,0)_30%,rgba(0,0,0,0.65)_80%)] indeterminate:mask-size-[200%] indeterminate:animate-progress-indeterminate indeterminate:[-webkit-mask-image:linear-gradient(75deg,rgb(0,0,0)_30%,rgba(0,0,0,0.65)_80%)] indeterminate:[-webkit-mask-size:200%]",
    ],
    valueLabel: "text-sm",
  },
  variants: {
    variant: {
      primary: {
        indicator: "bg-muted",
        filler: "bg-primary",
      },
      accent: {
        indicator: "bg-accent-muted",
        filler: "bg-accent",
      },
      warning: {
        indicator: "bg-warning-muted",
        filler: "bg-warning",
      },
      danger: {
        indicator: "bg-danger-muted",
        filler: "bg-danger",
      },
      success: {
        indicator: "bg-success-muted",
        filler: "bg-success",
      },
    },
    size: {
      sm: {
        indicator: "h-1",
      },
      md: {
        indicator: "h-2.5",
      },
      lg: {
        indicator: "h-4",
      },
    },
  },
  defaultVariants: {
    variant: "accent",
    size: "md",
  },
});

const { root, indicator, filler, valueLabel } = progressStyles();

const [ProgressBarProvider, useProgressBarContext] = createScopedContext<
  VariantProps<typeof progressStyles> & {
    isIndeterminate: boolean;
    valueText?: string;
    percentage?: number;
  }
>("ProgressRoot");

interface ProgressBarProps extends React.ComponentProps<typeof AriaProgress> {}

const ProgressBar = ({ children, className, ...props }: ProgressBarProps) => {
  return (
    <AriaProgress
      className={composeRenderProps(className, (className) =>
        root({ className }),
      )}
      {...props}
    >
      {composeRenderProps(
        children,
        (children, { isIndeterminate, valueText, percentage }) => (
          <ProgressBarProvider
            isIndeterminate={isIndeterminate}
            valueText={valueText}
            percentage={percentage}
          >
            {children ?? <ProgressBarControl />}
          </ProgressBarProvider>
        ),
      )}
    </AriaProgress>
  );
};

interface ProgressBarControlProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof progressStyles> {
  duration?: \`\${number}s\` | \`\${number}ms\`;
}

const ProgressBarControl = ({
  className,
  variant,
  size,
  duration,
  ...props
}: ProgressBarControlProps) => {
  const { isIndeterminate, percentage } =
    useProgressBarContext("ProgressBarControl");

  return (
    <div className={indicator({ variant, size, className })} {...props}>
      <div
        data-rac=""
        data-indeterminate={isIndeterminate || undefined}
        className={filler({ variant, size })}
        style={
          {
            "--progress-duration": duration,
            transform: percentage ? \`scaleX(\${percentage / 100})\` : undefined,
          } as React.CSSProperties
        }
      />
    </div>
  );
};

interface ProgressBarValueLabelProps extends React.ComponentProps<"span"> {}
const ProgressBarValueLabel = ({
  className,
  ...props
}: ProgressBarValueLabelProps) => {
  const { valueText } = useProgressBarContext("ProgressBarValueLabel");

  return (
    <span className={valueLabel({ className })} {...props}>
      {valueText}
    </span>
  );
};

export { ProgressBar, ProgressBarControl, ProgressBarValueLabel };

export type {
  ProgressBarProps,
  ProgressBarControlProps,
  ProgressBarValueLabelProps,
};
`,
					},
				],
				registryDependencies: ["field"],
			},
		},
	},
	{
		name: "radio-group",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/radio-group/basic.tsx",
						target: "ui/radio-group.tsx",
						content: `"use client";

import {
  Radio as AriaRadio,
  RadioGroup as AriaRadioGroup,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type { RadioGroupProps, RadioRenderProps } from "react-aria-components";

import { createContext } from "@dotui/registry/lib/context";
import { cn } from "@dotui/registry/lib/utils";
import { fieldStyles } from "@dotui/registry/ui/field";

const { field } = fieldStyles();

const RadioGroup = ({ className, ...props }: RadioGroupProps) => {
  return (
    <AriaRadioGroup
      className={composeRenderProps(className, (className) =>
        field({ className }),
      )}
      {...props}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

const radioStyles = tv({
  slots: {
    root: ["flex items-center gap-2 has-data-[slot=description]:items-start"],
    indicator: [
      "flex size-4 shrink-0 items-center justify-center rounded-full border border-border-control bg-transparent text-transparent",
      "transition-[background-color,border-color,box-shadow,color] duration-75",
      // focus state
      // selected state
      "selected:border-transparent selected:bg-primary selected:text-fg-on-primary",
      // read-only state
      "read-only:cursor-default",
      // disabled state
      "disabled:cursor-default disabled:border-border-disabled selected:disabled:bg-disabled selected:disabled:text-fg-disabled indeterminate:disabled:bg-disabled",
      // invalid state
      "invalid:border-border-danger invalid:selected:bg-danger-muted invalid:selected:text-fg-onMutedDanger",
      // indeterminate state
      "indeterminate:border-transparent indeterminate:bg-primary indeterminate:text-fg-on-primary",
    ],
  },
});

const { root, indicator } = radioStyles();

const [InternalRadioProvider, useInternalRadio] =
  createContext<RadioRenderProps>({
    strict: true,
  });

interface RadioProps extends React.ComponentProps<typeof AriaRadio> {}

const Radio = ({ className, ...props }: RadioProps) => {
  return (
    <AriaRadio
      data-slot="radio"
      className={composeRenderProps(className, (className) =>
        props.children
          ? root({ className })
          : indicator({
              className: cn(className, "focus-reset focus-visible:focus-ring"),
            }),
      )}
      {...props}
    >
      {composeRenderProps(props.children, (children, renderProps) => {
        return children ? (
          <InternalRadioProvider value={renderProps}>
            {children}
          </InternalRadioProvider>
        ) : (
          <span />
        );
      })}
    </AriaRadio>
  );
};

interface RadioIndicatorProps extends React.ComponentProps<"div"> {}

const RadioIndicator = ({ className, ...props }: RadioIndicatorProps) => {
  const ctx = useInternalRadio("RadioIndicator");
  return (
    <div
      data-rac=""
      data-selected={ctx.isSelected || undefined}
      data-pressed={ctx.isPressed || undefined}
      data-hovered={ctx.isHovered || undefined}
      data-focused={ctx.isFocused || undefined}
      data-focus-visible={ctx.isFocusVisible || undefined}
      data-disabled={ctx.isDisabled || undefined}
      data-readonly={ctx.isReadOnly || undefined}
      data-invalid={ctx.isInvalid || undefined}
      data-required={ctx.isRequired || undefined}
      className={indicator({ className })}
      {...props}
    >
      <span />
    </div>
  );
};
/* -----------------------------------------------------------------------------------------------*/

export { RadioGroup, Radio, RadioIndicator };

export type { RadioGroupProps, RadioProps, RadioIndicatorProps };
`,
					},
				],
				registryDependencies: ["focus-styles", "field"],
			},
		},
	},
	{
		name: "search-field",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/search-field/basic.tsx",
						target: "ui/search-field.tsx",
						content: `"use client";

import {
  SearchField as AriaSearchField,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type * as React from "react";

import { fieldStyles } from "@dotui/registry/ui/field";

const searchFieldStyles = tv({
  base: [
    "[&.flex-1]:*:data-[slot=input]:w-full [&.w-full]:*:data-[slot=input]:w-full",
    fieldStyles().field(),
  ],
});

/* -----------------------------------------------------------------------------------------------*/

interface SearchFieldProps
  extends React.ComponentProps<typeof AriaSearchField> {}

const SearchField = ({ className, ...props }: SearchFieldProps) => {
  return (
    <AriaSearchField
      data-slot="search-field"
      className={composeRenderProps(className, (className) =>
        searchFieldStyles({ className }),
      )}
      {...props}
    />
  );
};

export { SearchField };

export type { SearchFieldProps };
`,
					},
				],
				registryDependencies: ["field", "button"],
			},
		},
	},
	{
		name: "select",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/select/basic.tsx",
						target: "ui/select.tsx",
						content: `"use client";

import { ChevronDownIcon } from "lucide-react";
import {
  Select as AriaSelect,
  SelectValue as AriaSelectValue,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type {
  SelectProps as AriaSelectProps,
  SelectValueProps as AriaSelectValueProps,
} from "react-aria-components";

import { Button } from "@dotui/registry/ui/button";
import { fieldStyles } from "@dotui/registry/ui/field";
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
  ListBoxVirtualizer,
} from "@dotui/registry/ui/list-box";
import { Popover } from "@dotui/registry/ui/popover";
import type { ButtonProps } from "@dotui/registry/ui/button";
import type { ListBoxProps } from "@dotui/registry/ui/list-box";
import type { PopoverProps } from "@dotui/registry/ui/popover";

const selectStyles = tv({
  slots: {
    root: fieldStyles().field(),
    selectValue: "flex-1 truncate text-left placeholder-shown:text-fg-muted",
  },
});

const { root, selectValue } = selectStyles();

/* -----------------------------------------------------------------------------------------------*/

interface SelectProps<T extends object> extends AriaSelectProps<T> {}

const Select = <T extends object>({ className, ...props }: SelectProps<T>) => {
  return (
    <AriaSelect
      data-field=""
      data-select=""
      data-slot="select"
      className={composeRenderProps(className, (cn) => root({ className: cn }))}
      {...props}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

const SelectTrigger = (props: ButtonProps) => {
  return (
    <Button aspect="default" {...props}>
      {composeRenderProps(props.children, (children) => {
        return (
          <>
            {children ?? <SelectValue />}
            <ChevronDownIcon className="ml-auto" />
          </>
        );
      })}
    </Button>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface SelectValueProps<T extends object> extends AriaSelectValueProps<T> {}

const SelectValue = <T extends object>({
  className,
  ...props
}: SelectValueProps<T>) => {
  return (
    <AriaSelectValue
      data-slot="select-value"
      className={composeRenderProps(className, (className) =>
        selectValue({ className }),
      )}
      {...props}
    >
      {composeRenderProps(
        props.children,
        (children, { selectedText, defaultChildren }) => {
          return <>{children || selectedText || defaultChildren}</>;
        },
      )}
    </AriaSelectValue>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface SelectContentProps<T extends object>
  extends ListBoxProps<T>,
    Pick<
      PopoverProps,
      "placement" | "defaultOpen" | "isOpen" | "onOpenChange"
    > {
  placement?: PopoverProps["placement"];
  virtulized?: boolean;
}

const SelectContent = <T extends object>({
  virtulized,
  placement,
  defaultOpen,
  isOpen,
  onOpenChange,
  ...props
}: SelectContentProps<T>) => {
  if (virtulized) {
    return (
      <Popover
        placement={placement}
        defaultOpen={defaultOpen}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ListBoxVirtualizer>
          <ListBox {...props} />
        </ListBoxVirtualizer>
      </Popover>
    );
  }

  return (
    <Popover
      placement={placement}
      defaultOpen={defaultOpen}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ListBox {...props} />
    </Popover>
  );
};

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  ListBoxItem as SelectItem,
  ListBoxSection as SelectSection,
  ListBoxSectionHeader as SelectSectionHeader,
};

export type { SelectProps, SelectValueProps, SelectContentProps };
`,
					},
				],
				registryDependencies: ["button", "field", "list-box", "popover"],
			},
		},
	},
	{
		name: "separator",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/separator/basic.tsx",
						target: "ui/separator.tsx",
						content: `"use client";

import {
  Separator as AriaSeparator,
  SeparatorContext as AriaSeparatorContext,
  useSlottedContext,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type React from "react";

const separatorStyles = tv({
  base: "separator shrink-0 border-0 bg-border",
  variants: {
    orientation: {
      horizontal: "h-px w-full",
      vertical: "h-full w-px",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

interface SeparatorProps extends React.ComponentProps<typeof AriaSeparator> {}

const Separator = ({ orientation, className, ...props }: SeparatorProps) => {
  const ctx = useSlottedContext(AriaSeparatorContext);

  return (
    <AriaSeparator
      orientation={orientation}
      className={separatorStyles({
        orientation: orientation ?? ctx?.orientation,
        className,
      })}
      {...props}
    />
  );
};

export { Separator };
export type { SeparatorProps };
`,
					},
				],
			},
		},
	},
	{
		name: "skeleton",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/skeleton/basic.tsx",
						target: "ui/skeleton.tsx",
						content: `"use client";

import { createContext, useContext } from "react";

import { cn } from "../../lib/utils";

const SkeletonContext = createContext<boolean>(false);

interface SkeletonProviderProps {
  children: React.ReactNode;
  isLoading?: boolean;
}

export const SkeletonProvider = ({
  children,
  isLoading,
}: SkeletonProviderProps) => {
  if (!isLoading) {
    return children;
  }
  return (
    <SkeletonContext.Provider value={true}>
      <div inert className="skeleton-provider">
        {children}
      </div>
    </SkeletonContext.Provider>
  );
};

export const useSkeletonText = (children: React.ReactNode) => {
  const isInSkeleton = useContext(SkeletonContext);
  if (isInSkeleton) {
    return <span data-slot="skeleton-text">{children}</span>;
  }
  return children;
};

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  show?: boolean;
};
export function Skeleton({ className, show = true, ...props }: SkeletonProps) {
  if (!show) return props.children;
  return (
    <div
      className={cn(
        "relative block h-6 animate-pulse rounded-md bg-muted",
        props.children && "h-auto text-transparent *:invisible",
        className,
      )}
      {...props}
    />
  );
}
`,
					},
				],
			},
		},
	},
	{
		name: "slider",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/slider/basic.tsx",
						target: "ui/slider.tsx",
						content: `"use client";

import { use } from "react";
import { useSlotId } from "@react-aria/utils";
import {
  Slider as AriaSlider,
  SliderOutput as AriaSliderOutput,
  SliderStateContext as AriaSliderStateContext,
  SliderThumb as AriaSliderThumb,
  SliderTrack as AriaSliderTrack,
  TextContext as AriaTextContext,
  composeRenderProps,
  Provider,
} from "react-aria-components";
import { tv } from "tailwind-variants";

import { fieldStyles } from "@dotui/registry/ui/field";

const sliderStyles = tv({
  slots: {
    root: fieldStyles().field(),
    track:
      "relative my-1 grow cursor-pointer rounded-full bg-neutral disabled:cursor-not-allowed disabled:bg-disabled",
    filler:
      "pointer-events-none absolute rounded-full bg-accent disabled:bg-disabled",
    thumb: [
      "size-4 rounded-full bg-white shadow-md ring-primary/30 transition-[width,height,box-shadow]",
      "dragging:size-5 dragging:ring-0 ring-accent/30 hover:ring-4",
      "top-[50%] left-[50%]",
      "focus-visible:focus-ring",
      "disabled:border disabled:border-bg disabled:bg-disabled",
    ],
    output: "text-fg-muted text-sm disabled:text-fg-disabled",
  },
  variants: {
    orientation: {
      horizontal: {
        track: "h-1.5 w-48",
        filler: "top-0 h-full",
      },
      vertical: {
        root: "items-center",
        track: "h-48 w-2",
        filler: "bottom-0 w-full",
      },
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

const { root, track, filler, thumb, output } = sliderStyles();

/* -----------------------------------------------------------------------------------------------*/

interface SliderProps extends React.ComponentProps<typeof AriaSlider> {}

const Slider = ({ className, children, ...props }: SliderProps) => {
  const descriptionId = useSlotId();
  return (
    <AriaSlider
      className={composeRenderProps(className, (cn, { orientation }) =>
        root({ className: cn, orientation }),
      )}
      aria-describedby={descriptionId}
      {...props}
    >
      {composeRenderProps(children, (children) => (
        <Provider
          values={[
            [AriaTextContext, { slot: "description", id: descriptionId }],
          ]}
        >
          {children}
        </Provider>
      ))}
    </AriaSlider>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface SliderControlProps
  extends React.ComponentProps<typeof AriaSliderTrack> {}

const SliderControl = ({ className, ...props }: SliderControlProps) => {
  return (
    <AriaSliderTrack
      data-slot="slider-track"
      data-slider-track=""
      data-slider-control=""
      className={composeRenderProps(className, (cn, { orientation }) =>
        track({ orientation, className: cn }),
      )}
      {...props}
    >
      {composeRenderProps(
        props.children,
        (children, { state }) =>
          children ?? (
            <>
              {state.values.length < 3 && <SliderFiller />}
              {state.values.map((_, i) => (
                <SliderThumb key={i} index={i} />
              ))}
            </>
          ),
      )}
    </AriaSliderTrack>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface SliderFillerProps extends React.ComponentProps<"div"> {}

const SliderFiller = ({ className, style, ...props }: SliderFillerProps) => {
  const { orientation, getThumbPercent, values, isDisabled } = use(
    AriaSliderStateContext,
  )!;

  const getFillerDimensions = (): React.CSSProperties => {
    if (values.length === 1 && orientation === "horizontal")
      return { width: \`\${getThumbPercent(0) * 100}%\` };

    if (values.length === 1 && orientation === "vertical")
      return { height: \`\${getThumbPercent(0) * 100}%\` };

    if (orientation === "horizontal")
      return {
        left: \`\${getThumbPercent(0) * 100}%\`,
        width: \`\${Math.abs(getThumbPercent(0) - getThumbPercent(1)) * 100}%\`,
      };

    return {
      bottom: \`\${getThumbPercent(0) * 100}%\`,
      height: \`\${Math.abs(getThumbPercent(0) - getThumbPercent(1)) * 100}%\`,
    };
  };

  return (
    <div
      data-slot="slider-filler"
      data-rac=""
      data-disabled={isDisabled || undefined}
      className={filler({ orientation, className })}
      style={{ ...style, ...getFillerDimensions() }}
      {...props}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface SliderThumbProps
  extends React.ComponentProps<typeof AriaSliderThumb> {}

const SliderThumb = ({ className, ...props }: SliderThumbProps) => {
  return (
    <AriaSliderThumb
      data-slot="slider-thumb"
      className={composeRenderProps(
        className,
        (className, { state: { orientation } }) =>
          thumb({ orientation, className }),
      )}
      {...props}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface SliderOutputProps
  extends React.ComponentProps<typeof AriaSliderOutput> {}

const SliderOutput = ({ children, className, ...props }: SliderOutputProps) => {
  return (
    <AriaSliderOutput
      data-slot="slider-output"
      className={composeRenderProps(className, (className) =>
        output({ className }),
      )}
      {...props}
    >
      {composeRenderProps(
        children,
        (children, { state }) =>
          children ??
          state.values.map((_, i) => state.getThumbValueLabel(i)).join(" - "),
      )}
    </AriaSliderOutput>
  );
};

/* -----------------------------------------------------------------------------------------------*/

export { Slider, SliderControl, SliderFiller, SliderThumb, SliderOutput };

export type {
  SliderProps,
  SliderControlProps,
  SliderFillerProps,
  SliderThumbProps,
  SliderOutputProps,
};
`,
					},
				],
				registryDependencies: ["field", "focus-styles"],
				dependencies: ["react-aria"],
			},
		},
	},
	{
		name: "switch",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/switch/basic.tsx",
						target: "ui/switch.tsx",
						content: `"use client";

import {
  Switch as AriaSwitch,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type * as React from "react";
import type { SwitchRenderProps } from "react-aria-components";
import type { VariantProps } from "tailwind-variants";

import { createContext } from "@dotui/registry/lib/context";

const switchStyles = tv({
  slots: {
    root: "group/switch flex items-center justify-start gap-3 disabled:text-fg-disabled has-data-[slot=description]:items-start",
    indicator: [
      "inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-neutral transition-colors group-disabled:cursor-not-allowed group-disabled:border group-disabled:border-border-disabled group-disabled:bg-transparent group-selected:bg-border-focus group-selected:group-disabled:border-none group-selected:group-disabled:bg-disabled",
    ],
    thumb:
      "pointer-events-none block origin-right rounded-full bg-white shadow-lg ring-0 transition-all duration-200 group-disabled:bg-fg-disabled",
  },
  variants: {
    variant: {
      default: {
        indicator: "focus-reset group-focus-visible/switch:focus-ring",
      },
    },
    size: {
      sm: {
        indicator: "h-5 w-9",
        thumb:
          "size-4 group-selected/switch:group-pressed/switch:ml-3 group-selected/switch:ml-4 group-pressed/switch:w-5",
      },
      md: {
        indicator: "h-6 w-11",
        thumb:
          "size-5 group-selected/switch:group-pressed/switch:ml-4 group-selected/switch:ml-5 group-pressed/switch:w-6",
      },
      lg: {
        indicator: "h-7 w-13",
        thumb:
          "size-6 group-selected/switch:group-pressed/switch:ml-5 group-selected/switch:ml-6 group-pressed/switch:w-7",
      },
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

const { root, indicator, thumb } = switchStyles();

/* -----------------------------------------------------------------------------------------------*/

interface InternalSwitchContextValue
  extends SwitchRenderProps,
    VariantProps<typeof switchStyles> {}

const [InternalSwitchProvider, useInternalSwitch] =
  createContext<InternalSwitchContextValue>({
    strict: true,
  });

/* -----------------------------------------------------------------------------------------------*/

interface SwitchProps
  extends React.ComponentProps<typeof AriaSwitch>,
    VariantProps<typeof switchStyles> {}

const Switch = ({
  children,
  variant,
  size,
  className,
  ...props
}: SwitchProps) => {
  return (
    <AriaSwitch
      className={composeRenderProps(className, (className) =>
        root({ variant, size, className }),
      )}
      {...props}
    >
      {composeRenderProps(children, (children, renderProps) => {
        return (
          <InternalSwitchProvider value={{ ...renderProps, variant, size }}>
            {children ? (
              children
            ) : (
              <SwitchIndicator>
                <SwitchThumb />
              </SwitchIndicator>
            )}
          </InternalSwitchProvider>
        );
      })}
    </AriaSwitch>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface SwitchIndicatorProps extends React.ComponentProps<"span"> {}

const SwitchIndicator = ({ className, ...props }: SwitchIndicatorProps) => {
  const ctx = useInternalSwitch("SwitchIndicator");
  return (
    <span
      data-rac=""
      data-selected={ctx.isSelected || undefined}
      data-pressed={ctx.isPressed || undefined}
      data-hovered={ctx.isHovered || undefined}
      data-focused={ctx.isFocused || undefined}
      data-focus-visible={ctx.isFocusVisible || undefined}
      data-disabled={ctx.isDisabled || undefined}
      data-readonly={ctx.isReadOnly || undefined}
      className={indicator({ variant: ctx.variant, size: ctx.size, className })}
      {...props}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface SwitchThumbProps extends React.ComponentProps<"span"> {}

const SwitchThumb = ({ className, ...props }: SwitchThumbProps) => {
  const ctx = useInternalSwitch("SwitchThumb");
  return (
    <span
      className={thumb({ variant: ctx.variant, size: ctx.size, className })}
      {...props}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

export type { SwitchProps, SwitchIndicatorProps, SwitchThumbProps };
export { Switch, SwitchIndicator, SwitchThumb };
`,
					},
				],
				registryDependencies: ["focus-styles"],
			},
		},
	},
	{
		name: "table",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/table/basic.tsx",
						target: "ui/table.tsx",
						content: `"use client";

import { ChevronDownIcon, ChevronUpIcon, GripVerticalIcon } from "lucide-react";
import {
  Button as AriaButton,
  Cell as AriaCell,
  Collection as AriaCollection,
  Column as AriaColumn,
  ColumnResizer as AriaColumnResizer,
  ResizableTableContainer as AriaResizableTableContainer,
  Row as AriaRow,
  Table as AriaTable,
  TableBody as AriaTableBody,
  TableHeader as AriaTableHeader,
  TableLoadMoreItem as AriaTableLoadMoreItem,
  composeRenderProps,
  useTableOptions,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type {
  RowProps as AriaRowProps,
  TableBodyProps as AriaTableBodyProps,
  TableHeaderProps as AriaTableHeaderProps,
} from "react-aria-components";

import { cn } from "@dotui/registry/lib/utils";
import { Checkbox } from "@dotui/registry/ui/checkbox";
import { Loader } from "@dotui/registry/ui/loader";

const tableStyles = tv({
  slots: {
    container: "relative scroll-pt-[2.321rem] overflow-auto rounded-lg border",
    table: "w-full text-sm",
    header: "sticky top-0 z-10 bg-bg",
    column: "h-10 whitespace-nowrap px-2 text-left align-middle font-medium",
    resizer: "",
    body: "",
    row: "",
    cell: "whitespace-nowrap p-2 align-middle",
    loadMore: [
      "**:data-[slot=loader]:-translate-x-1/2 relative h-7 **:data-[slot=loader]:absolute **:data-[slot=loader]:top-0 **:data-[slot=loader]:left-1/2",
      "[&_[data-slot=loader]_svg]:size-4",
    ],
  },
});

const { container, table, header, column, resizer, body, row, cell, loadMore } =
  tableStyles();

/* -----------------------------------------------------------------------------------------------*/

interface TableContainerProps
  extends React.ComponentProps<typeof AriaResizableTableContainer> {
  resizable?: boolean;
}

const TableContainer = ({
  resizable,
  className,
  ...props
}: TableContainerProps) => {
  if (resizable) {
    return (
      <AriaResizableTableContainer
        className={container({ className })}
        {...props}
      />
    );
  }
  return <div className={container({ className })} {...props} />;
};

/* -----------------------------------------------------------------------------------------------*/

interface TableProps extends React.ComponentProps<typeof AriaTable> {
  resizable?: boolean;
}

const Table = ({ className, resizable, ...props }: TableProps) => {
  return (
    <TableContainer resizable={resizable}>
      <AriaTable
        className={composeRenderProps(className, (cn) =>
          table({ className: cn }),
        )}
        {...props}
      />
    </TableContainer>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface TableHeaderProps<T extends object> extends AriaTableHeaderProps<T> {}

const TableHeader = <T extends object>({
  className,
  columns,
  children,
  ...props
}: TableHeaderProps<T>) => {
  const { selectionBehavior, selectionMode, allowsDragging } =
    useTableOptions();
  return (
    <AriaTableHeader
      data-slot="table-header"
      className={composeRenderProps(className, (cn) =>
        header({ className: cn }),
      )}
      {...props}
    >
      {allowsDragging && <TableColumn />}
      {selectionBehavior === "toggle" && (
        <TableColumn>
          {selectionMode === "multiple" && <Checkbox slot="selection" />}
        </TableColumn>
      )}
      <AriaCollection items={columns}>{children}</AriaCollection>
    </AriaTableHeader>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface TableColumnProps extends React.ComponentProps<typeof AriaColumn> {
  allowsResizing?: boolean;
}

const TableColumn = ({
  allowsResizing,
  children,
  className,
  ...props
}: TableColumnProps) => {
  return (
    <AriaColumn
      data-slot="table-column"
      className={composeRenderProps(className, (cn) =>
        column({ className: cn }),
      )}
      {...props}
    >
      {composeRenderProps(
        children,
        (children, { allowsSorting, sortDirection }) => (
          <div className="flex items-center">
            <span className="flex-1 truncate">{children}</span>
            {allowsSorting &&
              (sortDirection === "ascending" ? (
                <ChevronUpIcon aria-hidden className="size-3 text-fg-muted" />
              ) : (
                <ChevronDownIcon aria-hidden className="size-3 text-fg-muted" />
              ))}
            {!props.width && allowsResizing && (
              <AriaColumnResizer className={resizer()} />
            )}
          </div>
        ),
      )}
    </AriaColumn>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface TableBodyProps<T extends object> extends AriaTableBodyProps<T> {
  isLoading?: boolean;
  onLoadMore?: () => void;
}

const TableBody = <T extends object>({
  renderEmptyState = () => "No results found.",
  children,
  className,
  items,
  isLoading,
  onLoadMore,
  ...props
}: TableBodyProps<T>) => {
  return (
    <AriaTableBody
      renderEmptyState={renderEmptyState}
      className={composeRenderProps(className, (className) =>
        body({ className }),
      )}
      {...props}
    >
      <AriaCollection items={items}>{children}</AriaCollection>
      <TableLoadMore isLoading={isLoading} onLoadMore={onLoadMore} />
    </AriaTableBody>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface TableRowProps<T extends object> extends AriaRowProps<T> {}

function TableRow<T extends object>({
  columns,
  children,
  className,
  ...props
}: TableRowProps<T>) {
  const { selectionBehavior, allowsDragging } = useTableOptions();

  return (
    <AriaRow
      className={composeRenderProps(className, (cn) => row({ className: cn }))}
      {...props}
    >
      {allowsDragging && (
        <TableCell className="cursor-grab">
          <AriaButton
            slot="drag"
            className={cn(
              "focus-reset focus-visible:focus-ring",
              "inline-flex items-center justify-center rounded-xs text-fg-muted [&_svg]:size-4",
            )}
          >
            <GripVerticalIcon />
          </AriaButton>
        </TableCell>
      )}
      {selectionBehavior === "toggle" && (
        <TableCell>
          <Checkbox slot="selection" />
        </TableCell>
      )}
      <AriaCollection items={columns}>{children}</AriaCollection>
    </AriaRow>
  );
}

/* -----------------------------------------------------------------------------------------------*/

interface TableCellProps extends React.ComponentProps<typeof AriaCell> {}

const TableCell = ({ className, ...props }: TableCellProps) => {
  return (
    <AriaCell
      data-slot="table-cell"
      className={composeRenderProps(className, (cn) => cell({ className: cn }))}
      {...props}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface TableLoadMoreProps
  extends React.ComponentProps<typeof AriaTableLoadMoreItem> {}

const TableLoadMore = ({ className, ...props }: TableLoadMoreProps) => {
  return (
    <AriaTableLoadMoreItem className={loadMore({ className })} {...props}>
      <Loader aria-label="Loading more..." />
    </AriaTableLoadMoreItem>
  );
};

/* -----------------------------------------------------------------------------------------------*/

export {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableLoadMore,
  TableRow,
  TableCell,
};

export type {
  TableProps,
  TableHeaderProps,
  TableColumnProps,
  TableBodyProps,
  TableRowProps,
  TableCellProps,
  TableLoadMoreProps,
};
`,
					},
				],
				registryDependencies: ["checkbox", "focus-styles"],
			},
		},
	},
	{
		name: "tabs",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/tabs/basic.tsx",
						target: "ui/tabs.tsx",
						content: `"use client";

import {
  SelectionIndicator as AriaSelectionIndicator,
  Tab as AriaTab,
  TabList as AriaTabList,
  TabPanel as AriaTabPanel,
  Tabs as AriaTabs,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type * as React from "react";

import { createContext } from "@dotui/registry/lib/context";

const tabsStyles = tv({
  slots: {
    root: "flex flex-col gap-2",
    list: "flex",
    tab: "relative cursor-default p-2 selected:text-fg text-fg-muted text-sm transition-colors hover:text-fg [&:has([data-tab-indicator])_>_[data-tab-default-indicator]]:hidden",
    selectionIndicator: [
      "absolute rounded-full bg-accent duration-150 ease-out motion-safe:transition-[translate,width,height]",
    ],
    panel: "",
  },
  variants: {
    orientation: {
      horizontal: {
        root: "flex-col",
        list: "flex-row border-b",
        selectionIndicator: "bottom-0 left-0 h-0.5 w-full translate-y-px",
      },
      vertical: {
        root: "flex-row",
        list: "flex-col border-r",
        selectionIndicator: "right-0 bottom-0 h-full w-0.5",
      },
    },
  },
});

const { root, list, tab, selectionIndicator, panel } = tabsStyles();

/* -----------------------------------------------------------------------------------------------*/

const [TabsProvider, useTabsContext] = createContext<TabsProps["orientation"]>({
  name: "TabsContext",
});

/* -----------------------------------------------------------------------------------------------*/

interface TabsProps extends React.ComponentProps<typeof AriaTabs> {}

const Tabs = ({ className, ...props }: TabsProps) => {
  return (
    <AriaTabs
      className={composeRenderProps(className, (cn, { orientation }) =>
        root({ orientation, className: cn }),
      )}
      {...props}
    >
      {composeRenderProps(props.children, (children, { orientation }) => (
        <TabsProvider value={orientation}>{children}</TabsProvider>
      ))}
    </AriaTabs>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface TabListProps extends React.ComponentProps<typeof AriaTabList> {}

const TabList = ({ className, ...props }: TabListProps) => {
  return (
    <AriaTabList
      className={composeRenderProps(className, (cn, { orientation }) =>
        list({ orientation, className: cn }),
      )}
      {...props}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface TabProps extends React.ComponentProps<typeof AriaTab> {}

const Tab = ({ className, ...props }: TabProps) => {
  return (
    <AriaTab
      className={composeRenderProps(className, (cn) => tab({ className: cn }))}
      {...props}
    >
      {composeRenderProps(props.children, (children) => (
        <>
          {children}
          <TabIndicator />
        </>
      ))}
    </AriaTab>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface TabIndicatorProps
  extends React.ComponentProps<typeof AriaSelectionIndicator> {}

const TabIndicator = ({ className, ...props }: TabIndicatorProps) => {
  const orientation = useTabsContext("TabIndicator");
  return (
    <AriaSelectionIndicator
      data-tab-indicator=""
      className={composeRenderProps(className, (cn) =>
        selectionIndicator({ orientation, className: cn }),
      )}
      {...props}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface TabPanelProps extends React.ComponentProps<typeof AriaTabPanel> {}

const TabPanel = ({ className, ...props }: TabPanelProps) => {
  return (
    <AriaTabPanel
      data-tab-panel
      className={composeRenderProps(className, (cn) =>
        panel({ className: cn }),
      )}
      {...props}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

export { Tabs, TabList, Tab, TabPanel, TabIndicator };
export type {
  TabsProps,
  TabListProps,
  TabProps,
  TabPanelProps,
  TabIndicatorProps,
};
`,
					},
				],
				registryDependencies: ["focus-styles"],
			},
		},
	},
	{
		name: "tag-group",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/tag-group/basic.tsx",
						target: "ui/tag-group.tsx",
						content: `"use client";

import { XIcon } from "lucide-react";
import {
  Tag as AriaTag,
  TagGroup as AriaTagGroup,
  TagList as AriaTagList,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type {
  TagGroupProps as AriaTagGroupProps,
  TagListProps as AriaTagListProps,
  TagProps as AriaTagProps,
} from "react-aria-components";

import { Button } from "@dotui/registry/ui/button";

const tagGroupStyles = tv({
  slots: {
    group: "flex flex-col items-start gap-2",
    list: "flex w-full flex-wrap gap-1",
    tag: [
      "focus-reset focus-visible:focus-ring",
      "focus-reset focus-visible:focus-ring inline-flex cursor-pointer items-center justify-center gap-2 rounded-md font-medium text-sm leading-normal ring-offset-background transition-colors disabled:cursor-default disabled:bg-disabled disabled:text-fg-disabled",
    ],
  },
});

const { group, list, tag } = tagGroupStyles();

/* -----------------------------------------------------------------------------------------------*/

interface TagGroupProps extends AriaTagGroupProps {}

function TagGroup({ className, ...props }: TagGroupProps) {
  return <AriaTagGroup {...props} className={group({ className })} />;
}

/* -----------------------------------------------------------------------------------------------*/

interface TagListProps<T> extends AriaTagListProps<T> {}

function TagList<T extends object>(props: TagListProps<T>) {
  return (
    <AriaTagList
      {...props}
      className={composeRenderProps(props.className, (className) =>
        list({ className }),
      )}
    />
  );
}

/* -----------------------------------------------------------------------------------------------*/

interface TagProps extends AriaTagProps {}

function Tag({ className, ...props }: TagProps) {
  const textValue =
    typeof props.children === "string" ? props.children : undefined;

  return (
    <AriaTag
      textValue={textValue}
      className={composeRenderProps(className, (className) =>
        tag({ className }),
      )}
      {...props}
    >
      {composeRenderProps(props.children, (children, { allowsRemoving }) => (
        <>
          {children}
          {allowsRemoving && (
            <Button variant="quiet" slot="remove">
              <XIcon />
            </Button>
          )}
        </>
      ))}
    </AriaTag>
  );
}

/* -----------------------------------------------------------------------------------------------*/

export { TagGroup, TagList, Tag };

export type { TagProps, TagGroupProps, TagListProps };
`,
					},
				],
				registryDependencies: ["field", "button", "focus-styles"],
			},
		},
	},
	{
		name: "text-field",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/text-field/basic.tsx",
						target: "ui/text-field.tsx",
						content: `"use client";

import {
  TextField as AriaTextField,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type * as React from "react";

import { fieldStyles } from "@dotui/registry/ui/field";

const textFieldStyles = tv({
  base: [
    "[&.flex-1]:*:data-[slot=input]:w-full [&.w-full]:*:data-[slot=input]:w-full",
    fieldStyles().field({ orientation: "vertical" }),
  ],
});

/* -----------------------------------------------------------------------------------------------*/

interface TextFieldProps extends React.ComponentProps<typeof AriaTextField> {}

const TextField = ({ className, ...props }: TextFieldProps) => {
  return (
    <AriaTextField
      data-field=""
      data-textfield=""
      data-slot="text-field"
      className={composeRenderProps(className, (className) =>
        textFieldStyles({ className }),
      )}
      {...props}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

export { TextField };

export type { TextFieldProps };
`,
					},
				],
				registryDependencies: ["field", "input"],
			},
		},
	},
	{
		name: "text",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/text/basic.tsx",
						target: "ui/text.tsx",
						content: `"use client";

import { Text as AriaText } from "react-aria-components";
import type { TextProps as AriaTextProps } from "react-aria-components";

import { useSkeletonText } from "@dotui/registry/ui/skeleton";

interface TextProps extends AriaTextProps {}

const Text = ({ children, ...props }: TextProps) => {
  children = useSkeletonText(children);

  return <AriaText {...props}>{children}</AriaText>;
};

export type { TextProps };
export { Text };
`,
					},
				],
			},
		},
	},
	{
		name: "time-field",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/time-field/basic.tsx",
						target: "ui/time-field.tsx",
						content: `"use client";

import {
  TimeField as AriaTimeField,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type {
  TimeFieldProps as AriaTimeFieldProps,
  TimeValue,
} from "react-aria-components";

import { fieldStyles } from "@dotui/registry/ui/field";

const timeFieldStyles = tv({
  extend: fieldStyles().field(),
  base: "",
});

/* -----------------------------------------------------------------------------------------------*/

interface TimeFieldProps<T extends TimeValue> extends AriaTimeFieldProps<T> {}

const TimeField = <T extends TimeValue>({
  className,
  ...props
}: TimeFieldProps<T>) => {
  return (
    <AriaTimeField
      className={composeRenderProps(className, (className) =>
        timeFieldStyles({ className }),
      )}
      {...props}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

export type { TimeFieldProps };
export { TimeField };
`,
					},
				],
				registryDependencies: ["field", "input"],
			},
		},
	},
	{
		name: "toast",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/toast/basic.tsx",
						target: "ui/toast.tsx",
						content: `"use client";

import {
  UNSTABLE_Toast as AriaToast,
  UNSTABLE_ToastContent as AriaToastContent,
  UNSTABLE_ToastQueue as AriaToastQueue,
  UNSTABLE_ToastRegion as AriaToastRegion,
  composeRenderProps,
  Text,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type { ToastProps as AriaToastProps } from "react-aria-components";

const toastStyles = tv({
  slots: {
    region: [
      "focus-reset focus-visible:focus-ring",
      "fixed right-4 bottom-4 z-50 flex max-h-[calc(100vh-2rem)] flex-col gap-2 overflow-hidden outline-none",
    ],
    toast: "relative w-[min(380px,90vw)] rounded-lg border bg-bg p-4 shadow-lg",
    content: "flex flex-col gap-1",
    title: "text-base",
    description: "text-fg-muted text-sm",
    actions: "",
    close: "absolute top-3.5 right-3 size-7",
  },
  variants: {
    variant: {
      neutral: { toast: "border-border bg-card" },
      success: {
        toast: "border-border-success bg-success",
        title: "text-fg-success",
      },
      warning: {
        toast: "border-border-warning bg-warning",
      },
      danger: {
        toast: "border-border-danger bg-danger",
      },
      error: {
        toast: "border-border-danger bg-danger",
      },
      info: {
        toast: "border-border-info bg-info",
      },
    },
  },
  defaultVariants: {
    variant: "neutral",
  },
});

const { region, toast, content, actions, title, description } = toastStyles();

interface Toast {
  title: string;
  description?: string;
  variant?: "success" | "error" | "warning" | "info" | "neutral" | "danger";
}

const queue = new AriaToastQueue<Toast>();

const Toaster = () => {
  return (
    <AriaToastRegion queue={queue} className={region()}>
      {({ toast }) => <Toast toast={toast} />}
    </AriaToastRegion>
  );
};

interface ToastProps extends AriaToastProps<Toast> {}

function Toast({ className, ...props }: ToastProps) {
  return (
    <AriaToast
      className={composeRenderProps(className, (className) =>
        toast({ className, variant: props.toast.content.variant }),
      )}
      {...props}
    >
      {({ toast }) => (
        <>
          <AriaToastContent className={content()}>
            <Text slot="title" className={title()}>
              {toast.content.title}
            </Text>
            {toast.content.description ? (
              <Text slot="description" className={description()}>
                {toast.content.description}
              </Text>
            ) : null}
          </AriaToastContent>
          <div className={actions()}>
            {/* <Button
              variant="quiet"
              size="sm"
              slot="close"
              className={close()}
              aria-label="Close"
            >
              <XIcon className="size-4" />
            </Button> */}
          </div>
        </>
      )}
    </AriaToast>
  );
}

export { Toaster, queue as toast };
`,
					},
				],
			},
		},
	},
	{
		name: "toggle-button-group",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/toggle-button-group/basic.tsx",
						target: "ui/toggle-button-group.tsx",
						content: `"use client";

import {
  ToggleButtonGroup as AriaToggleButtonGroup,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

import { ToggleButtonProvider } from "@dotui/registry/ui/toggle-button";
import type { toggleButtonStyles } from "@dotui/registry/ui/toggle-button";

const toggleGroupStyles = tv({
  slots: {
    root: "flex w-fit items-center",
    item: [
      "selected:z-11 min-w-0 shrink-0 rounded-none shadow-none hover:z-10 focus:z-10 focus-visible:z-12 selected:focus-visible:z-12",
    ],
  },
  variants: {
    orientation: {
      horizontal: {
        root: "has-data-[variant=default]:-space-x-px flex-row",
        item: "first:rounded-l-md last:rounded-r-md",
      },
      vertical: {
        root: "has-data-[variant=default]:-space-y-px flex-col",
        item: "first:rounded-t-md last:rounded-b-md",
      },
    },
  },
});

const { root, item } = toggleGroupStyles();

/* -----------------------------------------------------------------------------------------------*/

interface ToggleButtonGroupProps
  extends React.ComponentProps<typeof AriaToggleButtonGroup>,
    VariantProps<typeof toggleButtonStyles> {}

const ToggleButtonGroup = ({
  variant,
  size,
  orientation = "horizontal",
  className,
  ...props
}: ToggleButtonGroupProps) => {
  return (
    <ToggleButtonProvider
      variant={variant}
      size={size}
      className={item({ orientation })}
    >
      <AriaToggleButtonGroup
        orientation={orientation}
        className={composeRenderProps(className, (className) =>
          root({
            orientation,
            className,
          }),
        )}
        {...props}
      />
    </ToggleButtonProvider>
  );
};

export type { ToggleButtonGroupProps };
export { ToggleButtonGroup };
`,
					},
				],
				registryDependencies: ["toggle-button"],
			},
		},
	},
	{
		name: "toggle-button",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/toggle-button/basic.tsx",
						target: "ui/toggle-button.tsx",
						content: `"use client";

import {
  ToggleButton as AriaToggleButton,
  ToggleButtonContext as AriaToggleButtonContext,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type * as React from "react";
import type { VariantProps } from "tailwind-variants";

import { useButtonAspect } from "@dotui/registry/hooks/use-button-aspect";
import { createVariantsContext } from "@dotui/registry/lib/context";

const toggleButtonStyles = tv({
  base: [
    "inline-flex shrink-0 cursor-default items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm leading-normal transition-[background-color,border-color,color,box-shadow] data-icon-only:px-0",

    // focus state
    "focus-reset focus-visible:focus-ring",

    // selected state
    "selected:bg-selected selected:pressed:bg-selected-active not-selected:text-fg-muted selected:text-fg-on-selected selected:hover:bg-selected-hover",

    // disabled state
    "disabled:cursor-not-allowed disabled:border-border-disabled disabled:bg-disabled disabled:selected:bg-disabled disabled:selected:text-fg-disabled disabled:text-fg-disabled",
  ],
  variants: {
    variant: {
      default:
        "border pressed:border-border-active selected:not-data-disabled:border-border-active bg-neutral pressed:bg-neutral-active text-fg-on-neutral hover:border-border-hover hover:bg-neutral-hover",
      quiet: "bg-transparent pressed:bg-inverse/20 text-fg hover:bg-inverse/10",
    },
    size: {
      sm: "h-8 px-3 data-icon-only:w-8 [&_svg]:size-4",
      md: "h-9 px-4 data-icon-only:w-9 [&_svg]:size-4",
      lg: "h-10 px-5 data-icon-only:w-10 [&_svg]:size-5",
    },
  },
});

type ToggleButtonVariants = VariantProps<typeof toggleButtonStyles>;

/* -----------------------------------------------------------------------------------------------*/

const [ToggleButtonProvider, useContextProps] = createVariantsContext<
  ToggleButtonVariants,
  React.ComponentProps<typeof AriaToggleButton>
>(AriaToggleButtonContext);

/* -----------------------------------------------------------------------------------------------*/

interface ToggleButtonProps
  extends React.ComponentProps<typeof AriaToggleButton>,
    ToggleButtonVariants {
  aspect?: "default" | "square" | "auto";
}

const ToggleButton = (localProps: ToggleButtonProps) => {
  const {
    variant = "default",
    size = "md",
    aspect = "auto",
    className,
    children,
    ...props
  } = useContextProps(localProps);

  const isIconOnly = useButtonAspect(children, aspect);

  return (
    <AriaToggleButton
      data-slot="button"
      data-icon-only={isIconOnly || undefined}
      data-variant={variant}
      data-size={size}
      className={composeRenderProps(className, (cn) =>
        toggleButtonStyles({
          variant,
          size,
          className: cn,
        }),
      )}
      {...props}
    >
      {composeRenderProps(children, (children) => (
        <>
          {typeof children === "string" ? (
            <span className="truncate">{children}</span>
          ) : (
            children
          )}
        </>
      ))}
    </AriaToggleButton>
  );
};

/* -----------------------------------------------------------------------------------------------*/

export { ToggleButton, ToggleButtonProvider, toggleButtonStyles };

export type { ToggleButtonProps };
`,
					},
				],
				registryDependencies: ["focus-styles"],
			},
		},
	},
	{
		name: "tooltip",
		type: "registry:ui",
		defaultVariant: "basic",
		variants: {
			basic: {
				files: [
					{
						type: "registry:ui",
						path: "ui/tooltip/basic.tsx",
						target: "ui/tooltip.tsx",
						content: `"use client";

import {
  OverlayArrow as AriaOverlayArrow,
  Tooltip as AriaTooltip,
  TooltipTrigger as AriaTooltipTrigger,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type * as React from "react";
import type { VariantProps } from "tailwind-variants";

const tooltipStyles = tv({
  slots: {
    content: [
      "w-fit max-w-xs origin-(--trigger-anchor-point) rounded-sm bg-tooltip px-3 py-1.5 text-center text-fg-on-tooltip text-xs outline-none forced-color-adjust-none",
      "transition-[transform,opacity,scale] duration-200 ease-out will-change-[transform,opacity,scale] [--slide-offset:calc(var(--spacing)*0.5)]",
      "entering:transform-(--origin) entering:scale-95 entering:opacity-0",
      "exiting:transform-(--origin) exiting:scale-95 exiting:opacity-0 exiting:duration-150",
      "placement-bottom:[--origin:translateY(calc(var(--slide-offset)*-1))] placement-left:[--origin:translateX(var(--slide-offset))] placement-right:[--origin:translateX(calc(var(--slide-offset)*-1))] placement-top:[--origin:translateY(var(--slide-offset))]",
    ],
    arrow: [
      "block [&>svg]:size-2.5 [&>svg]:fill-tooltip",
      "placement-left:[&>svg]:-rotate-90 placement-bottom:[&>svg]:rotate-180 placement-right:[&>svg]:rotate-90",
    ],
    trigger: "focus-reset focus-visible:focus-ring",
  },
});

const { content, arrow } = tooltipStyles();

/* -----------------------------------------------------------------------------------------------*/
interface TooltipProps
  extends React.ComponentProps<typeof AriaTooltipTrigger> {}

const Tooltip = ({ delay = 700, closeDelay = 0, ...props }: TooltipProps) => (
  <AriaTooltipTrigger delay={delay} closeDelay={closeDelay} {...props} />
);

/* -----------------------------------------------------------------------------------------------*/

interface TooltipContentProps
  extends React.ComponentProps<typeof AriaTooltip>,
    VariantProps<typeof tooltipStyles> {
  hideArrow?: boolean;
}

function TooltipContent({
  offset = 10,
  hideArrow = false,
  className,
  ...props
}: TooltipContentProps) {
  return (
    <AriaTooltip
      data-slot="tooltip"
      offset={offset}
      className={composeRenderProps(className, (className) =>
        content({ className }),
      )}
      {...props}
    >
      {composeRenderProps(props.children, (children) => (
        <>
          {children}
          {!hideArrow && <TooltipArrow />}
        </>
      ))}
    </AriaTooltip>
  );
}

/* -----------------------------------------------------------------------------------------------*/

interface TooltipArrowProps extends React.ComponentProps<"svg"> {}

function TooltipArrow({ className }: TooltipArrowProps) {
  return (
    <AriaOverlayArrow className={arrow({ className })}>
      <svg data-slot="tooltip-arrow" width={8} height={8} viewBox="0 0 8 8">
        <path d="M0 0 L4 4 L8 0" />
      </svg>
    </AriaOverlayArrow>
  );
}

/* -----------------------------------------------------------------------------------------------*/

export { Tooltip, TooltipContent };

export type { TooltipProps, TooltipContentProps };
`,
					},
				],
			},
		},
	},
] as const;
