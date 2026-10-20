"use client"

import { FileTextIcon, FolderIcon, HomeIcon } from "@/registry/icons"
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@/registry/ui/breadcrumbs"
import { useStyles as useBreadcrumbsStyles } from "@/registry/ui/breadcrumbs/styles"

import { Board, BoardSection, StateRow } from "./board"
import { BreadcrumbTrail } from "./nav-parts"

// Specimen links point nowhere: keep the board where it is.
const stay = (event: React.MouseEvent) => event.preventDefault()

const TRAIL = ["Acme", "Projects", "Website redesign", "Settings"]

export default function BreadcrumbsBoard() {
  const { link } = useBreadcrumbsStyles()()
  return (
    <Board id="breadcrumbs">
      <BoardSection title="Variants">
        <div onClickCapture={stay} className="flex flex-col items-start gap-5">
          <Breadcrumbs>
            {TRAIL.map((label, i) => (
              // Phones drop the root, so the trail stays on one line.
              <BreadcrumbItem
                key={label}
                className={i === 0 ? "max-sm:hidden" : undefined}
              >
                {i < TRAIL.length - 1 ? (
                  <>
                    <BreadcrumbLink href="#">{label}</BreadcrumbLink>
                    <BreadcrumbSeparator />
                  </>
                ) : (
                  <BreadcrumbLink>{label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            ))}
          </Breadcrumbs>
          <Breadcrumbs>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">
                <HomeIcon className="size-4" />
                My Drive
              </BreadcrumbLink>
              <BreadcrumbSeparator />
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">
                <FolderIcon className="size-4" />
                Design
              </BreadcrumbLink>
              <BreadcrumbSeparator />
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink>
                <FileTextIcon className="size-4" />
                Logo.svg
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumbs>
        </div>
      </BoardSection>
      <BoardSection title="States">
        <StateRow states={["rest", "hover"]}>
          {(props) => (
            // Apart enough that the two trails don't read as one.
            <BreadcrumbTrail className="px-4">
              <a {...props} className={link()}>
                Projects
              </a>
            </BreadcrumbTrail>
          )}
        </StateRow>
      </BoardSection>
    </Board>
  )
}
