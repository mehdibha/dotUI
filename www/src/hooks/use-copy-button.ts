import { useState, useRef, useEffect, useCallback } from "react";
import { type PressEvent } from "react-aria-components";

export function useCopyButton(
  onCopy: () => void
): [checked: boolean, onClick: (e: PressEvent) => void] {
  const [checked, setChecked] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const onClick: (e: PressEvent) => void = useCallback(() => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      setChecked(false);
    }, 1500);
    onCopy();
    setChecked(true);
  }, [onCopy]);

  // Avoid updates after being unmounted
  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  return [checked, onClick];
}
