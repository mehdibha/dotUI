import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

import { Modal } from "@/registry/ui/modal/base.sheet"

vi.mock("@/registry/hooks/use-mobile", () => ({ useIsMobile: () => true }))
vi.mock("@/registry/ui/drawer", () => ({
  Drawer: (props: {
    swipeToDismiss?: boolean
    className?: string
    children?: React.ReactNode
  }) => (
    <div
      data-drawer=""
      data-swipe={String(props.swipeToDismiss)}
      className={props.className}
    >
      {props.children}
    </div>
  ),
}))

const sheet = (props: React.ComponentProps<typeof Modal>) =>
  renderToStaticMarkup(<Modal isOpen {...props} />)

describe("modal Sheet below the mobile line", () => {
  it("swipes away only when dismissable, and draws no handle", () => {
    const open = sheet({ children: <div role="dialog" /> })
    expect(open).toContain('data-swipe="true"')
    expect(open).not.toContain("drawer-handle")
    expect(sheet({ isDismissable: false, children: <div /> })).toContain(
      'data-swipe="false"',
    )
  })

  it("keeps the consumer's className", () => {
    expect(sheet({ className: "custom", children: <div /> })).toContain(
      'class="custom"',
    )
  })

  it("keeps an alert dialog centered", () => {
    expect(sheet({ children: <div role="alertdialog" /> })).not.toContain(
      "data-drawer",
    )
  })
})
