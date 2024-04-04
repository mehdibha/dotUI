"use client";

import { Button } from "@/lib/components/core/default/button";
import { useCounter } from "@/lib/hooks/use-counter";

export default function Demo() {
  const [count, { increment, decrement, set, reset }] = useCounter(3, {
    min: 0,
    max: 10,
  });
  return (
    <div>
      <p className="text-center text-muted-foreground">
        startingValue: 3, min: 0, max: 10
      </p>
      <div className="mt-4 flex items-center gap-2">
        <Button onClick={increment} disabled={count >= 10}>
          Increment
        </Button>
        <Button onClick={decrement} disabled={count <= 0}>
          Decrement
        </Button>
        <Button
          onClick={() => {
            set(5);
          }}
        >
          Set to 5
        </Button>
        <Button onClick={reset}>Reset</Button>
      </div>
      <p className="mt-8 text-center text-4xl">{count}</p>
    </div>
  );
}
