import React from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  // Create a stable key for deep-equality; effect runs only when content changes
  const key = React.useMemo(() => {
    try {
      return JSON.stringify(value);
    } catch {
      // Fallback: if value isn't serializable, fall back to reference
      return String(value);
    }
  }, [value]);

  React.useEffect(() => {
    if (delay <= 0) {
      setDebouncedValue(value);
      return;
    }

    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [key, delay, value]);

  return debouncedValue;
}
