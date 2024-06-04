"use client";

import React from "react";
import { TextArea } from "@/lib/components/core/default/text-area";
import { useDebounce } from "@/lib/hooks/use-debounce";

export default function Demo() {
  const [loading, setLoading] = React.useState(false);
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
        <TextArea loading loaderPosition="prefix" />
        <TextArea loading loaderPosition="suffix" />
      </div>
      <TextArea
        label="Username"
        placeholder="Type a username"
        value={inputValue}
        onChange={(text) => {
          setInputValue(text);
        }}
        type={!loading && debouncedInputValue ? "success" : undefined}
        loading={loading}
      />
    </div>
  );
}
