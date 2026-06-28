import { ZapIcon } from 'lucide-react'

import {
  Disclosure,
  DisclosurePanel,
  DisclosureTrigger,
} from '@/registry/ui/disclosure'

export default function Demo() {
  return (
    <div className="w-full max-w-sm rounded-lg border bg-bg p-4">
      <div className="flex items-start gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <ZapIcon className="size-4" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-medium">Edge Functions</h3>
          <p className="text-sm text-fg-muted">
            Run code closer to your users with zero cold starts.
          </p>
        </div>
        <span className="ml-auto shrink-0 text-sm font-medium">$20/mo</span>
      </div>
      <Disclosure className="mt-2">
        <DisclosureTrigger>What's included</DisclosureTrigger>
        <DisclosurePanel>
          <ul className="list-inside list-disc space-y-1 text-sm text-fg-muted">
            <li>1M invocations per month</li>
            <li>Deploy to 30+ regions worldwide</li>
            <li>Automatic failover and scaling</li>
            <li>Logs and metrics retained for 7 days</li>
          </ul>
        </DisclosurePanel>
      </Disclosure>
    </div>
  )
}
