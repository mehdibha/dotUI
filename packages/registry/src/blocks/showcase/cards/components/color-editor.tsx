"use client";

import { cn } from "@dotui/registry/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@dotui/registry/ui/card";
import { ColorPickerEditor } from "@dotui/registry/ui/color-picker";

export function ColorEditor({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <Card className={cn("", className)} {...props}>
      <CardHeader>
        <CardTitle>Accent color</CardTitle>
        <CardDescription>Edit the accent color of the app.</CardDescription>
      </CardHeader>
      <CardContent>
        <ColorPickerEditor />
      </CardContent>
    </Card>
  );
}
