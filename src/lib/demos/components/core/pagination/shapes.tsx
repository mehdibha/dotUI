import React from "react";
import { Pagination } from "@/lib/components/core/default/pagination";

export default function PaginationDemo() {
  return (
    <div className="space-y-4">
      <Pagination count={10} currentPage={1} shape="circle" />
      <Pagination count={10} currentPage={1} shape="square" />
    </div>
  );
}
