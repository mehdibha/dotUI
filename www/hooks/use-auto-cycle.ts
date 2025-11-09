"use client";

import { useEffect, useState } from "react";

export interface UseAutoCycleOptions {
  interval?: number;
  initialIndex?: number;
}

export function useAutoCycle<T>(items: T[], options: UseAutoCycleOptions = {}) {
  const { interval = 3000, initialIndex = 0 } = options;
  const [index, setIndex] = useState(initialIndex);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || items.length === 0) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, interval);

    return () => clearInterval(timer);
  }, [items.length, interval, isPaused]);

  return {
    current: items[index],
    index,
    setIndex,
    isPaused,
    pauseProps: {
      onMouseEnter: () => setIsPaused(true),
      onMouseLeave: () => setIsPaused(false),
    },
  };
}
