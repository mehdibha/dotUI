"use client";

import { Button } from "@dotui/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@dotui/ui/components/card";
import { TextField } from "@dotui/ui/components/text-field";
import { cn } from "@dotui/ui/lib/utils";

export function TeamName({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Card className={cn("", className)} {...props}>
      <CardHeader>
        <CardTitle>Team Name</CardTitle>
        <CardDescription>
          This is your team's visible name within the platform. For example, the
          name of your company or department.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TextField aria-label="Team Name" defaultValue="My Team" />
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-4">
        <p className="text-fg-muted text-sm">
          Please use 32 characters at maximum.
        </p>
        <Button variant="primary">Save</Button>
      </CardFooter>
    </Card>
  );
}
