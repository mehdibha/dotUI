"use client"

/* Menus & popovers — one language for every floating list (Menu, Select and
   ComboBox listboxes, the command palette) and the anchored layers they open
   in: the popover's arrow, the tooltip's own surface, and how pickers present
   on a phone. */

import {
  HIGHLIGHT_OPTIONS,
  INDICATOR_OPTIONS,
  INSET_OPTIONS,
  SCALE_OPTIONS,
  SEARCH_OPTIONS,
} from "../axes/menus"
import { PICKER_OPTIONS } from "../axes/mobile"
import { HEADER_OPTIONS, TIP_OPTIONS } from "../axes/popovers"
import { TOOLTIP_STYLE_OPTIONS } from "../axes/tooltips"
import {
  DialGap,
  DialGlyph,
  DialList,
  DialSegmented,
  DialSelect,
} from "../dial"
import {
  FamilyHero,
  HeroMember,
  MemberSection,
  More,
  UsesRow,
} from "../family-page"
import type { Effective, Studio } from "../state"
import { PhoneGlyph, withPhoneGlyphs } from "./phone-glyph"

/* -------------------------------- Specimens -------------------------------- */

/** Three item lines; the dot is the check, the lines shift for the gutter. */
function IndicatorGlyph({ indicator }: { indicator: string }) {
  const start = indicator === "check-start"
  const rows = [9, 12.5, 16]
  const x = start ? 10 : 7
  // The trailing check shortens the first line to make room for the dot.
  const width = (i: number) => (i === 0 && !start ? 14 : 17) - x
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="4"
        y="5"
        width="16"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity=".45"
      />
      {rows.map((y, i) => (
        <path
          key={y}
          d={`M${x} ${y}h${width(i)}`}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity={i === 0 ? 1 : 0.45}
        />
      ))}
      <circle
        cx={start ? 7.5 : 16.5}
        cy={rows[0]}
        r="1.5"
        fill="currentColor"
      />
    </svg>
  )
}

/** One highlighted row inside the list frame. */
function HighlightGlyph({ highlight }: { highlight: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="4"
        y="5"
        width="16"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity=".45"
      />
      <rect
        x="6"
        y="10"
        width="12"
        height="4.5"
        rx="1.5"
        fill="currentColor"
        opacity={highlight === "accent" ? 0.9 : 0.3}
      />
      <path
        d="M7 7h10M7 17.5h10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity=".45"
      />
    </svg>
  )
}

/** Item rows floating in a gutter, or running edge to edge. */
function InsetGlyph({ inset }: { inset: string }) {
  const x = inset === "inset" ? 6.5 : 4
  const w = inset === "inset" ? 11 : 16
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="4"
        y="5"
        width="16"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity=".45"
      />
      {[7, 10.75, 14.5].map((y) => (
        <rect
          key={y}
          x={x}
          y={y}
          width={w}
          height="2.5"
          rx={inset === "inset" ? 1 : 0}
          fill="currentColor"
          opacity={y === 10.75 ? 0.9 : 0.35}
        />
      ))}
    </svg>
  )
}

/** A palette: the search chrome over two rows. */
function PaletteGlyph({ search }: { search: string }) {
  return (
    <span className="flex w-9 shrink-0 flex-col overflow-hidden rounded-[4px] border border-fg/20 bg-bg">
      {search === "field" && (
        <span className="mx-1 mt-1 h-2 rounded-[2px] border border-fg/25" />
      )}
      {search === "bar" && <span className="h-2.5 border-b border-fg/20" />}
      {search === "prompt" && <span className="h-2.5" />}
      <span className="flex flex-col gap-0.5 p-1">
        <span className="h-1.5 rounded-[2px] bg-fg/15" />
        <span className="h-1.5 rounded-[2px]" />
      </span>
    </span>
  )
}

/** The panel over the trigger it's anchored to, with or without the tip. */
function TipGlyph({ tip }: { tip: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="4"
        y="4"
        width="16"
        height="11"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M7 8h10M7 11h6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity=".45"
      />
      {tip && <path d="M10.3 14.7 12 17.2l1.7-2.5Z" fill="currentColor" />}
      <path
        d="M9 20.5h6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity=".45"
      />
    </svg>
  )
}

/** The chip with its caret, over the thing it names. */
function TooltipGlyph({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="5"
        y="5.5"
        width="14"
        height="7"
        rx="2"
        fill={filled ? "currentColor" : "none"}
        stroke={filled ? "none" : "currentColor"}
        strokeWidth="1.5"
      />
      <path
        d="M10.3 12.5 12 15l1.7-2.5Z"
        fill="currentColor"
        stroke={filled ? "none" : "currentColor"}
        strokeWidth={filled ? 0 : 1.5}
        strokeLinejoin="round"
      />
      <circle cx="12" cy="19" r="1.5" fill="currentColor" opacity=".45" />
    </svg>
  )
}

/* --------------------------------- Section --------------------------------- */

const PICKERS = withPhoneGlyphs(PICKER_OPTIONS)

export function MenusPreview({ state }: { state: Effective }) {
  return (
    <DialGlyph>
      <HighlightGlyph highlight={state.menuHighlight} />
    </DialGlyph>
  )
}

export function MenusSection({ studio }: { studio: Studio }) {
  const { effective } = studio
  return (
    <>
      <FamilyHero>
        <HeroMember name="Menu">
          <DialGlyph>
            <HighlightGlyph highlight={effective.menuHighlight} />
          </DialGlyph>
        </HeroMember>
        <HeroMember name="List box">
          <DialGlyph>
            <InsetGlyph inset={effective.menuInset} />
          </DialGlyph>
        </HeroMember>
        <HeroMember name="Popover">
          <DialGlyph>
            <TipGlyph tip={effective.popoverTip === "tip"} />
          </DialGlyph>
        </HeroMember>
        <HeroMember name="Tooltip">
          <DialGlyph>
            <TooltipGlyph filled={effective.tooltipStyle === "inverted"} />
          </DialGlyph>
        </HeroMember>
        <HeroMember name="Command">
          <PaletteGlyph search={effective.menuSearch} />
        </HeroMember>
        <HeroMember name="Pickers on mobile">
          <DialGlyph>
            <PhoneGlyph
              layer={
                effective.mobilePickers === "popover" ? "popover" : "drawer"
              }
            />
          </DialGlyph>
        </HeroMember>
      </FamilyHero>
      <DialList
        axis="menuHighlight"
        label="Highlight"
        options={HIGHLIGHT_OPTIONS.map((option) => ({
          ...option,
          preview: (
            <DialGlyph>
              <HighlightGlyph highlight={option.value} />
            </DialGlyph>
          ),
        }))}
      />
      <DialGap />
      <DialSelect
        axis="menuInset"
        label="Items"
        options={INSET_OPTIONS.map((option) => ({
          ...option,
          preview: (
            <DialGlyph>
              <InsetGlyph inset={option.value} />
            </DialGlyph>
          ),
        }))}
      />
      <DialSelect
        axis="popoverTip"
        label="Arrows"
        options={TIP_OPTIONS.map((option) => ({
          ...option,
          preview: (
            <DialGlyph>
              <TipGlyph tip={option.value === "tip"} />
            </DialGlyph>
          ),
        }))}
      />
      <UsesRow axis="surfaceGlass" label="Glass" />
      <UsesRow axis="roleItem" label="Item corners" />
      <More keys={["menuIndicator", "popoverHeader"]}>
        <DialSelect
          axis="menuIndicator"
          label="Check"
          options={INDICATOR_OPTIONS.map((option) => ({
            ...option,
            preview: (
              <DialGlyph>
                <IndicatorGlyph indicator={option.value} />
              </DialGlyph>
            ),
          }))}
        />
        <DialSegmented
          axis="popoverHeader"
          label="Header"
          options={HEADER_OPTIONS}
        />
      </More>
      <MemberSection id="tooltip" title="Tooltip">
        <DialSelect
          axis="tooltipStyle"
          label="Style"
          options={TOOLTIP_STYLE_OPTIONS.map((option) => ({
            ...option,
            preview: (
              <DialGlyph>
                <TooltipGlyph filled={option.value === "inverted"} />
              </DialGlyph>
            ),
          }))}
        />
      </MemberSection>
      <MemberSection id="command" title="Command">
        <More keys={["menuSearch", "menuScale"]}>
          <DialSelect
            axis="menuSearch"
            label="Search"
            options={SEARCH_OPTIONS.map((option) => ({
              ...option,
              preview: <PaletteGlyph search={option.value} />,
            }))}
          />
          <DialSegmented
            axis="menuScale"
            label="Palette scale"
            options={SCALE_OPTIONS}
          />
        </More>
      </MemberSection>
      <MemberSection id="mobile" title="On mobile">
        <More keys={["mobilePickers"]}>
          <DialSelect axis="mobilePickers" label="Pickers" options={PICKERS} />
        </More>
      </MemberSection>
    </>
  )
}
