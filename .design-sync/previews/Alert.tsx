import { CheckIcon, CircleAlertIcon, InfoIcon, TriangleAlertIcon } from 'lucide-react'
import { Alert, AlertAction, AlertDescription, AlertTitle, Button } from 'www'

const stack: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  width: '100%',
  maxWidth: 512,
}

export const Variants = () => (
  <div style={stack}>
    <Alert>
      <InfoIcon />
      <AlertTitle>A new software update is available.</AlertTitle>
      <AlertDescription>See what's new in version 2.4.0.</AlertDescription>
    </Alert>
    <Alert variant="success">
      <CheckIcon />
      <AlertTitle>Your changes have been saved.</AlertTitle>
      <AlertDescription>Everything is up to date.</AlertDescription>
    </Alert>
    <Alert variant="warning">
      <TriangleAlertIcon />
      <AlertTitle>Your trial ends in 3 days.</AlertTitle>
      <AlertDescription>Upgrade to keep your projects active.</AlertDescription>
    </Alert>
    <Alert variant="danger">
      <CircleAlertIcon />
      <AlertTitle>Unable to process your payment.</AlertTitle>
      <AlertDescription>Please verify your billing information and try again.</AlertDescription>
    </Alert>
  </div>
)

export const WithAction = () => (
  <div style={stack}>
    <Alert>
      <CircleAlertIcon />
      <AlertTitle>The selected emails have been marked as spam.</AlertTitle>
      <AlertAction>
        <Button variant="primary" size="xs">
          Undo
        </Button>
      </AlertAction>
    </Alert>
  </div>
)

export const TitleOnly = () => (
  <div style={stack}>
    <Alert>
      <CheckIcon />
      <AlertTitle>Success! Your changes have been saved.</AlertTitle>
    </Alert>
  </div>
)
