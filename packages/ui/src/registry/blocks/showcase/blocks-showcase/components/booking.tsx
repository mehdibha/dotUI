"use client";

import { Button } from "@dotui/ui/components/button";
import { Calendar } from "@dotui/ui/components/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@dotui/ui/components/card";
import { TimeField } from "@dotui/ui/components/time-field";
import { cn } from "@dotui/ui/lib/utils";
import { parseDate } from "@internationalized/date";

export function Booking({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Card className={cn("", className)} {...props}>
      <CardHeader>
        <CardTitle>Booking</CardTitle>
        <CardDescription>Pick a time for your meeting.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Calendar className="border-0 bg-transparent p-0" defaultValue={parseDate("2025-09-23")} />
        <div className="grid grid-cols-2 gap-2">
          <TimeField label="Start time" className="w-auto" />
          <TimeField label="End time" className="w-auto" />
        </div>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button>Dismiss</Button>
        <Button variant="primary">Apply</Button>
      </CardFooter>
    </Card>
  );
}