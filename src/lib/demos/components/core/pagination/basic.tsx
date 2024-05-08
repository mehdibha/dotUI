import React from "react";
import { Pagination } from "@/lib/components/core/default/pagination";

export default function PaginationDemo() {
  return <Pagination count={10} currentPage={1} />;
}
