"use client";

import { useEffect, useState } from "react";

export interface UseAutoToggleOptions {
  interval?: number;
  initialState?: boolean;
}

export function useAutoToggle(options: UseAutoToggleOptions = {}) {
  const { interval = 3000, initialState = false } = options;
  const [isOpen, setIsOpen] = useState(initialState);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setIsOpen((prev) => !prev);
    }, interval);

    return () => clearInterval(timer);
  }, [interval, isPaused]);

  return {
    isOpen,
    setIsOpen,
    isPaused,
    pauseProps: {
      onMouseEnter: () => setIsPaused(true),
      onMouseLeave: () => setIsPaused(false),
    },
  };
}

