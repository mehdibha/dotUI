import { TriangleAlertIcon } from "@/registry/__generated__/icons"
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/registry/ui/alert"
import { Button } from "@/registry/ui/button"

export function AlertDemo() {
  return (
    <Alert className="w-84">
      <TriangleAlertIcon />
      <AlertTitle>Storage almost full</AlertTitle>
      <AlertDescription>92% of 10 GB used.</AlertDescription>
      <AlertAction>
        <Button size="sm">Upgrade</Button>
      </AlertAction>
    </Alert>
  )
}
