"use client"

/* /internal/panel-lab — the /create control panel, one frame: the drill-in
   chosen in Aug 2026, judged against docs/create-experience-spec.md.
   Primitives tab: the row vocabulary everything is assembled from. */

import { Tab, TabList, TabPanel, Tabs } from "@/registry/ui/tabs"
import { ControlLabPrimitives } from "@/modules/control-lab/page"
import { InternalShell } from "@/modules/internal/shell"

import { CHAPTERS } from "./state"
import { useLab } from "./use-lab"
import { PanelB } from "./variants/panel-b"

function Panel() {
  const lab = useLab()
  // The chrome is the card — one enclosed surface, no extra wrapper here.
  return (
    <div className="flex h-[720px] w-[360px] shrink-0 flex-col">
      <PanelB chapters={CHAPTERS} lab={lab} />
    </div>
  )
}

export function PanelLabPage() {
  return (
    <InternalShell
      crumbs={[{ label: "Panel Lab" }]}
      title="Panel Lab"
      description="The /create control panel — the drill-in frame, judged against the experience spec."
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
