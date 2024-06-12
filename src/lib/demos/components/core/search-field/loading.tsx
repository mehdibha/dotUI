"use client";

import React from "react";
import { SearchField } from "@/lib/components/core/default/search-field";
import { useDebounce } from "@/lib/hooks/use-debounce";

export default function Demo() {
  const [isLoading, setLoading] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const debouncedInputValue = useDebounce(inputValue, 500);

  React.useEffect(() => {
    if (debouncedInputValue) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
  }, [debouncedInputValue]);

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <SearchField isLoading loaderPosition="prefix" />
        <SearchField isLoading loaderPosition="suffix" />
      </div>
      <SearchField
        label="Search"
        placeholder="Type your search query"
        value={inputValue}
        onChange={(text) => {
          setInputValue(text);
        }}
        type={!isLoading && debouncedInputValue ? "success" : undefined}
        isLoading={isLoading}
      />
    </div>
  );
}
