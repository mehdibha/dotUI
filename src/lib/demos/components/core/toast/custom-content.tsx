"use client";

import { Button } from "@/lib/components/core/default/button";
import { toast } from "@/lib/components/core/default/toast";

export default function ToastDemo() {
  return (
    <Button
      onClick={() =>
        toast(
          <>
            The <span className="font-bold">Evil Rabbit</span> jumped over the fence.
          </>
        )
      }
    >
      Show toast
    </Button>
  );
}
