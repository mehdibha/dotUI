import { tv } from "tailwind-variants";
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
