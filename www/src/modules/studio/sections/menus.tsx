"use client"

/* Menus & popovers — every floating list and the layers it opens in. */

import {
  ARROWS_OPTIONS,
  HIGHLIGHT_OPTIONS,
  INDICATOR_OPTIONS,
  INSET_OPTIONS,
  PICKER_OPTIONS,
  ROWS_OPTIONS,
  SCALE_OPTIONS,
  SEARCH_OPTIONS,
  SELECTED_ROW_OPTIONS,
} from "../axes/menus.meta"
import { roleLabel } from "../axes/shape"
import { TOOLTIP_STYLE_OPTIONS } from "../axes/tooltips.meta"
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
import type { RowMap } from "../family-page"
import type { Effective, Studio } from "../state"
import { PhoneGlyph, withPhoneGlyphs } from "./phone-glyph"

/* -------------------------------- Specimens -------------------------------- */

function ListFrame() {
  return (
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
  )
}

/** Three item lines; the dot is the check, the lines shift for the gutter. */
function CheckGlyph({ indicator }: { indicator: string }) {
  const start = indicator === "check-start"
  const end = indicator === "check-end"
  const rows = [9, 12.5, 16]
  const x = start ? 10 : 7
  // The trailing check shortens the first line to make room for the dot.
  const width = (i: number) => (i === 0 && end ? 14 : 17) - x
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <ListFrame />
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
      {(start || end) && (
        <circle
          cx={start ? 7.5 : 16.5}
          cy={rows[0]}
          r="1.5"
          fill="currentColor"
        />
      )}
    </svg>
  )
}

/** The selected row at rest: washed, or only its line. */
function SelectedRowGlyph({ selected }: { selected: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <ListFrame />
      {selected === "tint" && (
        <rect
          x="6"
          y="10"
          width="12"
          height="4.5"
          rx="1.5"
          fill="currentColor"
          opacity=".3"
        />
      )}
      <path
        d="M7 7.5h10M7 12.25h10M7 17h10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity=".45"
      />
    </svg>
  )
}

/** A control beside a list row: shorter, as tall, or a step taller. */
function RowsGlyph({ rows }: { rows: string }) {
  const h = rows === "auto" ? 3.5 : rows === "match" ? 5 : 6.5
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="2.75"
        y="9.5"
        width="6"
        height="5"
        rx="1.25"
        stroke="currentColor"
        strokeWidth="1.25"
        opacity=".45"
      />
      <rect
        x="11"
        y="4"
        width="10.5"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity=".45"
      />
      <rect
        x="13"
        y={12 - h / 2}
        width="6.5"
        height={h}
        rx="1.25"
        fill="currentColor"
        opacity=".9"
      />
    </svg>
  )
}

/** One highlighted row inside the list frame. */
function HighlightGlyph({ highlight }: { highlight: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <ListFrame />
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
      <ListFrame />
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

/** A palette: the search chrome over the highlighted row and one more. */
function PaletteGlyph({ search }: { search: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity=".45"
      />
      {search === "field" ? (
        <rect
          x="6.5"
          y="6.5"
          width="11"
          height="4"
          rx="1"
          stroke="currentColor"
          strokeWidth="1.25"
        />
      ) : (
        <path
          d="M7 8.5h5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      )}
      {search === "bar" && (
        <path d="M4.75 11.5h14.5" stroke="currentColor" strokeWidth="1.25" />
      )}
      <rect
        x="6.5"
        y="13"
        width="11"
        height="2.5"
        rx="1"
        fill="currentColor"
        opacity=".9"
      />
      <path
        d="M7 17.5h10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity=".45"
      />
    </svg>
  )
}

/** The panel over the trigger it's anchored to, with or without the tip. */
function PopoverGlyph({ tip }: { tip: boolean }) {
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

/** The chip, with or without its caret, over the thing it names. */
function TooltipGlyph({ filled, tip }: { filled: boolean; tip: boolean }) {
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
      {tip && (
        <path
          d="M10.3 12.5 12 15l1.7-2.5Z"
          fill="currentColor"
          stroke={filled ? "none" : "currentColor"}
          strokeWidth={filled ? 0 : 1.5}
          strokeLinejoin="round"
        />
      )}
      <circle cx="12" cy="19" r="1.5" fill="currentColor" opacity=".45" />
    </svg>
  )
}

/** A tooltip chip beside a popover panel, each with its tip or without. */
function ArrowsGlyph({ arrows }: { arrows: string }) {
  const tooltip = arrows === "tooltips" || arrows === "both"
  const popover = arrows === "popovers" || arrows === "both"
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="2.5" y="4" width="8" height="5" rx="1.5" fill="currentColor" />
      {tooltip && <path d="M5.2 9 6.5 11l1.3-2Z" fill="currentColor" />}
      <rect
        x="12.75"
        y="9.75"
        width="8.5"
        height="9.5"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {popover && <path d="M15.7 9 17 7l1.3 2Z" fill="currentColor" />}
    </svg>
  )
}

const glyphs = <T extends { value: string }>(
  options: T[],
  draw: (value: string) => React.ReactNode,
) =>
  options.map((option) => ({
    ...option,
    preview: <DialGlyph>{draw(option.value)}</DialGlyph>,
  }))

const PICKERS = withPhoneGlyphs(PICKER_OPTIONS)

/* --------------------------------- Section --------------------------------- */

export function MenusPreview({ state }: { state: Effective }) {
  return (
    <DialGlyph>
      <HighlightGlyph highlight={state.menuHighlight} />
    </DialGlyph>
  )
}

export function MenusSection({ studio }: { studio: Studio }) {
  const { effective } = studio
  const arrows = effective.menuArrows
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
            <CheckGlyph indicator={effective.menuIndicator} />
          </DialGlyph>
        </HeroMember>
        <HeroMember name="Popover">
          <DialGlyph>
            <PopoverGlyph tip={arrows === "popovers" || arrows === "both"} />
          </DialGlyph>
        </HeroMember>
        <HeroMember name="Tooltip">
          <DialGlyph>
            <TooltipGlyph
              filled={effective.tooltipStyle === "inverted"}
              tip={arrows === "tooltips" || arrows === "both"}
            />
          </DialGlyph>
        </HeroMember>
        <HeroMember name="Command">
          <DialGlyph>
            <PaletteGlyph search={effective.menuSearch} />
          </DialGlyph>
        </HeroMember>
        <HeroMember name="Pickers on mobile">
          <DialGlyph>
            <PhoneGlyph
              layer={
                effective.mobilePickers === "anchored" ? "anchored" : "drawer"
              }
            />
          </DialGlyph>
        </HeroMember>
      </FamilyHero>
      <DialList
        axis="menuHighlight"
        label="Highlight"
        options={glyphs(HIGHLIGHT_OPTIONS, (value) => (
          <HighlightGlyph highlight={value} />
        ))}
      />
      <DialGap />
      <DialSelect
        axis="menuInset"
        label="Items"
        options={glyphs(INSET_OPTIONS, (value) => (
          <InsetGlyph inset={value} />
        ))}
      />
      <DialSelect
        axis="menuArrows"
        label="Arrows"
        options={glyphs(ARROWS_OPTIONS, (value) => (
          <ArrowsGlyph arrows={value} />
        ))}
      />
      <UsesRow axis="surfaceGlass" label="Glass" />
      <UsesRow
        axis="roleItem"
        label="Item corners"
        value={roleLabel(effective, "roleItem")}
      />
      <UsesRow axis="motion" label="Motion" />
      <More
        keys={["menuIndicator", "menuSelectedRow", "menuRows", "mobilePickers"]}
      >
        <DialSelect
          axis="menuIndicator"
          label="Check"
          options={glyphs(INDICATOR_OPTIONS, (value) => (
            <CheckGlyph indicator={value} />
          ))}
        />
        <DialSelect
          axis="menuSelectedRow"
          label="Selected row"
          options={glyphs(SELECTED_ROW_OPTIONS, (value) => (
            <SelectedRowGlyph selected={value} />
          ))}
        />
        <DialSelect
          axis="menuRows"
          label="Row height"
          options={glyphs(ROWS_OPTIONS, (value) => (
            <RowsGlyph rows={value} />
          ))}
        />
        <DialSelect axis="mobilePickers" label="On mobile" options={PICKERS} />
      </More>
      <MemberSection id="tooltip" title="Tooltip">
        <DialSelect
          axis="tooltipStyle"
          label="Style"
          options={glyphs(TOOLTIP_STYLE_OPTIONS, (value) => (
            <TooltipGlyph
              filled={value === "inverted"}
              tip={arrows === "tooltips" || arrows === "both"}
            />
          ))}
        />
      </MemberSection>
      <MemberSection id="command" title="Command">
        <More keys={["menuSearch", "menuScale"]}>
          <DialSelect
            axis="menuSearch"
            label="Search"
            options={glyphs(SEARCH_OPTIONS, (value) => (
              <PaletteGlyph search={value} />
            ))}
          />
          <DialSegmented
            axis="menuScale"
            label="Palette scale"
            options={SCALE_OPTIONS}
          />
        </More>
      </MemberSection>
    </>
  )
}

export const ROWS: RowMap = {}
