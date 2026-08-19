"use client"

/* /internal/panel-lab — the lab compares layout candidates side by side, each
   panel on its own design-system state so tweaking one never disturbs the
   others: Stacks (current), A structured scroll, B drill-in. Judged against
   docs/create-experience-spec.md, not taste. Primitives tab: the row
   vocabulary everything is assembled from. */

import { Tab, TabList, TabPanel, Tabs } from "@/registry/ui/tabs"
import { ControlLabPrimitives } from "@/modules/control-lab/page"
import { InternalShell } from "@/modules/internal/shell"

import { PanelFrame } from "./panel"
import { CHAPTERS } from "./state"
import type { Chapter, Lab } from "./state"
import { useLab } from "./use-lab"
import { PanelA } from "./variants/panel-a"
import { PanelB } from "./variants/panel-b"

function LabPanel({
  title,
  render,
}: {
  title: string
  render: (chapters: Chapter[], lab: Lab) => React.ReactNode
}) {
  const lab = useLab()
  // The real panel sits on the page bg — no card chrome around it.
  return (
    <div className="flex shrink-0 flex-col gap-2">
      <span className="text-xs font-medium text-fg-muted">{title}</span>
      <div className="flex h-[720px] w-[360px] flex-col">
        {render(CHAPTERS, lab)}
      </div>
    </div>
  )
}

export function PanelLabPage() {
  return (
    <InternalShell
      crumbs={[{ label: "Panel Lab" }]}
      title="Panel Lab"
      description="The /create control panel — layout candidates side by side, judged against the experience spec."
    >
      <Tabs defaultSelectedKey="panel" className="gap-8">
        <TabList variant="line" className="w-fit">
          <Tab id="panel">Panel</Tab>
          <Tab id="primitives">Primitives</Tab>
        </TabList>
        <TabPanel id="panel">
          <div className="flex gap-8 overflow-x-auto pb-4">
            <LabPanel
              title="B — drill-in (chosen)"
              render={(chapters, lab) => (
                <PanelB chapters={chapters} lab={lab} />
              )}
            />
            <LabPanel
              title="A — structured scroll"
              render={(chapters, lab) => (
                <PanelA chapters={chapters} lab={lab} />
              )}
            />
            <LabPanel
              title="Stacks (previous)"
              render={(chapters, lab) => (
                <PanelFrame chapters={chapters} lab={lab} />
              )}
            />
          </div>
        </TabPanel>
        <TabPanel id="primitives">
          <ControlLabPrimitives />
        </TabPanel>
      </Tabs>
    </InternalShell>
  )
}
