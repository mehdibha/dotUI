import { describe, expect, it } from "vitest"

import { transformDemo } from "./transformer"

const demo = (body: string) => `import { Button } from "@/registry/ui/button"

export default function Demo() {
  return (
${body}
  )
}
`

describe("transformDemo preview", () => {
  it("drops a root layout div", () => {
    const { preview } = transformDemo(
      demo(`    <div className="flex gap-2">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
    </div>`),
    )
    expect(preview).toBe(`<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>`)
  })

  it("drops a root fragment and keeps nested indentation", () => {
    const { preview } = transformDemo(
      demo(`    <>
      <Button>
        <span>One</span>
      </Button>
    </>`),
    )
    expect(preview).toBe(`<Button>
  <span>One</span>
</Button>`)
  })

  it("keeps a root that is not a plain layout div", () => {
    const { preview } = transformDemo(
      demo(`    <form onSubmit={onSubmit}>
      <Button type="submit">Save</Button>
    </form>`),
    )
    expect(preview).toBe(`<form onSubmit={onSubmit}>
  <Button type="submit">Save</Button>
</form>`)
  })
})
