import * as React from "react";
import Link from "next/link";
import { Slot } from "@radix-ui/react-slot";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils/classes";

interface BreadcrumbsRootProps extends React.ComponentPropsWithoutRef<"nav"> {
  separator?: React.ReactNode;
}

const BreadcrumbsRoot = React.forwardRef<HTMLElement, BreadcrumbsRootProps>(
  ({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumbs" {...props} />
);
BreadcrumbsRoot.displayName = "BreadcrumbsRoot";

const BreadcrumbsList = React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<"ol">
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(
      "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
      className
    )}
    {...props}
  />
));
BreadcrumbsList.displayName = "BreadcrumbsList";

const BreadcrumbsListItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("inline-flex items-center gap-1.5", className)}
    {...props}
  />
));
BreadcrumbsListItem.displayName = "BreadcrumbsListItem";

const BreadcrumbsLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a"> & {
    asChild?: boolean;
  }
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      ref={ref}
      className={cn("transition-colors hover:text-foreground", className)}
      {...props}
    />
  );
});
BreadcrumbsLink.displayName = "BreadcrumbsLink";

const BreadcrumbsPage = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn("font-normal text-foreground", className)}
    {...props}
  />
));
BreadcrumbsPage.displayName = "BreadcrumbsPage";

const BreadcrumbsSeparator = ({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn("[&>svg]:size-3.5", className)}
    {...props}
  >
    {children ?? <ChevronRight />}
  </li>
);
BreadcrumbsSeparator.displayName = "BreadcrumbsSeparator";

const BreadcrumbsEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
);
BreadcrumbsEllipsis.displayName = "BreadcrumbsElipssis";

const BreadcrumbsItem = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a"> & {
    asChild?: boolean;
    isCurrent?: boolean;
  }
>(({ asChild, isCurrent, href, className, ...props }, ref) => {
  if (!href || isCurrent) {
    const Comp = asChild ? Slot : "span";
    const c
    return <Comp ref={ref} {...props} />;
  }

  const Comp = asChild ? Slot : Link;
  return (
    <Comp
      ref={ref}
      className={cn("transition-colors hover:text-foreground", className)}
      href={href}
      {...props}
    />
  );
});
BreadcrumbsItem.displayName = "BreadcrumbsItem";

const Breadcrumbs = React.forwardRef<HTMLElement, BreadcrumbsRootProps>(
  ({ children, ...props }, ref) => {
    const items = React.Children.toArray(children).filter((child) => {
      return React.isValidElement(child) && child.type === BreadcrumbsItem;
    }) as Array<React.ReactElement>;
    const renderedItems = items.map((item, index) => {
      const isLast = index === items.length - 1;
      return (
        <React.Fragment key={index}>
          <BreadcrumbsListItem>{item}</BreadcrumbsListItem>
          {!isLast && <BreadcrumbsSeparator />}
        </React.Fragment>
      );
    });

    return (
      <BreadcrumbsRoot ref={ref} {...props}>
        <BreadcrumbsList>{renderedItems}</BreadcrumbsList>
      </BreadcrumbsRoot>
    );
  }
);
Breadcrumbs.displayName = "Breadcrumbs";

export {
  Breadcrumbs,
  BreadcrumbsItem,
  BreadcrumbsRoot,
  BreadcrumbsList,
  BreadcrumbsListItem,
  BreadcrumbsLink,
  BreadcrumbsPage,
  BreadcrumbsSeparator,
  BreadcrumbsEllipsis,
};
