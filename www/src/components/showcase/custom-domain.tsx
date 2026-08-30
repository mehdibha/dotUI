"use client"

import { AlertTriangleIcon } from "@/registry/icons"
import { Alert, AlertTitle } from "@/registry/ui/alert"
import { Button } from "@/registry/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/ui/card"
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input"
import { Separator } from "@/registry/ui/separator"
import { TextField } from "@/registry/ui/text-field"

export function CustomDomain(props: React.ComponentProps<"div">) {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Custom domain</CardTitle>
        <CardDescription>
          Serve your project from a domain you own.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <TextField defaultValue="app.acme.com" aria-label="Domain">
          <InputGroup>
            <InputGroupAddon>https://</InputGroupAddon>
            <Input placeholder="app.example.com" />
          </InputGroup>
        </TextField>
        <Alert variant="warning">
          <AlertTriangleIcon />
          <AlertTitle>DNS records not detected yet</AlertTitle>
        </Alert>
      </CardContent>
      <Separator />
      <CardFooter className="flex items-center justify-between gap-2">
        <Button variant="quiet" className="min-w-0 shrink">
          <span className="min-w-0 truncate">View DNS records</span>
        </Button>
        <Button variant="primary">Verify</Button>
      </CardFooter>
    </Card>
  )
}
