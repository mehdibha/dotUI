import { useState } from "react"
import type * as React from "react"

import { siteConfig } from "@/config/site"
import { DesignSystemProvider } from "@/lib/styles"
import { SmartphoneIcon } from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import type { Density } from "@/registry/types"
import { QRCode } from "@/registry/ui/qr-code"
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/registry/ui/segmented-control"
import { Eyebrow } from "@/components/eyebrow"
import { Footer } from "@/components/layout/footer"
import { ColorScene } from "@/modules/showcase/scenes/color"
import { ContextMenuScene } from "@/modules/showcase/scenes/context-menu"
import { DatesScene } from "@/modules/showcase/scenes/dates"
import { DialogsScene } from "@/modules/showcase/scenes/dialogs"
import { KeyboardsScene } from "@/modules/showcase/scenes/keyboards"
import { MenuScene } from "@/modules/showcase/scenes/menu"
import { SearchableSelectScene } from "@/modules/showcase/scenes/searchable-select"
import { SelectScene } from "@/modules/showcase/scenes/select"
import { SnapPointsScene } from "@/modules/showcase/scenes/snap-points"
import { StackedSheetsScene } from "@/modules/showcase/scenes/stacked-sheets"
import { ToastScene } from "@/modules/showcase/scenes/toast"
import { TouchControlsScene } from "@/modules/showcase/scenes/touch-controls"

// Popovers already become sheets by default; dialogs opt in here so forms
// slide up too (alert dialogs stay centered either way).
const PARAMS = { modal: { mobile: "sheet" } }

const DENSITIES = ["compact", "default", "touch"] as const satisfies Density[]

interface SceneEntry {
  title: string
  description: string
  demo: React.ReactNode
}

const CHAPTERS: {
  title: string
  description: string
  scenes: SceneEntry[]
}[] = [
  {
    title: "Every overlay becomes a sheet",
    description:
      "Below 768px, menus, selects and pickers rise from the bottom edge, within thumb reach. Same component, same code.",
    scenes: [
      {
        title: "Menus",
        description: "Tap the dots. Submenus stack a second sheet on top.",
        demo: <MenuScene />,
      },
      {
        title: "Long-press menus",
        description:
          "Press and hold the message. Right-click does the same with a mouse.",
        demo: <ContextMenuScene />,
      },
      {
        title: "Select",
        description: "Options get full-width rows with room for a description.",
        demo: <SelectScene />,
      },
      {
        title: "Searchable select",
        description:
          "Long lists get a search field. On phones it replaces the combobox.",
        demo: <SearchableSelectScene />,
      },
      {
        title: "Date & time pickers",
        description:
          "The calendar and time columns open in a sheet. The input still takes typing.",
        demo: <DatesScene />,
      },
      {
        title: "Color picker",
        description: "Drag the area and the hue slider with a thumb.",
        demo: <ColorScene />,
      },
      {
        title: "Dialogs",
        description: "Forms slide up as sheets. Confirmations stay centered.",
        demo: <DialogsScene />,
      },
    ],
  },
  {
    title: "Sheets that move like native ones",
    description:
      "Drag, flick and stack. Every sheet follows your finger, and they all respect the safe area.",
    scenes: [
      {
        title: "Snap points",
        description:
          "The sheet opens partway. Drag it up for details, flick it down to close.",
        demo: <SnapPointsScene />,
      },
      {
        title: "Stacked sheets",
        description:
          "Open a sheet from a sheet. The one underneath scales back.",
        demo: <StackedSheetsScene />,
      },
      {
        title: "Swipe-away toasts",
        description: "Archive it, then swipe the toast down to dismiss it.",
        demo: <ToastScene />,
      },
    ],
  },
  {
    title: "Sized for thumbs",
    description:
      "Touch density gives every control a larger tap target and 16px text. Switch it above and watch the page resize.",
    scenes: [
      {
        title: "Touch density",
        description:
          "Buttons, fields, switches and sliders all resize together.",
        demo: <TouchControlsScene />,
      },
      {
        title: "The right keyboard",
        description:
          "Codes open the number pad and autofill from SMS. Email gets the @ key.",
        demo: <KeyboardsScene />,
      },
    ],
  },
]

export function ShowcasePage() {
  const [density, setDensity] = useState<Density>("touch")

  return (
    <div className="container">
      <section className="flex flex-col gap-10 pt-10 sm:pt-14 md:pt-20 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex max-w-2xl flex-col items-start">
          <Eyebrow className="mb-4 border-transparent bg-inverse/5">
            <SmartphoneIcon className="size-3.5" aria-hidden />
            Showcase
          </Eyebrow>
          <h1 className="font-features-['calt'_0,'rlig','ss11'] text-[clamp(2rem,calc((100vw-2rem)/9),3rem)] leading-[1.1] font-normal tracking-[-0.06em] text-balance antialiased sm:text-[3rem] sm:leading-14 xl:text-6xl xl:leading-16">
            Feels native on mobile.{" "}
            <span className="text-fg-muted">Out of the box.</span>
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-pretty text-fg-muted">
            Menus, selects and pickers turn into bottom sheets. Sheets snap,
            stack and swipe away. Touch density sizes every control for thumbs.
            None of it takes extra code.
          </p>
          <div className="mt-8 flex flex-col gap-2">
            <span className="text-sm text-fg-muted">Density</span>
            <SegmentedControl
              aria-label="Density"
              selectedKeys={[density]}
              onSelectionChange={(keys) => {
                const [key] = keys
                if (key) setDensity(key as Density)
              }}
            >
              {DENSITIES.map((value) => (
                <SegmentedControlItem
                  key={value}
                  id={value}
                  className="capitalize"
                >
                  {value}
                </SegmentedControlItem>
              ))}
            </SegmentedControl>
          </div>
        </div>
        <OpenOnPhone className="max-lg:hidden" />
      </section>

      <DesignSystemProvider scoped density={density} params={PARAMS}>
        {CHAPTERS.map((chapter, index) => (
          <section key={chapter.title} className="mt-20 md:mt-28">
            <div className="max-w-2xl">
              <p className="font-mono text-xs text-fg-muted tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h2 className="mt-2 text-2xl font-medium tracking-tight text-balance md:text-3xl">
                {chapter.title}
              </h2>
              <p className="mt-2 text-pretty text-fg-muted">
                {chapter.description}
              </p>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {chapter.scenes.map((scene) => (
                <Scene key={scene.title} {...scene} />
              ))}
            </div>
          </section>
        ))}
      </DesignSystemProvider>

      <div className="mt-20 md:mt-28">
        <Footer />
      </div>
    </div>
  )
}

function Scene({ title, description, demo }: SceneEntry) {
  return (
    <article className="flex flex-col rounded-3xl border bg-card p-1.5">
      <div className="px-4 pt-3.5 pb-4">
        <h3 className="font-medium">{title}</h3>
        <p className="mt-1 text-sm text-pretty text-fg-muted">{description}</p>
      </div>
      <div className="flex min-h-52 flex-1 items-center justify-center rounded-[1.25rem] bg-bg bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] bg-size-[14px_14px] px-4 py-8 md:min-h-72">
        {demo}
      </div>
    </article>
  )
}

function OpenOnPhone({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center gap-5 rounded-3xl border bg-card p-3 pr-6",
        className,
      )}
    >
      <QRCode
        value={`${siteConfig.url}/showcase`}
        aria-label="Link to this page"
        className="size-28 rounded-2xl bg-white p-2.5 text-black"
      />
      <div className="max-w-52">
        <p className="font-medium">Best on your phone</p>
        <p className="mt-1 text-sm text-pretty text-fg-muted">
          Sheets take over below 768px. Scan to try them in your hand.
        </p>
      </div>
    </div>
  )
}
