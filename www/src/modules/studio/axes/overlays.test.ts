import { describe, expect, test } from "vitest"

import { defaultPreset } from "@/lib/registry-preset"
import { publishables } from "@/registry/__generated__/publishables"
import { publish, selectPublishable } from "@/publisher/publish"
import { DEFAULTS } from "@/modules/studio/axes"
import { resolveDesignSystem } from "@/modules/studio/resolve"

describe("overlays chapters", () => {
  test("the defaults yield the registry defaults and no tokens", () => {
    const ds = resolveDesignSystem(DEFAULTS)
    expect(ds.tokens).toEqual({})
    expect(ds.componentParams.modal).toMatchObject({
      backdrop: "dim",
      position: "center",
    })
    expect(ds.componentParams.drawer).toMatchObject({ backdrop: "dim" })
    expect(ds.componentParams.popover).toMatchObject({ tip: "none" })
    expect(ds.componentParams.dialog).toMatchObject({ header: "title" })
    expect(ds.componentParams.tooltip).toMatchObject({ style: "inverted" })
  })

  test("dialogs: backdrop writes modal and drawer together, position the modal", () => {
    const ds = resolveDesignSystem({
      ...DEFAULTS,
      dialogBackdrop: "blur",
      dialogPosition: "top",
    })
    expect(ds.componentParams.modal).toMatchObject({
      backdrop: "blur",
      position: "top",
    })
    expect(ds.componentParams.drawer).toMatchObject({ backdrop: "blur" })
  })

  test("popovers: tip on popover, header on dialog", () => {
    const ds = resolveDesignSystem({
      ...DEFAULTS,
      popoverTip: "tip",
      popoverHeader: "band",
    })
    expect(ds.componentParams.popover).toMatchObject({ tip: "tip" })
    expect(ds.componentParams.dialog).toMatchObject({ header: "band" })
  })

  test("tooltips: style on tooltip; unknown values fall back", () => {
    expect(
      resolveDesignSystem({ ...DEFAULTS, tooltipStyle: "surface" })
        .componentParams.tooltip,
    ).toMatchObject({ style: "surface" })
    expect(
      resolveDesignSystem({ ...DEFAULTS, tooltipStyle: "translucid" })
        .componentParams.tooltip,
    ).toMatchObject({ style: "inverted" })
  })
})

describe("drawer motion", () => {
  const shipped = async (tokens: Record<string, string> = {}) => {
    const preset = defaultPreset()
    const mod = await publishables["drawer"]?.()
    if (!mod) throw new Error("drawer is not publishable")
    const { item } = publish({
      publishable: selectPublishable(mod, preset),
      preset: { ...preset, tokens: { ...preset.tokens, ...tokens } },
    })
    return item.files?.[0]?.content ?? ""
  }

  test("ships shadcn's timing as plain classes; the fling still scales the exit", async () => {
    const content = await shipped()
    expect(content).not.toContain("--studio-drawer-e")
    expect(content).toContain("duration-450 ease-[cubic-bezier(0.22,1,0.36,1)]")
    expect(content).toContain(
      "data-ending-style:duration-[calc(400ms*var(--drawer-swipe-strength,1))]",
    )
    expect(content).toContain("data-inactive:duration-400")
    expect(content).not.toMatch(/data-(ending-style|inactive):ease-/)
  })

  test("a spring slide ships linear(); the exit keeps its bezier", async () => {
    const { tokens } = resolveDesignSystem({
      ...DEFAULTS,
      drawerMotion: {
        ...DEFAULTS.drawerMotion,
        curve: { type: "spring", bounce: 0.2 },
        exitEase: [0, 0, 0.2, 1],
      },
    })
    expect(Object.keys(tokens).sort()).toEqual([
      "--studio-drawer-ease",
      "--studio-drawer-enter-duration",
      "--studio-drawer-exit-ease",
    ])
    const content = await shipped(tokens)
    expect(content).toMatch(/ duration-\d+ ease-\[linear\(0,[^\s\]]+,1\)\]/)
    expect(content).toContain("data-ending-style:ease-out")
  })
})

describe("tooltip, modal and toast motion", () => {
  const shipped = async (name: string, tokens: Record<string, string> = {}) => {
    const preset = defaultPreset()
    const mod = await publishables[name]?.()
    if (!mod) throw new Error(`${name} is not publishable`)
    const { item } = publish({
      publishable: selectPublishable(mod, preset),
      preset: { ...preset, tokens: { ...preset.tokens, ...tokens } },
    })
    return item.files?.[0]?.content ?? ""
  }
  const tokensFor = (state: Partial<typeof DEFAULTS>) =>
    resolveDesignSystem({ ...DEFAULTS, ...state }).tokens

  test("each writes its own pattern param", () => {
    const { componentParams } = resolveDesignSystem({
      ...DEFAULTS,
      tooltipMotion: { ...DEFAULTS.tooltipMotion, pattern: "fade" },
      modalMotion: { ...DEFAULTS.modalMotion, pattern: "slide" },
      toastMotion: { ...DEFAULTS.toastMotion, pattern: "none" },
    })
    expect(componentParams.tooltip).toMatchObject({ motion: "fade" })
    expect(componentParams.modal).toMatchObject({ motion: "slide" })
    expect(componentParams.toast).toMatchObject({ motion: "none" })
    expect(componentParams.popover).toMatchObject({ motion: "scale" })
  })

  test("tooltip: shadcn's 150ms ships no duration, only the ease", async () => {
    const content = await shipped("tooltip")
    expect(content).toContain(
      "transition-[transform,opacity,scale] ease-[cubic-bezier(0.25,0.1,0.25,1)] will-change-[transform,opacity,scale] motion-reduce:transition-none",
    )
    expect(content).not.toMatch(/duration-|exiting:ease-|--studio-tooltip-e/)
  })

  test("modal: panel and backdrop share shadcn's 100ms; an exit ships on both", async () => {
    const content = await shipped("modal")
    expect(content).toContain(
      "transition-opacity duration-100 ease-[cubic-bezier(0.25,0.1,0.25,1)] motion-reduce:transition-none",
    )
    expect(content).not.toMatch(/exiting(\/modal)?:(duration|ease)-/)
    const exit = await shipped(
      "modal",
      tokensFor({ modalMotion: { ...DEFAULTS.modalMotion, exit: 200 } }),
    )
    expect(exit).toContain("group-exiting/modal:duration-200")
    expect(exit).toContain(" exiting:duration-200")
  })

  test("toast: sonner's timing, the swipe-out on its own", async () => {
    const content = await shipped("toast")
    expect(content).toContain(
      "transition-[transform,opacity,height,background-color,border-color] duration-400 ease-[cubic-bezier(0.25,0.1,0.25,1)] data-ending-style:data-swipe-direction:duration-200 data-ending-style:data-swipe-direction:ease-out motion-reduce:transition-none",
    )
    expect(content).not.toMatch(/not-data-swipe-direction:(duration|ease)-/)
    expect(content).not.toContain("--studio-toast-")
    const exit = await shipped(
      "toast",
      tokensFor({ toastMotion: { ...DEFAULTS.toastMotion, exit: 250 } }),
    )
    expect(exit).toContain(
      "data-ending-style:not-data-swipe-direction:duration-250",
    )
  })
})
