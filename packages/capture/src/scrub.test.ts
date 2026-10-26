import { describe, expect, it } from "vitest"

import { literals, MARK, privatesOf, scrub } from "./scrub"
import type { Snapshot } from "./snapshot"

const run = (text: string) => `${MARK.open}${text}${MARK.close}`
const copyOf = (html: string, css = ""): Snapshot => ({
  html,
  css,
  width: 100,
  height: 20,
  backdrop: "",
  fonts: [],
  redacted: true,
})

describe("literals", () => {
  it("reads every quote style, unescaped, and the pieces between slots", () => {
    const js = `t("New issue");x='Don\\'t save';y=\`Add  label\`;z="{count} members";w="caf\\u00e9"`
    expect(literals(js)).toEqual([
      "New issue",
      "Don't save",
      "Add label",
      "{count} members",
      "members",
      "café",
    ])
  })

  it("reads a message catalog shipped as one long string", () => {
    const catalog = JSON.stringify({
      a: ["<0/> and <1>", ["others"], "</1> liked your post"],
      b: ["Bluesky adapts to your screen in any orientation or window size."],
      c: ["x".repeat(160)],
    })
    const words = literals(`m=JSON.parse(${JSON.stringify(catalog)})`)
    expect(words).toContain("liked your post")
    expect(words).toContain(
      "Bluesky adapts to your screen in any orientation or window size.",
    )
  })

  it("keeps a long string that holds no others", () => {
    const help = "Choose who can see your posts. ".repeat(8).trim()
    expect(literals(`t(${JSON.stringify(help)})`)).toContain(help)
  })

  it("skips strings without a letter", () => {
    expect(literals(`a="12";b=" / "`)).toEqual([])
  })
})

describe("privatesOf", () => {
  it("folds each line and skips comments and short ones", () => {
    expect(privatesOf("# me\nJane Doé\n  ab \nAcme Inc\n")).toEqual([
      "jane doe",
      "acme inc",
    ])
  })
})

describe("scrub", () => {
  const words = new Set(["New issue", "Inbox", "members"])

  it("keeps the product's words and swaps the rest for the same shape", () => {
    const copy = copyOf(
      `<span>${run("New issue")}</span><span>${run("Fix the login page")}</span><b>${run("12")}</b>`,
    )
    const clean = scrub(copy, words, [])
    expect(clean?.html).toContain("<span>New issue</span>")
    const [, swapped, digits] =
      /<span>New issue<\/span><span>(.*)<\/span><b>(.*)<\/b>/.exec(
        clean?.html ?? "",
      ) ?? []
    expect(swapped).not.toBe("Fix the login page")
    expect(swapped?.split(" ").map((word) => word.length)).toEqual([3, 3, 5, 4])
    expect(swapped?.[0]).toMatch(/[A-Z]/)
    expect(swapped?.slice(1)).toMatch(/^[a-z ]+$/)
    expect(digits).toMatch(/^[1-9]\d$/)
    expect(clean?.html).not.toMatch(/[﷐﷑]/)
  })

  it("swaps a word the same way every time", () => {
    const copy = copyOf(`${run("Jane")} ${run("Jane")}`)
    const [a, b] = scrub(copy, words, [])?.html.split(" ") ?? []
    expect(a).toBe(b)
    expect(a).toHaveLength(4)
  })

  it("keeps glyph and punctuation runs", () => {
    const copy = copyOf(`${run("·")}${run("")}`)
    expect(scrub(copy, words, [])?.html).toBe("·")
  })

  it("swaps a product word that names a private string", () => {
    const copy = copyOf(run("Inbox"))
    expect(scrub(copy, words, ["inbox"])?.html).not.toBe("Inbox")
  })

  it("drops a copy a private string survives", () => {
    // Outside any run: an attribute the snapshot kept.
    const copy = copyOf(`<input value="x" type="jane@acme.com">`)
    expect(scrub(copy, words, ["jane@acme.com"])).toBeNull()
  })

  it("drops a copy whose font URL holds a private string", () => {
    const copy = {
      ...copyOf(run("Inbox")),
      fonts: [
        {
          family: "Inter",
          src: 'url("https://cdn.test/Acme%20Inc/inter.woff2")',
        },
      ],
    }
    expect(scrub(copy, words, ["acme inc"])).toBeNull()
  })

  it("drops a copy that shows a private string across elements", () => {
    const known = new Set(["Jane", "Doe"])
    for (const html of [
      `${run("Jane")} <b>${run("Doe")}</b>`,
      `<span>${run("Jane")}</span><span>${run("Doe")}</span>`,
    ])
      expect(scrub(copyOf(html), known, ["jane doe"])).toBeNull()
  })

  it("swaps escaped runs and keeps their escaping", () => {
    const copy = copyOf(
      `<p>${run("Tom &amp; Jerry &lt;3")}</p>`,
      `[data-s="1"]::before { content: "${run('Say \\"hi\\"')}"; }`,
    )
    const clean = scrub(copy, words, [])
    expect(clean?.html).toMatch(
      /^<p>[A-Z][a-z]{2} &amp; [A-Z][a-z]{4} &lt;\d<\/p>$/,
    )
    expect(clean?.css).toMatch(/content: "[A-Z][a-z]{2} \\"[a-z]{2}\\""; }$/)
  })
})
