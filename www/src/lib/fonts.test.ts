import { describe, expect, it, vi } from "vitest"

import { loadFontFaces } from "./fonts"

function fakeDocument() {
  const links = new Map<string, HTMLLinkElement>()
  const load = vi.fn((_font: string) => Promise.resolve([]))
  const doc = {
    getElementById: (id: string) => links.get(id) ?? null,
    createElement: () =>
      Object.assign(new EventTarget(), { id: "", sheet: null }),
    head: {
      append: (link: HTMLLinkElement) => void links.set(link.id, link),
    },
    fonts: { load },
  } as unknown as Document
  return { doc, links, load }
}

describe("loadFontFaces", () => {
  it("fetches every weight once the stylesheet loads", () => {
    const { doc, links, load } = fakeDocument()
    loadFontFaces(doc, ["Fraunces"])
    expect(links.size).toBe(1)
    expect(load).not.toHaveBeenCalled()
    const [link] = links.values()
    link!.dispatchEvent(new Event("load"))
    expect(load.mock.calls.map(([font]) => font)).toEqual([
      '400 1em "Fraunces"',
      '500 1em "Fraunces"',
      '600 1em "Fraunces"',
      '700 1em "Fraunces"',
    ])
  })

  it("reuses a loaded stylesheet and fetches at once", () => {
    const { doc, links, load } = fakeDocument()
    loadFontFaces(doc, ["Fraunces"])
    const [link] = links.values()
    Object.assign(link!, { sheet: {} })
    loadFontFaces(doc, ["Fraunces"])
    expect(links.size).toBe(1)
    expect(load).toHaveBeenCalledTimes(4)
  })
})
