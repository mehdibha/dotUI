'use client'

import { Tab, TabList, TabPanel, Tabs } from '@/registry/ui/tabs'

import { ChartCard } from './chart-card'
import { CHART_FAMILIES, variantsFor } from './data'

/**
 * The charts showcase: a tabbed grid of every shipped variant, one family per
 * tab. React Aria mounts only the selected panel, so a single family's charts
 * are live at a time. The grid inherits the site theme, so `--chart-1…5` follow
 * the design system as usual.
 */
export function ChartShowcase() {
  return (
    <Tabs
      defaultSelectedKey={CHART_FAMILIES[0].id}
      className="gap-8 [--tabs-list-height:2.75rem]"
    >
      <TabList
        aria-label="Chart families"
        variant="default"
        className="mx-auto flex-wrap justify-center gap-2 bg-transparent [&_[data-tab-indicator]]:rounded-full [&_[data-tab-indicator]]:bg-muted [&_[data-tab-indicator]]:shadow-none"
      >
        {CHART_FAMILIES.map((f) => (
          <Tab
            key={f.id}
            id={f.id}
            className="rounded-full px-4 text-base selected:text-fg"
          >
            {f.name} chart
          </Tab>
        ))}
      </TabList>
      {CHART_FAMILIES.map((f) => {
        const variants = variantsFor(f.id)
        return (
          <TabPanel
            key={f.id}
            id={f.id}
            className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
          >
            {variants.map((v) => (
              <ChartCard
                key={v.key}
                familyId={f.id}
                demoKey={v.key}
                label={v.label}
              />
            ))}
          </TabPanel>
        )
      })}
    </Tabs>
  )
}
