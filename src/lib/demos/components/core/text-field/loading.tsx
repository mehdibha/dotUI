"use client";

import React from "react";
import { Label } from "@/lib/components/core/default/field";
import { TextField } from "@/lib/components/core/default/text-field";
import { useDebounce } from "@/lib/hooks/use-debounce";

export default function InputLoadingDemo() {
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
        <TextField loading loaderPosition="prefix" />
        <TextField loading loaderPosition="suffix" />
      </div>
      <TextField
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
