"use client";

import * as React from "react";
import { Loader2Icon, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function UseDebounceDemo() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [value, setValue] = React.useState<string>("");

  return (
    <div className="relative w-52">
      {isLoading ? (
        <Loader2Icon
          size={18}
          className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 transform animate-spin text-muted-foreground"
        />
      ) : (
        <SearchIcon
          size={18}
          className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 transform text-muted-foreground"
        />
      )}
      <Input placeholder="Search items" className="full-w pl-8" />
    </div>
  );
}
