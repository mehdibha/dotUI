import { toastManager } from "@/registry/ui/toast"

/** A design system's name in a toast title: quoted, cut at 32 characters. */
export function quoted(name: string): string {
  const chars = [...name]
  return `"${chars.length > 32 ? `${chars.slice(0, 31).join("")}…` : name}"`
}

/** A toast whose Undo runs `undo` and closes it; returns its id. */
export function undoToast(
  title: string,
  undo: () => void,
  description?: string,
): string {
  const id = toastManager.add({
    title,
    description,
    timeout: 10_000,
    actionProps: {
      children: "Undo",
      onClick: () => {
        toastManager.close(id)
        undo()
      },
    },
  })
  return id
}
