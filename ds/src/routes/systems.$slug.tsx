import { type ComponentType, useEffect, useState } from 'react'
import { createFileRoute, notFound } from '@tanstack/react-router'

import { cn } from '@/lib/utils'
import { ContrastLab } from '@/components/explorer/contrast-lab'
import { ContrastTable } from '@/components/explorer/contrast-table'
import { FocusAnatomy } from '@/components/explorer/focus-anatomy'
import { LayerDiagram } from '@/components/explorer/layer-diagram'
import { ModeSwitcher } from '@/components/explorer/mode-switcher'
import { OverviewCards } from '@/components/explorer/overview-cards'
import { RampGrid } from '@/components/explorer/ramp-grid'
import { SectionNotes } from '@/components/explorer/section-notes'
import { SourceLinks } from '@/components/explorer/source-links'
import { SpecTable } from '@/components/explorer/spec-table'
import { StepRoleExplorer } from '@/components/explorer/step-role-explorer'
import { TokenTable } from '@/components/explorer/token-table'
import { dataIndex } from '@/data'
import type { SystemWithColors } from '@/data/schema'
import { Badge } from '@/ui/badge'
import { Link } from '@/ui/link'

export const Route = createFileRoute('/systems/$slug')({
  loader: ({ params }) => {
    const rosterEntry = dataIndex.roster.find(
      (entry) => entry.slug === params.slug,
    )
    const system = dataIndex.systems.find((s) => s.slug === params.slug)
    if (!rosterEntry && !system) throw notFound()
    return { rosterEntry, system }
  },
  component: SystemPage,
})

type SectionContent = ComponentType<{ system: SystemWithColors }>

function OverviewContent({ system }: { system: SystemWithColors }) {
  const { colors } = system
  return (
    <>
      <OverviewCards entries={colors.overview} />
      <SectionNotes
        notes={colors.notes.filter((note) => note.section === 'overview')}
      />
      <div className="mt-8 border-t pt-5">
        <p className="text-xs text-fg-muted">
          Primary sources for this system:
        </p>
        <SourceLinks sources={colors.sources} className="mt-2" />
      </div>
    </>
  )
}

function ArchitectureContent({ system }: { system: SystemWithColors }) {
  const { colors } = system
  return (
    <>
      <p className="text-sm text-fg-muted">
        How raw values become component styles.
      </p>
      <div className="mt-5">
        <LayerDiagram layers={colors.layers} />
      </div>
      <SectionNotes
        notes={colors.notes.filter((note) => note.section === 'architecture')}
      />
    </>
  )
}

function PaletteContent({ system }: { system: SystemWithColors }) {
  const { colors } = system
  const [mode, setMode] = useState(colors.modes[0] ?? 'light')
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-fg-muted">
          Every shipped ramp, exactly as the system resolves it. Click a swatch
          for its dossier.
        </p>
        <ModeSwitcher modes={colors.modes} mode={mode} onChange={setMode} />
      </div>
      <div className="mt-6">
        <RampGrid ramps={colors.ramps} mode={mode} />
      </div>
      <SectionNotes
        notes={colors.notes.filter((note) => note.section === 'palette')}
      />
    </>
  )
}

function ScaleContent({ system }: { system: SystemWithColors }) {
  const { colors } = system
  return (
    <>
      <p className="text-sm text-fg-muted">
        The scale model: what each step means, on any scale. Click a step.
      </p>
      <div className="mt-5">
        <StepRoleExplorer
          stepRoles={colors.stepRoles!}
          ramps={colors.ramps}
          modes={colors.modes}
        />
      </div>
      <SectionNotes
        notes={colors.notes.filter((note) => note.section === 'scale')}
      />
    </>
  )
}

function TokensContent({ system }: { system: SystemWithColors }) {
  const { colors } = system
  return (
    <>
      <p className="text-sm text-fg-muted">
        The semantic and component vocabulary, searchable across names,
        references and values.
      </p>
      <div className="mt-5">
        <TokenTable groups={colors.tokenGroups} modes={colors.modes} />
      </div>
      <SectionNotes
        notes={colors.notes.filter((note) => note.section === 'tokens')}
      />
    </>
  )
}

function FocusContent({ system }: { system: SystemWithColors }) {
  const { colors } = system
  return (
    <>
      <p className="text-sm text-fg-muted">
        How the focus highlight is built and where its color comes from.
      </p>
      {colors.focusRing && (
        <div className="mt-5">
          <FocusAnatomy
            focusRing={colors.focusRing}
            ramps={colors.ramps}
            modes={colors.modes}
          />
        </div>
      )}
      {colors.focus.length > 0 && (
        <div className="mt-8">
          <SpecTable entries={colors.focus} />
        </div>
      )}
      <SectionNotes
        notes={colors.notes.filter((note) => note.section === 'focus')}
      />
    </>
  )
}

function ContrastContent({ system }: { system: SystemWithColors }) {
  const { colors } = system
  const guarantees = [
    ...new Map(
      colors.contrast
        .filter((pair) => pair.sweep)
        .map((pair) => [
          `${pair.sweep!.fgStep}-${pair.sweep!.bgStep}`,
          pair.sweep!,
        ]),
    ).values(),
  ]
  return (
    <>
      <p className="text-sm text-fg-muted">
        Documented guarantees and observed measurements — never conflated.
      </p>
      <div className="mt-5">
        <ContrastTable pairs={colors.contrast} />
      </div>
      {colors.ramps.length > 0 && (
        <div className="mt-10">
          <ContrastLab
            ramps={colors.ramps}
            modes={colors.modes}
            guarantees={guarantees}
          />
        </div>
      )}
      <SectionNotes
        notes={colors.notes.filter((note) => note.section === 'contrast')}
      />
    </>
  )
}

function sectionsFor(system: SystemWithColors) {
  const { colors } = system
  const hasNotes = (id: string) =>
    colors.notes.some((note) => note.section === id)
  return (
    [
      {
        id: 'overview',
        label: 'Overview',
        Content: OverviewContent,
        show: true,
      },
      {
        id: 'architecture',
        label: 'Architecture',
        Content: ArchitectureContent,
        show: colors.layers.length > 0 || hasNotes('architecture'),
      },
      {
        id: 'palette',
        label: 'Palette',
        Content: PaletteContent,
        show: colors.ramps.length > 0 || hasNotes('palette'),
      },
      {
        id: 'scale',
        label: 'Scale',
        Content: ScaleContent,
        show: Boolean(colors.stepRoles),
      },
      {
        id: 'tokens',
        label: 'Tokens',
        Content: TokensContent,
        show: colors.tokenGroups.length > 0 || hasNotes('tokens'),
      },
      {
        id: 'focus',
        label: 'Focus',
        Content: FocusContent,
        show:
          colors.focus.length > 0 ||
          Boolean(colors.focusRing) ||
          hasNotes('focus'),
      },
      {
        id: 'contrast',
        label: 'Contrast',
        Content: ContrastContent,
        show: colors.contrast.length > 0 || hasNotes('contrast'),
      },
    ] satisfies {
      id: string
      label: string
      Content: SectionContent
      show: boolean
    }[]
  ).filter((section) => section.show)
}

/** Highlights the section whose top has scrolled nearest the viewport top. */
function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? '')
  const key = ids.join('|')

  useEffect(() => {
    const onScroll = () => {
      let current = ids[0] ?? ''
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= 140) current = id
      }
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4
      if (atBottom) current = ids[ids.length - 1] ?? current
      setActive(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return [active, setActive] as const
}

function SectionNav({
  sections,
  activeId,
  onSelect,
}: {
  sections: ReturnType<typeof sectionsFor>
  activeId: string
  onSelect: (id: string) => void
}) {
  return (
    <nav aria-label="Sections" className="flex flex-col gap-2">
      {sections.map((section) => (
        <button
          key={section.id}
          type="button"
          onClick={() => onSelect(section.id)}
          aria-current={activeId === section.id ? 'true' : undefined}
          className={cn(
            'w-fit cursor-pointer text-left text-sm text-fg-muted transition-colors hover:text-fg',
            activeId === section.id && 'font-medium text-fg',
          )}
        >
          {section.label}
        </button>
      ))}
    </nav>
  )
}

function SystemBody({ system }: { system: SystemWithColors }) {
  const sections = sectionsFor(system)
  const ids = sections.map((section) => section.id)
  const [activeId, setActiveId] = useScrollSpy(ids)

  const goTo = (id: string) => {
    setActiveId(id)
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  return (
    <div className="relative mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-10 lg:flex-row lg:gap-12 xl:block">
      <aside className="lg:sticky lg:top-6 lg:h-fit lg:w-44 lg:shrink-0 xl:absolute xl:inset-y-0 xl:right-full xl:mr-8 xl:h-auto xl:w-36">
        <div className="xl:sticky xl:top-10">
          <SectionNav sections={sections} activeId={activeId} onSelect={goTo} />
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        {sections.map((section, index) => (
          <section
            key={section.id}
            id={section.id}
            className={cn('scroll-mt-10', index > 0 && 'mt-14 border-t pt-10')}
          >
            <h2 className="text-lg font-semibold tracking-tight">
              {section.label}
            </h2>
            <div className="mt-5">
              <section.Content system={system} />
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

function SystemPage() {
  const { rosterEntry, system } = Route.useLoaderData()
  const name = system?.name ?? rosterEntry?.name ?? ''
  const org = system?.org ?? rosterEntry?.org ?? ''
  const docs = system?.sources.docs ?? rosterEntry?.homepage
  const repo = system?.sources.repo ?? rosterEntry?.repo
  const site = system?.sources.site

  return (
    <div>
      <header className="mx-auto w-full max-w-4xl px-6 pt-10">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {name}
          </h1>
          {system && (
            <p className="font-mono text-[11px] text-fg-muted">
              added {system.createdAt} · updated {system.updatedAt} · reviewed{' '}
              {system.reviewedAt}
            </p>
          )}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
          <span className="text-fg-muted">{org}</span>
          {docs && <Link href={docs}>Docs</Link>}
          {repo && <Link href={repo}>Source</Link>}
          {site && site !== docs && <Link href={site}>Site</Link>}
          <Badge
            appearance="subtle"
            variant={system?.status === 'published' ? 'success' : 'neutral'}
          >
            {system?.status ?? 'planned'}
          </Badge>
          {rosterEntry?.status === 'shipped-css' && (
            <Badge appearance="subtle" variant="info">
              reverse-engineered
            </Badge>
          )}
        </div>
      </header>

      {system ? (
        <SystemBody system={system} />
      ) : (
        <div className="mx-auto w-full max-w-4xl px-6 pb-16">
          <p className="mt-10 max-w-2xl rounded-lg border p-6 text-fg-muted">
            Research planned. This system&apos;s full color architecture —
            palette, semantic tokens, focus and contrast behavior — will be
            explorable here.
          </p>
        </div>
      )}
    </div>
  )
}
