"use client";

import * as React from "react";
import { Loader2Icon, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";

export default function UseDebounceDemo() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [searchInput, setSearchInput] = React.useState<string>("");
  const debouncedValue = useDebounce<string>(searchInput, 1000);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(false);
    setSearchInput(e.target.value);
  };

  const handleSubmit = () => {
    setIsLoading(true);
    // fetch here
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  React.useEffect(() => {
    handleSubmit();
  }, [debouncedValue]);

  return (
    <div className="relative w-52">
      {isLoading ? (
        <div className="absolute left-2 flex h-full items-center">
          <Loader2Icon
            size={18}
            className="pointer-events-none animate-spin text-muted-foreground"
          />
        </div>
      ) : (
        <SearchIcon
          size={18}
          className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 transform text-muted-foreground"
        />
      )}
      <Input
        value={searchInput}
        onChange={handleChange}
        placeholder="Search items"
        className="full-w pl-8"
      />
    </div>
  );
}
