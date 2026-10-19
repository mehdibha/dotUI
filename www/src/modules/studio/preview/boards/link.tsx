"use client"

import {
  ArrowRightIcon,
  BookOpenIcon,
  ExternalLinkIcon,
} from "@/registry/icons"
import { BreadcrumbLink } from "@/registry/ui/breadcrumbs"
import { useStyles as useBreadcrumbsStyles } from "@/registry/ui/breadcrumbs/styles"
import { useStyles as useButtonStyles } from "@/registry/ui/button/styles"
import { Link } from "@/registry/ui/link"
import { useStyles as useLinkStyles } from "@/registry/ui/link/styles"

import {
  Board,
  BoardSection,
  Specimen,
  stateProps,
  StateRow,
  useReplay,
  useSteps,
} from "./board"
import { BreadcrumbTrail } from "./nav-parts"

// Specimen links point nowhere: keep the board where it is.
const stay = (event: React.MouseEvent) => event.preventDefault()

/** Live at rest; hovers on a loop while Motion is edited, timing breadcrumb ancestors too. */
function Replay() {
  const link = useLinkStyles()
  const { link: crumb } = useBreadcrumbsStyles()()
  const motion = useReplay("linkMotion")
  const hovered = useSteps(motion, 1100) % 2 === 1
  const state = stateProps(...(hovered ? (["hover"] as const) : []))
  return (
    <div
      inert={motion.running}
      onClickCapture={stay}
      className="flex flex-wrap items-end justify-center gap-x-12 gap-y-6"
    >
      {/* Spaced like the States row beside it. */}
      <Specimen label="Link" className="gap-2">
        {motion.running ? (
          <span {...state} className={link({ className: "h-5 text-sm" })}>
            View invoice
          </span>
        ) : (
          <Link href="#" className="h-5 text-sm">
            View invoice
          </Link>
        )}
      </Specimen>
      <Specimen label="Breadcrumbs" className="gap-2">
        <BreadcrumbTrail className="h-5">
          {motion.running ? (
            <a {...state} className={crumb()}>
              Projects
            </a>
          ) : (
            <BreadcrumbLink href="#">Projects</BreadcrumbLink>
          )}
        </BreadcrumbTrail>
      </Specimen>
    </div>
  )
}

export default function LinkBoard() {
  const link = useLinkStyles()
  const button = useButtonStyles()
  return (
    <Board id="link">
      <BoardSection title="In context" className="flex-col gap-6">
        <div onClickCapture={stay} className="contents">
          <p className="max-w-md text-center text-sm/relaxed text-balance text-fg-muted">
            Your trial ends in 5 days. <Link href="#">Upgrade your plan</Link>{" "}
            to keep unlimited projects, or <Link href="#">compare plans</Link>{" "}
            first.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 text-sm max-sm:flex-col">
            <Link href="#">
              <BookOpenIcon className="size-4" />
              Read the docs
            </Link>
            <Link href="#">
              View changelog
              <ArrowRightIcon className="size-4" />
            </Link>
            <Link href="#">
              Status page
              <ExternalLinkIcon className="size-3.5" />
            </Link>
          </div>
        </div>
      </BoardSection>
      <div className="grid min-w-0 gap-8 md:grid-cols-2">
        <BoardSection title="States" className="flex-1 flex-col gap-6">
          <StateRow states={["rest", "hover", "focus"]}>
            {(props) => (
              <span {...props} className={link({ className: "h-5 text-sm" })}>
                View invoice
              </span>
            )}
          </StateRow>
          {/* Button's link variant takes the same underline and color. */}
          <StateRow states={["rest", "hover", "focus"]}>
            {(props) => (
              <span
                {...props}
                data-button=""
                className={button({ variant: "link", size: "sm" })}
              >
                Learn more
              </span>
            )}
          </StateRow>
        </BoardSection>
        <BoardSection title="Motion" className="flex-1">
          <Replay />
        </BoardSection>
      </div>
    </Board>
  )
}
