import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

import { Modal } from "@/registry/ui/modal/base.sheet"

vi.mock("@/registry/hooks/use-mobile", () => ({ useIsMobile: () => true }))
vi.mock("@/registry/ui/sheet", () => ({
  Sheet: (props: {
    preventDismissal?: boolean
    className?: string
    children?: React.ReactNode
  }) => (
    <div
      data-sheet=""
      data-prevent-dismissal={String(props.preventDismissal)}
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
    expect(open).toContain('data-prevent-dismissal="false"')
    expect(open).not.toContain("sheet-handle")
    expect(sheet({ isDismissable: false, children: <div /> })).toContain(
      'data-prevent-dismissal="true"',
    )
  })

  it("keeps the consumer's className", () => {
    expect(sheet({ className: "custom", children: <div /> })).toContain(
      'class="custom"',
    )
  })

  it("keeps an alert dialog centered", () => {
    expect(sheet({ children: <div role="alertdialog" /> })).not.toContain(
      "data-sheet",
    )
  })
})
