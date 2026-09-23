import type * as React from "react";
import { tv } from "tailwind-variants";

const cardVariants = tv({
  slots: {
    root: "group/card flex flex-col rounded-lg border border-(--card-border) bg-card shadow-(--shadow-card,0_0_#0000) [--surface-radius:var(--radius-lg)] has-[>img:first-child]:pt-0 *:[img]:first:rounded-t-lg *:[img]:last:rounded-b-lg gap-6 py-6 text-sm has-data-card-footer:pb-0 data-[size=sm]:gap-4 data-[size=sm]:py-4 data-[size=sm]:has-data-card-footer:pb-0",
    header:
      "group/card-header @container/card-header grid auto-rows-min items-start rounded-t-lg has-data-card-action:grid-cols-[1fr_auto] has-data-card-description:grid-rows-[auto_auto] gap-1 px-6 group-data-[size=sm]/card:px-4 [.border-b]:pb-6 group-data-[size=sm]/card:[.border-b]:pb-4",
    title:
      "font-heading text-base leading-normal font-medium group-data-[size=sm]/card:text-sm",
    description: "text-fg-muted text-sm",
    action: "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
    content: "px-6 group-data-[size=sm]/card:px-4",
    footer:
      "flex items-center rounded-b-lg px-6 pb-6 group-data-[size=sm]/card:px-4 group-data-[size=sm]/card:pb-4 [.border-t]:pt-6 group-data-[size=sm]/card:[.border-t]:pt-4",
  },
});

const { root, header, title, description, action, content, footer } =
  cardVariants();

/* -------------------------------------------------------------------------- */

interface CardProps extends React.ComponentProps<"div"> {
  size?: "sm" | "default";
}

function Card({ className, size = "default", ...props }: CardProps) {
  return (
    <div
      data-card=""
      data-size={size}
      className={root({ className })}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */

interface CardHeaderProps extends React.ComponentProps<"div"> {}

function CardHeader({ className, ...props }: CardHeaderProps) {
  return (
    <div data-card-header="" className={header({ className })} {...props} />
  );
}

/* -------------------------------------------------------------------------- */

interface CardTitleProps extends React.ComponentProps<"div"> {}

function CardTitle({ className, ...props }: CardTitleProps) {
  return <div data-card-title="" className={title({ className })} {...props} />;
}

/* -------------------------------------------------------------------------- */

interface CardDescriptionProps extends React.ComponentProps<"div"> {}

function CardDescription({ className, ...props }: CardDescriptionProps) {
  return (
    <div
      data-card-description=""
      className={description({ className })}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */

interface CardActionProps extends React.ComponentProps<"div"> {}

function CardAction({ className, ...props }: CardActionProps) {
  return (
    <div data-card-action="" className={action({ className })} {...props} />
  );
}

/* -------------------------------------------------------------------------- */

interface CardContentProps extends React.ComponentProps<"div"> {}

function CardContent({ className, ...props }: CardContentProps) {
  return (
    <div data-card-content="" className={content({ className })} {...props} />
  );
}

/* -------------------------------------------------------------------------- */

interface CardFooterProps extends React.ComponentProps<"div"> {}

function CardFooter({ className, ...props }: CardFooterProps) {
  return (
    <div data-card-footer="" className={footer({ className })} {...props} />
  );
}

/* -------------------------------------------------------------------------- */

export type {
  CardActionProps,
  CardContentProps,
  CardDescriptionProps,
  CardFooterProps,
  CardHeaderProps,
  CardProps,
  CardTitleProps,
};
export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};
