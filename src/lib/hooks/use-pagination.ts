import React from "react";

interface UsePaginationParams {
  count: number;
  currentPage: number;
  marginCount: number;
  showPages?: boolean;
  surroundingCount: number;
}

type Prev = {
  type: "PREV";
  num: number;
  disabled: boolean;
};

type Next = {
  type: "NEXT";
  num: number;
  disabled: boolean;
};

type Num = {
  type: "NUM";
  num: number;
  selected: boolean;
  precedesBreak: boolean;
};

type Break = {
  type: "BREAK";
  num: number;
};

type PaginationModel = (Next | Prev | Num | Break)[];

export function usePagination({
  count,
  currentPage,
  marginCount,
  showPages,
  surroundingCount,
}: UsePaginationParams): { range: PaginationModel } {
  const model = React.useMemo(() => {
    return buildPaginationModel(
      count,
      currentPage,
      !!showPages,
      marginCount,
      surroundingCount
    );
  }, [count, currentPage, showPages, marginCount, surroundingCount]);

  return { range: model };
}

// https://github.com/primer/react/blob/main/packages/react/src/Pagination/model.tsx
export function buildPaginationModel(
  pageCount: number,
  currentPage: number,
  showPages: boolean,
  marginPageCount: number,
  surroundingPageCount: number
): PaginationModel {
  const pages: (Num | Break)[] = [];

  if (showPages) {
    const pageNums: Array<number> = [];
    const addPage = (n: number) => {
      if (n >= 1 && n <= pageCount) {
        pageNums.push(n);
      }
    };

    let extentLeft = currentPage - surroundingPageCount;
    let extentRight = currentPage + surroundingPageCount;
    if (extentLeft < 1 && extentRight > pageCount) {
      extentLeft = 1;
      extentRight = pageCount;
    } else if (extentLeft < 1) {
      while (extentLeft < 1) {
        extentLeft++;
        extentRight++;
      }
    } else if (extentRight > pageCount) {
      while (extentRight > pageCount) {
        extentLeft--;
        extentRight--;
      }
    }

    for (let i = 1; i <= marginPageCount; i++) {
      const leftPage = i;
      const rightPage = pageCount - (i - 1);
      if (leftPage >= extentLeft) {
        extentRight++;
      } else {
        addPage(leftPage);
      }
      if (rightPage <= extentRight) {
        extentLeft--;
      } else {
        addPage(rightPage);
      }
    }

    for (let i = extentLeft; i <= extentRight; i++) {
      addPage(i);
    }

    const sorted = pageNums
      .slice()
      .sort((a, b) => a - b)
      .filter((item, idx, ary) => !idx || item !== ary[idx - 1]);
    for (let idx = 0; idx < sorted.length; idx++) {
      const num = sorted[idx];
      const selected = num === currentPage;
      const last = sorted[idx - 1];
      const next = sorted[idx + 1];
      const lastDelta = num - last;
      const nextDelta = num - next;
      const precedesBreak = nextDelta !== -1;

      if (idx === 0) {
        if (num !== 1) {
          pages.push({
            type: "BREAK",
            num: 1,
          });
        }
        pages.push({
          type: "NUM",
          num,
          selected,
          precedesBreak,
        });
      } else {
        if (lastDelta === 1) {
          pages.push({
            type: "NUM",
            num,
            selected,
            precedesBreak,
          });
        } else {
          pages.push({
            type: "BREAK",
            num: num - 1,
          });
          pages.push({
            type: "NUM",
            num,
            selected,
            precedesBreak: false,
          });
        }
      }
    }

    const lastPage = pages[pages.length - 1];
    if (lastPage.type === "NUM" && lastPage.num !== pageCount) {
      pages.push({
        type: "BREAK",
        num: pageCount,
      });
    }
  }

  const prev: Prev = { type: "PREV", num: currentPage - 1, disabled: currentPage === 1 };
  const next: Next = {
    type: "NEXT",
    num: currentPage + 1,
    disabled: currentPage === pageCount,
  };
  return [prev, ...pages, next];
}
