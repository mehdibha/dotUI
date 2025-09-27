import * as React from "react";
import { tv } from "tailwind-variants";

const cardStyles = tv({
  slots: {
    root: "bg-card text-fg flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
    header:
      "@container/card-header has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6",
    title: "font-semibold leading-none",
    description: "text-fg-muted text-sm",
    action: "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
    content: "flex-1 px-6",
    footer: "[.border-t]:pt-6 flex items-center px-6",
  },
});

const { root, header, title, description, action, content, footer } =
  cardStyles();

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card" className={root({ className })} {...props} />;
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="card-header" className={header({ className })} {...props} />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="card-title" className={title({ className })} {...props} />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={description({ className })}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="card-action" className={action({ className })} {...props} />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={content({ className })}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="card-footer" className={footer({ className })} {...props} />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
