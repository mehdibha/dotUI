'use client'

import { useEffect } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { AnimatePresence } from 'motion/react'
import * as ButtonPrimitives from 'react-aria-components/Button'

import { cn } from '@/registry/lib/utils'
import { ToggleButton } from '@/registry/ui/toggle-button'
import { ToggleButtonGroup } from '@/registry/ui/toggle-button-group'

import { AXES } from './axes'
import { Canvas } from './canvas'
import { CommandPalette } from './command-palette'
import { Inspector } from './inspector'
import { Navigator } from './navigator'
import { Onboarding } from './onboarding'
import { StudioProvider, useStudio } from './store'
import { TopBar } from './top-bar'

const routeApi = getRouteApi('/_app/create')

/** The redesigned /create: a brand-to-system studio. */
export function Studio() {
  return (
    <StudioProvider initialOnboarding={false}>
      <StudioShell />
    </StudioProvider>
  )
}

function StudioShell() {
  const { preset } = routeApi.useSearch()
  const { onboardingOpen, setOnboardingOpen, mobilePane, setMobilePane } =
    useStudio()

  // Greet first-time visitors (no preset yet) with the generator, once per
  // session. Run after mount to avoid an SSR/hydration mismatch.
  useEffect(() => {
    if (preset) return
    if (sessionStorage.getItem('dotui-onboarded')) return
    sessionStorage.setItem('dotui-onboarded', '1')
    setOnboardingOpen(true)
    // oxlint-disable-next-line react/exhaustive-deps -- mount-only greeting
  }, [])

  // The studio owns the full viewport now that the site Header is suppressed on
  // /create (see _app/route.tsx); the TopBar below is the single `--header-height`
  // bar, so the shell spans the whole screen rather than subtracting a header
  // that no longer sits above it.
  return (
    <div className="flex h-svh min-h-0 flex-1 flex-col">
      <TopBar />

      {/* Mobile pane switcher */}
      <div className="px-4 pb-2 lg:hidden">
        <ToggleButtonGroup
          aria-label="Studio view"
          selectionMode="single"
          disallowEmptySelection
          size="sm"
          selectedKeys={[mobilePane]}
          onSelectionChange={(keys) => {
            const next = keys.values().next().value
            if (next === 'design' || next === 'preview') setMobilePane(next)
          }}
          className="w-full *:flex-1"
        >
          <ToggleButton id="design">Design</ToggleButton>
          <ToggleButton id="preview">Preview</ToggleButton>
        </ToggleButtonGroup>
      </div>

      <div className="relative flex min-h-0 flex-1 gap-3 p-4 pt-0 lg:gap-3">
        <Navigator className="max-lg:hidden" />

        <Canvas className={cn(mobilePane === 'design' && 'max-lg:hidden')} />

        <div
          className={cn(
            'flex min-h-0 min-w-0 flex-col gap-3 max-lg:flex-1',
            mobilePane === 'preview' && 'max-lg:hidden',
          )}
        >
          <MobileAxisBar />
          <Inspector className="min-h-0 flex-1" />
        </div>

        <AnimatePresence>{onboardingOpen && <Onboarding />}</AnimatePresence>
      </div>

      <CommandPalette />
    </div>
  )
}

/** A horizontal axis switcher shown only on mobile (the rail is desktop-only). */
function MobileAxisBar() {
  const { axis, setAxis } = useStudio()
  return (
    <div className="flex gap-1 overflow-x-auto rounded-lg border bg-card p-1 lg:hidden">
      {AXES.map((item) => {
        const active = axis === item.id
        return (
          <ButtonPrimitives.Button
            key={item.id}
            onPress={() => setAxis(item.id)}
            className={cn(
              'flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] font-medium focus-reset transition-colors focus-visible:focus-ring',
              active
                ? 'bg-primary/10 text-primary'
                : 'text-fg-muted hover:bg-neutral hover:text-fg',
            )}
          >
            <item.icon className="size-3.5" />
            {item.label}
          </ButtonPrimitives.Button>
        )
      })}
    </div>
  )
}
