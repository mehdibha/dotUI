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

function LabPanel({
  title,
  frame,
}: {
  title: string
  frame: "inline" | "stacked"
}) {
  const lab = useLab()
  // The real panel sits on the page bg — no card chrome around it.
  return (
    <div className="flex shrink-0 flex-col gap-2">
      <span className="text-xs font-medium text-fg-muted">{title}</span>
      <div className="flex h-[720px] w-[360px] flex-col">
        <PanelB chapters={CHAPTERS} lab={lab} frame={frame} />
      </div>
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
          <div className="flex gap-8 overflow-x-auto pb-4">
            <LabPanel title="Frame 1 — stacked" frame="stacked" />
            <LabPanel title="Current — inline" frame="inline" />
          </div>
        </TabPanel>
        <TabPanel id="primitives">
          <ControlLabPrimitives />
        </TabPanel>
      </Tabs>
    </InternalShell>
  )
}
