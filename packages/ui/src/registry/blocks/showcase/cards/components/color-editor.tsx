"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@dotui/ui/components/card";
import { ColorPickerEditor } from "@dotui/ui/components/color-picker";
import { cn } from "@dotui/ui/lib/utils";

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
