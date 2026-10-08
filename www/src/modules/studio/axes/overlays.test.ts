import { describe, expect, test } from "vitest"

import { publishables } from "@/registry/__generated__/publishables"
import { publish, selectPublishable } from "@/publisher/publish"
import type { PublishPreset } from "@/publisher/types"
import { DEFAULT_STATE, DEFAULTS, parseState } from "@/modules/studio/axes"
import { resolveDesignSystem } from "@/modules/studio/resolve"

describe("overlays chapters", () => {
  test("the defaults yield the registry defaults and no tokens", () => {
    const ds = resolveDesignSystem(DEFAULT_STATE)
    expect(ds.tokens).toEqual({})
    expect(ds.componentParams.modal).toMatchObject({
      backdrop: "dim",
      position: "center",
    })
    expect(ds.componentParams.sheet).toMatchObject({ backdrop: "dim" })
    expect(ds.componentParams.popover).toMatchObject({ tip: "none" })
    expect(ds.componentParams.dialog).toMatchObject({ header: "title" })
    expect(ds.componentParams.tooltip).toMatchObject({ style: "inverted" })
  })

  test("dialogs: backdrop writes modal and sheet together, position the modal", () => {
    const ds = resolveDesignSystem(
      parseState({ dialogBackdrop: "blur", dialogPosition: "top" }),
    )
    expect(ds.componentParams.modal).toMatchObject({
      backdrop: "blur",
      position: "top",
    })
    expect(ds.componentParams.sheet).toMatchObject({ backdrop: "blur" })
  })

  test("popovers: tip on popover, header on dialog", () => {
    const ds = resolveDesignSystem(
      parseState({ popoverTip: "tip", popoverHeader: "band" }),
    )
    expect(ds.componentParams.popover).toMatchObject({ tip: "tip" })
    expect(ds.componentParams.dialog).toMatchObject({ header: "band" })
  })

  test("tooltips: style on tooltip", () => {
    expect(
      resolveDesignSystem(parseState({ tooltipStyle: "surface" }))
        .componentParams.tooltip,
    ).toMatchObject({ style: "surface" })
  })
})

describe("tooltip, modal and toast motion", () => {
  const shipped = async (name: string, tokens: Record<string, string> = {}) => {
    const preset: PublishPreset = { density: "default", componentParams: {} }
    const mod = await publishables[name]?.()
    if (!mod) throw new Error(`${name} is not publishable`)
    const { item } = publish({
      publishable: selectPublishable(mod, preset),
      preset: { ...preset, tokens: { ...preset.tokens, ...tokens } },
    })
    return item.files?.[0]?.content ?? ""
  }
  const tokensFor = (state: Partial<typeof DEFAULTS>) =>
    resolveDesignSystem(parseState({ ...state })).tokens

  test("each writes its own pattern param", () => {
    const { componentParams } = resolveDesignSystem(
      parseState({
        tooltipMotion: { ...DEFAULTS.tooltipMotion, pattern: "fade" },
        modalMotion: { ...DEFAULTS.modalMotion, pattern: "slide" },
        toastMotion: { ...DEFAULTS.toastMotion, pattern: "none" },
      }),
    )
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
