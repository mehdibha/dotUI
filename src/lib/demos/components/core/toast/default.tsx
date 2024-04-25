"use client";

import { Button } from "@/lib/components/core/default/button";
import { toast } from "@/lib/components/core/default/toast";

export default function ToastDemo() {
  return <Button onClick={() => toast("Event has been created")}>Show toast</Button>;
}
