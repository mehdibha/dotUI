import { AlertTriangleIcon } from '@/registry/__generated__/icons'
import { Alert, AlertDescription, AlertTitle } from '@/registry/ui/alert'

export default function Demo() {
  return (
    <Alert variant="warning">
      <AlertTriangleIcon />
      <AlertTitle>Warning</AlertTitle>
      <AlertDescription>
        Your session will expire in 5 minutes. Please save your work.
      </AlertDescription>
    </Alert>
  )
}
