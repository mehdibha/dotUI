"use client";

import React from "react";
import { Pagination } from "@/lib/components/core/default/pagination";

export default function PaginationDemo() {
  const [currentPage, setCurrentPage] = React.useState(1);
  return (
    <Pagination
      count={10}
      currentPage={currentPage}
      onPageChange={(page) => setCurrentPage(page)}
    />
  );
}
