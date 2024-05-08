import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { tv } from "tailwind-variants";
import { type ButtonProps, Button } from "@/lib/components/core/default/button";
import { usePagination } from "@/lib/hooks/use-pagination";
import { cn } from "@/lib/utils/classes";

const paginationVariants = tv({
  slots: {
    root: "",
    list: "flex flex-row items-center gap-1.5",
    previous: "",
    next: "",
    page: "",
    ellipsis: "flex h-9 w-9 items-center justify-center",
  },
});

type PaginationSlots = keyof ReturnType<typeof paginationVariants>;
type ClassNames = {
  [key in PaginationSlots]?: string;
};

const PaginationRoot = ({ className, ...props }: React.ComponentProps<"nav">) => {
  const { root } = paginationVariants();
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={root({ className })}
      {...props}
    />
  );
};
PaginationRoot.displayName = "PaginationRoot";

const PaginationList = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(
  ({ className, ...props }, ref) => {
    const { list } = paginationVariants();
    return <ul ref={ref} className={list({ className })} {...props} />;
  }
);
PaginationList.displayName = "PaginationList";

const PaginationPage = ({
  isActive,
  size = "sm",
  shape = "square",
  className,
  ...props
}: {
  isActive?: boolean;
} & ButtonProps) => {
  const { page } = paginationVariants();
  return (
    <li>
      <Button
        aria-current={isActive ? "page" : undefined}
        variant={isActive ? "primary" : "ghost"}
        size={size}
        shape={shape}
        className={page({ className })}
        {...props}
      />
    </li>
  );
};
PaginationPage.displayName = "PaginationPage";

const PaginationPrevious = ({
  className,
  children = "Previous",
  size = "sm",
  ...props
}: ButtonProps) => {
  const { previous } = paginationVariants();
  return (
    <li>
      <Button
        aria-label="Go to previous page"
        variant="ghost"
        prefix={<ChevronLeft />}
        size={size}
        className={previous({ className })}
        {...props}
      >
        {children}
      </Button>
    </li>
  );
};
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({
  className,
  children = "Next",
  size = "sm",
  ...props
}: ButtonProps) => {
  const { next } = paginationVariants();
  return (
    <li>
      <Button
        aria-label="Go to next page"
        variant="ghost"
        suffix={<ChevronRight />}
        size={size}
        className={next({ className })}
        {...props}
      >
        {children}
      </Button>
    </li>
  );
};
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => {
  const { ellipsis } = paginationVariants();
  return (
    <span aria-hidden className={ellipsis({ className })} {...props}>
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
};
PaginationEllipsis.displayName = "PaginationEllipsis";

type PaginationProps = React.ComponentProps<"nav"> & {
  count: number;
  currentPage: number;
  onPageChange?: (page: number, e: React.MouseEvent) => void;
  surroundingCount?: number;
  marginCount?: number;
  showPages?: boolean;
  classNames?: ClassNames;
  renderItem?: ({
    page,
    children,
  }: {
    page: number;
    children?: React.ReactNode;
  }) => React.ReactNode;
} & Pick<ButtonProps, "size" | "shape">;

const Pagination = ({
  count,
  currentPage,
  marginCount = 1,
  onPageChange,
  surroundingCount = 1,
  showPages = true,
  classNames,
  className,
  size,
  shape,
  renderItem,
  ...props
}: PaginationProps) => {
  const { range } = usePagination({
    count,
    currentPage,
    marginCount,
    showPages,
    surroundingCount,
  });

  const handlePageChange = React.useCallback(
    (n: number, e: React.MouseEvent) => {
      if (onPageChange) onPageChange(n, e);
    },
    [onPageChange]
  );

  return (
    <PaginationRoot className={cn(classNames?.root, className)} {...props}>
      <PaginationList className={classNames?.list}>
        {range.map((page, index) => {
          if (page.type === "PREV") {
            return (
              <PaginationPrevious
                key={index}
                size={size}
                onClick={onPageChange ? (e) => handlePageChange(page.num, e) : undefined}
                className={classNames?.previous}
                asChild={!!renderItem}
              >
                {renderItem && renderItem({ page: page.num, children: "Previous" })}
              </PaginationPrevious>
            );
          }
          if (page.type === "NEXT") {
            return (
              <PaginationNext
                key={index}
                size={size}
                onClick={onPageChange ? (e) => handlePageChange(page.num, e) : undefined}
                className={classNames?.next}
                asChild={!!renderItem}
              >
                {renderItem && renderItem({ page: page.num, children: "Next" })}
              </PaginationNext>
            );
          }
          if (page.type === "BREAK") {
            return <PaginationEllipsis key={index} className={classNames?.ellipsis} />;
          }
          if (page.type === "NUM") {
            return (
              <PaginationPage
                key={index}
                size={size}
                shape={shape}
                isActive={page.selected}
                asChild={!!renderItem}
                onClick={onPageChange ? (e) => handlePageChange(page.num, e) : undefined}
                className={classNames?.page}
              >
                {renderItem
                  ? renderItem({ page: page.num, children: page.num })
                  : page.num}
              </PaginationPage>
            );
          }
          return null;
        })}
      </PaginationList>
    </PaginationRoot>
  );
};
Pagination.displayName = "Pagination";

export {
  Pagination,
  PaginationRoot,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
  PaginationPage,
  PaginationEllipsis,
};
