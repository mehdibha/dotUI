import { Alert, AlertDescription, AlertTitle } from '@/registry/ui/alert'

export function AlertDemo() {
  return (
    <Alert className="w-80">
      <AlertTitle>Payment information</AlertTitle>
      <AlertDescription>
        You are currently on the free plan. Upgrade to unlock more features.
      </AlertDescription>
    </Alert>
  )
}
