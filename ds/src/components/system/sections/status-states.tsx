'use client'

import { useState } from 'react'
import {
  CheckIcon,
  InboxIcon,
  RefreshCwIcon,
  TriangleAlertIcon,
} from 'lucide-react'

import type { RosterEntry, SystemWithColors } from '@/data/schema'
import { Alert, AlertDescription, AlertTitle } from '@/ui/alert'
import { Avatar, AvatarFallback } from '@/ui/avatar'
import { Badge } from '@/ui/badge'
import { Button } from '@/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/ui/empty'
import { Loader } from '@/ui/loader'
import {
  ProgressBar,
  ProgressBarFill,
  ProgressBarTrack,
} from '@/ui/progress-bar'
import { Skeleton } from '@/ui/skeleton'

import { Block, Choice, Mono, Note, Playground, Section } from '../primitives'

const cardStates = [
  { value: 'loaded', label: 'Loaded' },
  { value: 'loading', label: 'Loading' },
  { value: 'empty', label: 'Empty' },
  { value: 'error', label: 'Error' },
] as const

type CardState = (typeof cardStates)[number]['value']

const recentFiles = [
  { name: 'Q3 roadmap.fig', who: 'Priya Nair', status: 'Synced' },
  { name: 'Brand tokens.json', who: 'Alex Chen', status: 'Synced' },
  { name: 'Onboarding flow.fig', who: 'Priya Nair', status: 'Draft' },
]

function RecentFilesCard({ state }: { state: CardState }) {
  if (state === 'empty') {
    return (
      <div className="w-80 rounded-xl border p-1">
        <Empty className="border-none p-5">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <InboxIcon />
            </EmptyMedia>
            <EmptyTitle>No recent files</EmptyTitle>
            <EmptyDescription>
              Files you open or edit will show up here.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button size="sm">Browse files</Button>
          </EmptyContent>
        </Empty>
      </div>
    )
  }

  if (state === 'error') {
    return (
      <div className="w-80 rounded-xl border p-1">
        <Empty className="border-none p-5">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <TriangleAlertIcon />
            </EmptyMedia>
            <EmptyTitle>Couldn&apos;t load files</EmptyTitle>
            <EmptyDescription>
              Something went wrong reaching the server.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button size="sm" variant="quiet">
              <RefreshCwIcon /> Retry
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    )
  }

  const isLoading = state === 'loading'

  return (
    <div className="w-80 rounded-xl border p-4">
      <Skeleton isLoading={isLoading}>
        <p className="mb-3 text-sm font-medium text-fg" data-text>
          Recent files
        </p>
        <div className="flex flex-col gap-3">
          {recentFiles.map((file) => (
            <div key={file.name} className="flex items-center gap-3">
              <Avatar size="sm">
                <AvatarFallback>{file.who.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-fg" data-text>
                  {file.name}
                </p>
                <p className="truncate text-xs text-fg-muted" data-text>
                  {file.who}
                </p>
              </div>
              <Badge
                variant={file.status === 'Synced' ? 'success' : 'neutral'}
                appearance="subtle"
              >
                {file.status}
              </Badge>
            </div>
          ))}
        </div>
      </Skeleton>
    </div>
  )
}

export function StatusStatesSection(_props: {
  system: SystemWithColors
  rosterEntry?: RosterEntry
}) {
  const [cardState, setCardState] = useState<CardState>('loaded')
  const [determinateValue, setDeterminateValue] = useState(62)

  return (
    <Section
      title="Empty, Loading & Skeleton"
      kicker="Foundations"
      intro="What a component shows when it has nothing, when it's waiting, and when it's broken is as designed as its happy path. Spectrum 2 covers this with IllustratedMessage for empty and error states, ProgressBar/ProgressCircle for loading, and — new in S2 — Skeleton, which shimmers a component's real content in place instead of swapping in generic gray boxes."
    >
      <Block
        title="One card, four states"
        description="The same 'recent files' layout, switched between its loaded, loading, empty and error states. Loading wraps the identical markup in Skeleton — the layout doesn't shift when data arrives."
        aside={
          <Choice
            options={cardStates}
            value={cardState}
            onChange={setCardState}
            label="Card state"
          />
        }
      >
        <Playground
          label={cardStates.find((s) => s.value === cardState)?.label}
          hint={
            cardState === 'loading'
              ? 'Same tree, wrapped in Skeleton isLoading — layout parity guaranteed'
              : cardState === 'empty'
                ? 'Empty (react-spectrum): media + title + description + action'
                : cardState === 'error'
                  ? 'Error path reuses Empty with a retry action'
                  : 'Real data, real components'
          }
          surface="muted"
        >
          <RecentFilesCard state={cardState} />
        </Playground>
      </Block>

      <Block
        title="Error as an inline alert"
        description="When the failure is scoped to an action rather than a whole region, Spectrum reaches for an inline error rather than replacing the layout — e.g. a failed save inside an otherwise-intact form."
      >
        <Playground surface="muted" bodyClassName="max-w-md" center={false}>
          <Alert variant="danger">
            <TriangleAlertIcon />
            <AlertTitle>Couldn&apos;t save changes</AlertTitle>
            <AlertDescription>
              Check your connection and try again.
            </AlertDescription>
          </Alert>
          <div className="mt-3 flex justify-end">
            <Button size="sm" variant="quiet">
              <RefreshCwIcon /> Retry
            </Button>
          </div>
        </Playground>
      </Block>

      <Block
        title="Loading indicators"
        description="ProgressCircle (rendered here via Loader) is the space-limited spinner — S for buttons/menus/inputs, M default, L for large areas — used full-page or in tiny spots. ProgressBar is preferred in narrow regions like tables and cards, and inside loading dialogs; it comes in indeterminate and determinate flavors, label on the left and value on the right, both sitting above the track."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Playground
            label="ProgressBar · indeterminate"
            surface="muted"
            center={false}
          >
            <div className="w-full max-w-[192px]">
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="text-fg">Loading data…</span>
              </div>
              <ProgressBar aria-label="Loading data" isIndeterminate>
                <ProgressBarTrack>
                  <ProgressBarFill />
                </ProgressBarTrack>
              </ProgressBar>
            </div>
          </Playground>

          <Playground
            label="ProgressBar · determinate"
            surface="muted"
            center={false}
          >
            <div className="w-full max-w-[192px]">
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="text-fg">Uploading…</span>
                <span className="font-mono text-fg-muted tabular-nums">
                  {determinateValue}%
                </span>
              </div>
              <ProgressBar
                aria-label="Uploading"
                value={determinateValue}
                minValue={0}
                maxValue={100}
              >
                <ProgressBarTrack>
                  <ProgressBarFill />
                </ProgressBarTrack>
              </ProgressBar>
              <input
                type="range"
                min={0}
                max={100}
                value={determinateValue}
                onChange={(e) => setDeterminateValue(Number(e.target.value))}
                aria-label="Simulate progress"
                className="mt-3 w-full accent-fg-accent"
              />
            </div>
          </Playground>
        </div>

        <Playground
          label="ProgressCircle (Loader)"
          hint="S · M · L — full-page or space-constrained spots"
          surface="muted"
          className="mt-4"
        >
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-center gap-2">
              <Loader className="size-4" />
              <span className="text-xs text-fg-muted">S</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Loader className="size-6" />
              <span className="text-xs text-fg-muted">M · default</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Loader className="size-9" />
              <span className="text-xs text-fg-muted">L</span>
            </div>
          </div>
        </Playground>

        <Note className="mt-3">
          Widths shown are Spectrum defaults: ProgressBar is 192px on desktop,
          240px on mobile (min 48px, max 768px). The only documented
          anti-flicker delay is on Button&apos;s <Mono>isPending</Mono> state,
          which waits 1s before showing its spinner — there is no published
          generic delay for spinners or skeletons.
        </Note>
      </Block>

      <Block
        title="Skeleton wraps the real tree"
        description="Spectrum 2's Skeleton is not a separate gray-box component: you wrap the actual component tree (with placeholder data) in <Skeleton isLoading>, and it replaces text, images, icons, and specific components like Badge, StatusLight and Meter with a shimmering placeholder in place — nested form controls are automatically disabled."
      >
        <Playground
          label="Same button, two states"
          hint="Skeleton finds text and controls inside and masks them — the button keeps its size"
          surface="muted"
        >
          <div className="flex items-center gap-6">
            <Skeleton isLoading={false}>
              <Button>
                <CheckIcon /> Confirm order
              </Button>
            </Skeleton>
            <Skeleton isLoading>
              <Button>
                <CheckIcon /> Confirm order
              </Button>
            </Skeleton>
          </div>
        </Playground>
        <Note className="mt-3">
          Because it wraps the real markup rather than a hand-drawn stand-in,
          the loading and loaded states are guaranteed to share layout — no
          dimension mismatch when content arrives.
        </Note>
      </Block>

      <Note>
        Source: react-spectrum s2 (Skeleton, IllustratedMessage APIs) ·
        spectrum.adobe.com/page/progress-bar ·
        spectrum.adobe.com/page/progress-circle
      </Note>
    </Section>
  )
}
