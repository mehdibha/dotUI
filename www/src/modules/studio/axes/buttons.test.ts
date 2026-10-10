import { describe, expect, test } from "vitest"

import { publishables } from "@/registry/__generated__/publishables"
import buttonMeta from "@/registry/ui/button/meta"
import {
  BUTTON_SECONDARY,
  BUTTON_STYLES,
  BUTTON_VARIANTS,
} from "@/registry/ui/button/styles"
import toggleButtonMeta from "@/registry/ui/toggle-button/meta"
import { flatten } from "@/publisher/flatten"
import { publish, selectPublishable } from "@/publisher/publish"
import type { PublishPreset } from "@/publisher/types"

import { designSystemOf } from "../resolve"
import { DEFAULTS, effective, parseState } from "./index"
import { ALLOWED } from "./style"

const presetOf = (state: Partial<typeof DEFAULTS>): PublishPreset => {
  const ds = designSystemOf(parseState(state))
  return {
    density: ds.density,
    componentParams: ds.componentParams,
    tokens: ds.tokens,
    color: ds.color,
    icons: ds.icons,
  }
}

const shipped = async (name: string, state: Partial<typeof DEFAULTS> = {}) => {
  const preset = presetOf(state)
  const { item } = publish({
    publishable: selectPublishable(await publishables[name]!(), preset),
    preset,
  })
  return item.files?.[0]?.content ?? ""
}

/* A button style under the first Style that allows it. */
const owned = (buttonStyle: string) => ({
  buttonStyle,
  style: ALLOWED.buttonStyle?.[buttonStyle]?.[0] ?? "flat",
})

/* A class only that style's recipe uses. */
const SIGNATURE: Record<string, string> = {
  hairline: "border-black/15",
  "rim-light": "after:mask-b-from-0%",
  gloss: "after:from-white/11",
  bevel: "from-63%",
  ledge: "shadow-[0_4px_0_0_var(--color-primary-active)]",
}

describe("button styles", () => {
  test("each style ships its own recipe and no other's", async () => {
    for (const name of ["button", "toggle-button"])
      for (const buttonStyle of ["flat", ...Object.keys(SIGNATURE)]) {
        const content = await shipped(name, owned(buttonStyle))
        for (const [other, signature] of Object.entries(SIGNATURE))
          expect(content.includes(signature), `${name}/${buttonStyle}`).toBe(
            other === buttonStyle,
          )
        expect(content).not.toContain("--studio-")
      }
  })

  test("Ledge: a 4px lip from the fill ramp, a 2px lip under the secondary", async () => {
    const content = await shipped("button", owned("ledge"))
    expect(content).toContain("pressed:translate-y-1")
    expect(content).toContain("shadow-[0_2px_0_0_var(--color-border-control)]")
    expect(content).not.toContain(
      "color-mix(in_srgb,var(--color-primary),black",
    )
  })

  // Duolingo's CSS (E27): 2px lip on the pill size, the control stroke
  // under eel ink, instant press.
  test("Ledge: the xs pill sinks 2px; the secondary takes the control stroke", async () => {
    const ledge = BUTTON_STYLES.ledge
    for (const { variant, size, class: cls } of ledge.compoundVariants) {
      expect(size).toBe("xs")
      expect(cls).toContain("shadow-[0_2px_0_0_")
      expect(cls).toContain("pressed:translate-y-0.5")
      expect(ledge.variants.variant[variant as "primary"]).toContain(
        "shadow-[0_4px_0_0_",
      )
    }
    expect(ledge.variants.variant.primary).toContain("duration-0")
    const secondary = BUTTON_SECONDARY.ledge.variants.variant.secondary
    expect(secondary).toContain("border-(length:--studio-control-stroke)")
    expect(secondary).toContain("text-fg-on-neutral")
    expect(secondary).toContain("duration-0")
    const at = (controlStroke: string) =>
      shipped("button", { ...owned("ledge"), controlStroke })
    expect(await at("regular")).toContain("border border-border-control")
    const bold = await at("bold")
    expect(bold).toContain("border-2 border-border-control")
    expect(bold).toContain("shadow-[0_2px_0_0_var(--color-primary-active)]")
  })
})

/* The toggle imports Button's tables, so every shared param flattens alike. */
describe("button ⇄ toggle-button parity", () => {
  const configs = async () => ({
    button: (await publishables.button!()).publishable.stylesConfig,
    toggle: (await publishables["toggle-button"]!()).publishable.stylesConfig,
  })
  const variantsOf = (
    stylesConfig: Awaited<ReturnType<typeof configs>>["button"],
    meta: typeof buttonMeta | typeof toggleButtonMeta,
    paramSelections: Record<string, string>,
  ) =>
    flatten({ stylesConfig, meta, density: "default", paramSelections })
      .variants

  test.each([
    "style",
    "secondary",
    "press",
    "case",
    "linkUnderline",
    "linkColor",
  ] as const)("%s flattens to the same variants on both", async (param) => {
    const { button, toggle } = await configs()
    for (const value of buttonMeta.params[param].values) {
      const selection = { [param]: value }
      expect(
        variantsOf(toggle, toggleButtonMeta, selection),
        `${param}=${value}`,
      ).toEqual(variantsOf(button, buttonMeta, selection))
      expect(toggle.params?.[param]?.[value], `${param}=${value}`).toEqual(
        button.params?.[param]?.[value],
      )
    }
  })

  test("both list the same values", () => {
    for (const param of [
      "style",
      "secondary",
      "press",
      "case",
      "linkUnderline",
      "linkColor",
    ] as const)
      expect(toggleButtonMeta.params[param].values, param).toEqual(
        buttonMeta.params[param].values,
      )
  })

  test("the toggle's selected looks are the current page's", async () => {
    const { button, toggle } = await configs()
    for (const value of toggleButtonMeta.params.selected.values)
      expect(toggle.params?.selected?.[value], value).toEqual(
        button.params?.current?.[value],
      )
  })
})

describe("buttons axes", () => {
  test("Origin writes every registry default", () => {
    const { componentParams } = designSystemOf(parseState({}))
    expect(componentParams.button).toMatchObject({
      style: "flat",
      secondary: "flat",
      press: "as-style",
      case: "sentence",
      current: "none",
    })
    expect(componentParams.group?.segments).toBe("attached")
  })

  test("As style keeps the style's own secondary; an open style swaps one in", () => {
    const at = (state: Partial<typeof DEFAULTS>) =>
      designSystemOf(parseState(state)).componentParams["toggle-button"]
    expect(at({ buttonStyle: "hairline" })?.secondary).toBe("hairline")
    expect(
      at({ buttonStyle: "hairline", buttonSecondary: "raised" })?.secondary,
    ).toBe("raised")
    // A closed style keeps its own; the saved pick survives.
    const state = parseState({
      ...owned("bevel"),
      buttonSecondary: "soft",
      buttonPress: "scale",
    })
    expect(designSystemOf(state).componentParams.button).toMatchObject({
      secondary: "bevel",
      press: "as-style",
    })
    expect(state.buttonSecondary).toBe("soft")
  })

  test("Ledge groups sit apart and their seam row goes inert", () => {
    const state = parseState(owned("ledge"))
    const { componentParams } = designSystemOf(state)
    expect(componentParams.group?.segments).toBe("gapped")
    expect(componentParams["toggle-button-group"]?.segments).toBe("gapped")
    expect(effective(state).explain.groupSeparator?.lock?.kind).toBe("hide")
  })

  test("Solid needs a brand primary: under a neutral one it falls back to As style", () => {
    const state = parseState({
      buttonColor: "neutral",
      buttonSecondary: "solid",
    })
    expect(designSystemOf(state).componentParams.button?.secondary).toBe("flat")
    expect(effective(state).explain.buttonSecondary?.exclude).toMatchObject({
      cause: "buttonColor",
      options: ["solid"],
    })
    expect(state.buttonSecondary).toBe("solid")
    expect(
      designSystemOf(parseState({ buttonSecondary: "solid" })).componentParams[
        "toggle-button"
      ]?.secondary,
    ).toBe("solid")
  })

  test("Auto seam: edged secondaries share the edge, edgeless ones divide", () => {
    const seam = (state: Partial<typeof DEFAULTS>) =>
      effective(parseState(state)).values.groupSeparator
    expect(seam({})).toBe("shared-edge")
    expect(seam({ buttonSecondary: "outline" })).toBe("shared-edge")
    expect(seam({ buttonSecondary: "soft" })).toBe("divider")
    expect(seam({ buttonSecondary: "tonal" })).toBe("divider")
    expect(seam({ buttonSecondary: "solid" })).toBe("divider")
    // Under a closed style the hidden secondary reads As style.
    expect(seam({ ...owned("bevel"), buttonSecondary: "soft" })).toBe(
      "shared-edge",
    )
  })

  test("Auto chip follows the button style", () => {
    const chip = (state: Partial<typeof DEFAULTS>) =>
      designSystemOf(parseState(state)).componentParams["segmented-control"]
        ?.selected
    expect(chip({})).toBe("tone")
    expect(chip({ buttonStyle: "hairline" })).toBe("ring")
    expect(chip(owned("bevel"))).toBe("raised")
    expect(chip({ ...owned("bevel"), segmentedSelected: "inverse" })).toBe(
      "inverse",
    )
  })

  test("Selected current page wears the effective toggle look", () => {
    const ds = designSystemOf(
      parseState({ paginationCurrent: "selected", toggleSelected: "tint" }),
    )
    expect(ds.componentParams.pagination?.current).toBe("selected")
    expect(ds.componentParams.button?.current).toBe("tint")
  })

  test("Pill writes the button radius vars; Same as controls writes none", () => {
    expect(designSystemOf(parseState({})).tokens).toEqual({})
    expect(designSystemOf(parseState({ buttonRadius: "pill" })).tokens).toEqual(
      {
        "--studio-btn-radius": "var(--radius-full)",
        "--studio-btn-xs-radius": "var(--radius-full)",
      },
    )
  })
})

describe("shipped buttons", () => {
  test.each([
    ["outline", "bg-transparent"],
    ["raised", "shadow-xs"],
    ["soft", "bg-neutral text-fg-on-neutral hover:bg-neutral-hover"],
    ["tonal", "bg-accent-muted text-fg-accent"],
    ["solid", "bg-(--secondary-solid) text-(--secondary-solid-fg)"],
  ])("secondary %s ships one text color", async (buttonSecondary, sig) => {
    for (const name of ["button", "toggle-button"]) {
      const content = await shipped(name, { buttonSecondary })
      expect(content, name).toContain(sig)
      const secondary = content.match(/secondary:\s*"([^"]*)"/g) ?? []
      for (const line of secondary)
        expect(
          line.match(/(?<![:\w-])text-(?:fg[\w-]*|\(--[\w-]+\))/g)?.length ?? 0,
          line,
        ).toBe(1)
    }
  })

  test("press and case ship on both", async () => {
    for (const name of ["button", "toggle-button"]) {
      expect(await shipped(name, { buttonPress: "nudge" })).toContain(
        "pressed:not-aria-[haspopup]:translate-y-px",
      )
      expect(await shipped(name, { buttonPress: "scale" })).toContain(
        "scale-[0.97]",
      )
      expect(await shipped(name, { buttonCase: "uppercase" })).toContain(
        "not-has-data-[slot=select-value]:uppercase",
      )
      const origin = await shipped(name)
      expect(origin).not.toContain("translate-y-px")
      expect(origin).not.toContain("uppercase")
    }
  })

  test("Origin ships no selected look on Button", async () => {
    expect(await shipped("button")).not.toContain("selected:")
    expect(
      await shipped("button", { paginationCurrent: "selected" }),
    ).toContain("selected:bg-selected")
  })

  test("gapped groups ship no attach mechanics", async () => {
    for (const name of ["group", "toggle-button-group"]) {
      const ledge = await shipped(name, owned("ledge"))
      expect(ledge, name).toContain("gap-2")
      expect(ledge, name).not.toContain("rounded-l-none")
      expect(ledge, name).not.toContain("shadow-none")
      expect(await shipped(name), name).toContain("rounded-l-none")
    }
  })
})

describe("button states", () => {
  test("pending keeps the face and inks the spinner", async () => {
    for (const buttonStyle of ["flat", "ledge"]) {
      const content = await shipped("button", owned(buttonStyle))
      expect(content).toContain("pending:[-webkit-text-fill-color:transparent]")
      expect(content).not.toMatch(/pending:(?:bg|border|text)-/)
    }
  })

  test("quiet and link stay transparent when disabled", () => {
    expect(BUTTON_VARIANTS.quiet).not.toContain("disabled:bg-")
    expect(BUTTON_VARIANTS.link).not.toContain("disabled:bg-")
  })

  // A `dark:bg-*` outranks `selected:bg-*` and `disabled:bg-*`.
  test("a secondary's dark fill rides a local var", () => {
    for (const [name, recipe] of Object.entries(BUTTON_SECONDARY))
      expect(recipe.variants.variant.secondary, name).not.toMatch(
        /(?:^|\s)dark:(?:[\w-]+:)*bg-/,
      )
  })

  test("Bevel's secondary is a card plate, white on a grouped page", () => {
    const bevel = BUTTON_SECONDARY.bevel.variants.variant.secondary
    expect(bevel).toContain("[--secondary-plate:var(--color-card)]")
    expect(bevel).not.toMatch(/(?:^|\s)bg-bg/)
  })
})

describe("segmented chip", () => {
  test("concentric with the track, whatever the item radius", async () => {
    for (const roleItem of ["auto", "none"]) {
      const content = await shipped("segmented-control", { roleItem })
      expect(content, roleItem).toContain(
        "rounded-[calc(var(--radius-lg)-3px)]",
      )
      expect(content, roleItem).not.toContain("--studio-")
    }
  })
})
