import { useCallback, useState } from "react";
import type React from "react";
import type { PressEvent } from "react-aria-components";

function getUniqueID(prefix: string) {
  return `${prefix}-${Math.floor(Math.random() * 1000000)}`;
}

export interface RippleType {
  key: React.Key;
  x: number;
  y: number;
  size: number;
}

export type UseRippleProps = {};

export function useRipple(props: UseRippleProps = {}) {
  const [ripples, setRipples] = useState<RippleType[]>([]);

  const onPress = useCallback((event: PressEvent) => {
    const trigger = event.target;

    const size = Math.max(trigger.clientWidth, trigger.clientHeight);

    setRipples((prevRipples) => [
      ...prevRipples,
      {
        key: getUniqueID(prevRipples.length.toString()),
        size,
        x: event.x - size / 2,
        y: event.y - size / 2,
      },
    ]);
  }, []);

  const onClear = useCallback((key: React.Key) => {
    setRipples((prevState) => prevState.filter((ripple) => ripple.key !== key));
  }, []);

  return { ripples, onClear, onPress, ...props };
}

export type UseRippleReturn = ReturnType<typeof useRipple>;
