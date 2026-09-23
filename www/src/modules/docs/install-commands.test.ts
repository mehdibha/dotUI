import { expect, it } from "vitest"

import { buildInitCommands } from "./install-commands"

it("quotes the init URL, whose query is shell syntax", () => {
  const url = "https://dotui.org/r/init?preset=linear@1&d=v5.abc"
  expect(buildInitCommands(url)).toEqual({
    npm: `npx shadcn@latest init "${url}"`,
    pnpm: `pnpm dlx shadcn@latest init "${url}"`,
    yarn: `yarn dlx shadcn@latest init "${url}"`,
    bun: `bunx shadcn@latest init "${url}"`,
  })
})
