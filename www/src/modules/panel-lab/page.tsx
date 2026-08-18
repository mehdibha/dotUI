"use client"

/* /internal/panel-lab — two tabs, one lab: the panel being designed, and the
   row vocabulary it is assembled from. */

import { Tab, TabList, TabPanel, Tabs } from "@/registry/ui/tabs"
import { ControlLabPrimitives } from "@/modules/control-lab/page"
import { InternalShell } from "@/modules/internal/shell"

import { PanelFrame } from "./panel"
import { CHAPTERS } from "./state"
import { useLab } from "./use-lab"

function Panel() {
  const lab = useLab()
  // The real panel sits on the page bg — no card chrome around it.
  return (
    <div className="flex h-[720px] w-[360px] shrink-0 flex-col">
      <PanelFrame chapters={CHAPTERS} lab={lab} />
    </div>
  )
}

export function PanelLabPage() {
  return (
    <InternalShell
      crumbs={[{ label: "Panel Lab" }]}
      title="Panel Lab"
      description="The /create control panel, rebuilt in the row language — every section opening on a live specimen of the axis it owns."
    >
      <Tabs defaultSelectedKey="panel" className="gap-8">
        <TabList variant="line" className="w-fit">
          <Tab id="panel">Panel</Tab>
          <Tab id="primitives">Primitives</Tab>
        </TabList>
        <TabPanel id="panel">
          <Panel />
        </TabPanel>
        <TabPanel id="primitives">
          <ControlLabPrimitives />
        </TabPanel>
      </Tabs>
    </InternalShell>
  )
}
