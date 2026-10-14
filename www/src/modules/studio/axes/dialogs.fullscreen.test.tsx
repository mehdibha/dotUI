import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

import { Modal } from "@/registry/ui/modal/base.fullscreen"

// The real overlay portals, so it renders nothing on the server.
vi.mock("react-aria-components/Modal", () => {
  type Props = { children?: unknown; className?: unknown }
  const render = (children: unknown) =>
    (typeof children === "function"
      ? children({ state: { close() {} } })
      : children) as React.ReactNode
  return {
    ModalOverlay: ({ children }: Props) => <div>{render(children)}</div>,
    Modal: ({ children }: Props) => <div data-modal="">{render(children)}</div>,
  }
})

const fullscreen = (children: React.ReactNode) =>
  renderToStaticMarkup(<Modal isOpen>{children}</Modal>)

describe("modal Fullscreen below the mobile line", () => {
  it("brings a close button the backdrop can't", () => {
    const html = fullscreen(<div role="dialog" />)
    expect(html).toContain('aria-label="Close"')
    expect(html).toContain("md:hidden")
  })

  it("defers to the dialog's own close button", () => {
    const Content = (_: { showCloseButton?: boolean }) => <div role="dialog" />
    expect(fullscreen(<Content showCloseButton />)).not.toContain(
      'aria-label="Close"',
    )
    expect(fullscreen(<Content />)).toContain('aria-label="Close"')
  })
})
