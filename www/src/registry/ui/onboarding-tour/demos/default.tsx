'use client'

import type { DriveStep } from 'driver.js'
import { BellIcon, SearchIcon, SettingsIcon } from 'lucide-react'

import { OnboardingTour } from '@/registry/ui/onboarding-tour'

const steps: DriveStep[] = [
  {
    element: '#tour-search',
    popover: {
      title: 'Search',
      description: 'Jump to anything from here. Try typing a project name.',
    },
  },
  {
    element: '#tour-notifications',
    popover: {
      title: 'Notifications',
      description: 'New activity and mentions show up here.',
    },
  },
  {
    element: '#tour-settings',
    popover: {
      title: 'Settings',
      description: 'Manage your workspace and preferences.',
    },
  },
]

export default function Demo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <div className="flex items-center justify-between rounded-lg border bg-card p-2">
        <div className="flex items-center gap-1">
          <div
            id="tour-search"
            className="flex size-9 items-center justify-center rounded-md text-fg-muted hover:bg-muted"
          >
            <SearchIcon className="size-4" />
          </div>
          <div
            id="tour-notifications"
            className="flex size-9 items-center justify-center rounded-md text-fg-muted hover:bg-muted"
          >
            <BellIcon className="size-4" />
          </div>
          <div
            id="tour-settings"
            className="flex size-9 items-center justify-center rounded-md text-fg-muted hover:bg-muted"
          >
            <SettingsIcon className="size-4" />
          </div>
        </div>
        <OnboardingTour steps={steps} variant="primary" size="sm">
          Start tour
        </OnboardingTour>
      </div>
      <p className="text-sm text-fg-muted">
        Click <span className="font-medium text-fg">Start tour</span> to walk
        through the toolbar above.
      </p>
    </div>
  )
}
