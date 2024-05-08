import React from "react";
import { Pagination } from "@/lib/components/core/default/pagination";

const sizes = ["sm", "md", "lg"] as const;

export default function PaginationDemo() {
  return (
    <div className="flex flex-col items-center space-y-6">
      {sizes.map((size) => (
        <Pagination key={size} count={10} currentPage={1} size={size} />
      ))}
    </div>
  );
}
