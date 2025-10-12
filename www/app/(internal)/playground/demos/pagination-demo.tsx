"use client";

import React from "react";

import { Pagination } from "@dotui/registry-v2/ui/pagination";

export function PaginationDemo() {
  return (
    <div className="flex items-center justify-center p-8 text-fg-muted">
      <ControlledPagination />
    </div>
  );
}

const ControlledPagination = () => {
  const [page, setPage] = React.useState(1);

  return (
    <Pagination>
      <Pagination.List>
        <Pagination.Item>
          <Pagination.Previous />
        </Pagination.Item>
        {Array.from({ length: 4 }).map((_, index) => (
          <Pagination.Item key={index}>
            <Pagination.Link
              isActive={page === index + 1}
              onPress={() => setPage(index + 1)}
            >
              {index + 1}
            </Pagination.Link>
          </Pagination.Item>
        ))}
        <Pagination.Item>
          <Pagination.Ellipsis />
        </Pagination.Item>
        <Pagination.Item>
          <Pagination.Next />
        </Pagination.Item>
      </Pagination.List>
    </Pagination>
  );
};
