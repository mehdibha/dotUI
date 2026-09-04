import { Alert, AlertDescription, AlertTitle } from "@/registry/ui/alert"

export function AlertDemo() {
  return (
    <Alert className="w-64">
      <AlertTitle>Trial ending</AlertTitle>
      <AlertDescription>Your trial ends in 3 days.</AlertDescription>
    </Alert>
  )
}
