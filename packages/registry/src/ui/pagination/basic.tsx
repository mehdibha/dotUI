import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import { Link as AriaLink, composeRenderProps } from "react-aria-components";
import { tv } from "tailwind-variants";
import type * as React from "react";
import type { LinkProps as AriaLinkProps } from "react-aria-components";
import type { VariantProps } from "tailwind-variants";

import { buttonStyles } from "@dotui/registry/ui/button";

const paginationStyles = tv({
  slots: {
    root: "mx-auto flex w-full justify-center",
    list: "flex flex-row items-center gap-1",
    item: "",
    link: "",
    previous: "gap-1 px-2.5 sm:pl-2.5",
    next: "gap-1 px-2.5 sm:pr-2.5",
    ellipsis: "flex size-9 items-center justify-center",
  },
});

const { root, list, item, link, previous, next, ellipsis } = paginationStyles();

/* -----------------------------------------------------------------------------------------------*/

interface PaginationProps extends React.ComponentProps<"nav"> {}

function Pagination({ className, ...props }: PaginationProps) {
  return (
    <nav
      aria-label="pagination"
      data-slot="pagination"
      className={root({ className })}
      {...props}
    />
  );
}

/* -----------------------------------------------------------------------------------------------*/

interface PaginationListProps extends React.ComponentProps<"ul"> {}

function PaginationList({ className, ...props }: PaginationListProps) {
  return (
    <ul
      data-slot="pagination-content"
      className={list({ className })}
      {...props}
    />
  );
}

/* -----------------------------------------------------------------------------------------------*/

interface PaginationItemProps extends React.ComponentProps<"li"> {}

function PaginationItem({ className, ...props }: PaginationItemProps) {
  return (
    <li
      data-slot="pagination-item"
      className={item({ className })}
      {...props}
    />
  );
}

/* -----------------------------------------------------------------------------------------------*/

interface PaginationLinkProps
  extends AriaLinkProps,
    Omit<VariantProps<typeof buttonStyles>, "variant"> {
  isActive?: boolean;
}

function PaginationLink({
  className,
  isActive,
  size = "md",
  ...props
}: PaginationLinkProps) {
  return (
    <AriaLink
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-icon-only
      className={composeRenderProps(className, (cn) =>
        buttonStyles({
          variant: isActive ? "default" : "quiet",
          size,
          className: link({ className: cn }),
        }),
      )}
      {...props}
    />
  );
}

/* -----------------------------------------------------------------------------------------------*/

function PaginationPrevious({ className, ...props }: PaginationLinkProps) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      className={composeRenderProps(className, (cn) =>
        previous({ className: cn }),
      )}
      data-icon-only={undefined}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="hidden sm:block">Previous</span>
    </PaginationLink>
  );
}

/* -----------------------------------------------------------------------------------------------*/

function PaginationNext({ className, ...props }: PaginationLinkProps) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      className={composeRenderProps(className, (cn) => next({ className: cn }))}
      data-icon-only={undefined}
      {...props}
    >
      <span className="hidden sm:block">Next</span>
      <ChevronRightIcon />
    </PaginationLink>
  );
}

/* -----------------------------------------------------------------------------------------------*/

interface PaginationEllipsisProps extends React.ComponentProps<"span"> {}

function PaginationEllipsis({ className, ...props }: PaginationEllipsisProps) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={ellipsis({ className })}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

/* -----------------------------------------------------------------------------------------------*/

const CompoundPagination = Object.assign(Pagination, {
  List: PaginationList,
  Item: PaginationItem,
  Link: PaginationLink,
  Previous: PaginationPrevious,
  Next: PaginationNext,
  Ellipsis: PaginationEllipsis,
});

export {
  CompoundPagination as Pagination,
  PaginationList,
  PaginationLink,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
};
