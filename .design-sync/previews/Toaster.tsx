import { Toast as ToastPrimitive } from '@base-ui/react/toast'
import * as React from 'react'
import { ToastProvider } from 'www'

type ToastSpec = {
  title: string
  description?: string
  type?: string
}

// Renders the dotUI Toaster with real toasts pushed onto its imperative queue on
// mount, so the static card shows actual toast cards instead of an empty viewport.
const ToastStage = ({
  toasts,
  position = 'bottom-right',
}: {
  toasts: ToastSpec[]
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
}) => {
  const manager = React.useMemo(
    () => ToastPrimitive.createToastManager(),
    [],
  )

  React.useEffect(() => {
    for (const toast of toasts) {
      manager.add(toast)
    }
  }, [manager, toasts])

  return (
    <ToastProvider
      toastManager={manager}
      position={position}
      timeout={1000 * 60 * 60}
      limit={5}
    >
      <div style={{ minHeight: 140, width: '100%' }} />
    </ToastProvider>
  )
}

export const Basic = () => (
  <ToastStage
    toasts={[{ title: 'Your message has been sent.' }]}
  />
)

export const Success = () => (
  <ToastStage
    toasts={[
      {
        title: 'Changes saved',
        description: 'Your update is live.',
        type: 'success',
      },
    ]}
  />
)

export const Error = () => (
  <ToastStage
    toasts={[
      {
        title: 'Upload failed',
        description: 'Check your connection and try again.',
        type: 'error',
      },
    ]}
  />
)

export const Info = () => (
  <ToastStage
    toasts={[
      {
        title: 'New comment',
        description: 'Maya left a note on this project.',
        type: 'info',
      },
    ]}
  />
)
