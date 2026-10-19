"use client"

import { Button } from "@/registry/ui/button"
import {
  toastManager,
  ToastProvider,
  type ToastProviderProps,
} from "@/registry/ui/toast"

export default function Demo({
  title = "Changes saved",
  description = "Your update is live.",
  type = "success",
  position = "bottom-right",
  action = false,
}: {
  title?: string
  description?: string
  type?: "neutral" | "success" | "error" | "warning" | "info" | "loading"
  position?: ToastProviderProps["position"]
  action?: boolean
} = {}) {
  return (
    <ToastProvider position={position}>
      <Button
        onPress={() => {
          const id = toastManager.add({
            title,
            description,
            type,
            ...(action && {
              actionProps: {
                children: "Undo",
                onClick: () => toastManager.close(id),
              },
            }),
          })
        }}
      >
        Show toast
      </Button>
    </ToastProvider>
  )
}
