import { Copy } from 'lucide-react'

import { Button } from '@/registry/ui/button'
import { Tab, TabList, TabPanel, Tabs } from '@/registry/ui/tabs'

export default function Demo() {
  return (
    <Tabs className="w-full max-w-sm">
      <TabList variant="line">
        <Tab id="overview">Overview</Tab>
        <Tab id="examples">Code</Tab>
        <Tab id="api">API</Tab>
      </TabList>
      <TabPanel id="overview">
        <p className="text-sm text-fg-muted">
          The <span className="font-medium text-fg">useToggle</span> hook
          manages a boolean state and returns a setter to flip it.
        </p>
      </TabPanel>
      <TabPanel id="examples">
        <div className="relative rounded-lg bg-muted p-3 font-mono text-xs text-fg">
          <Button
            variant="quiet"
            size="sm"
            isIconOnly
            aria-label="Copy code"
            className="absolute top-1.5 right-1.5"
          >
            <Copy />
          </Button>
          <pre className="overflow-x-auto pr-7">
            {`const [on, toggle] = useToggle()`}
          </pre>
        </div>
      </TabPanel>
      <TabPanel id="api">
        <dl className="flex flex-col gap-2 text-sm">
          <div className="flex items-baseline justify-between gap-2">
            <dt className="font-mono text-fg">on</dt>
            <dd className="text-fg-muted">boolean</dd>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <dt className="font-mono text-fg">toggle</dt>
            <dd className="text-fg-muted">() =&gt; void</dd>
          </div>
        </dl>
      </TabPanel>
    </Tabs>
  )
}
