"use client";

import React from "react";
import Link from "next/link";
import { Pagination } from "@/lib/components/core/default/pagination";

export default function PaginationDemo() {
  return (
    <Pagination
      count={10}
      currentPage={1}
      renderItem={({ page, ...props }) => <Link href={`/products/${page}`} {...props} />}
    />
  );
}
