import { toastManager } from "@/registry/ui/toast"

/** A design system's name in a toast title: quoted, cut at 32 characters. */
export function quoted(name: string): string {
  const chars = [...name]
  return `"${chars.length > 32 ? `${chars.slice(0, 31).join("")}…` : name}"`
}

/** A toast whose Undo runs `undo` and closes it. */
export function undoToast(title: string, undo: () => void): void {
  const id = toastManager.add({
    title,
    timeout: 10_000,
    actionProps: {
      children: "Undo",
      onClick: () => {
        toastManager.close(id)
        undo()
      },
    },
  })
}
