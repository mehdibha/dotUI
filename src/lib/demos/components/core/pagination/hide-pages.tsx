"use client";

import React from "react";
import { Pagination } from "@/lib/components/core/default/pagination";

export default function PaginationDemo() {
  return (
    <Pagination
      showPages={false}
      count={10}
      currentPage={1}
      classNames={{ root: "w-full", list: "w-full justify-between" }}
    />
  );
}
