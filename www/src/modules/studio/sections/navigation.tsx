"use client"

/* Navigation — tabs, links, breadcrumbs; their colors are Primary leaves. */

import { cn } from "@/registry/lib/utils"

import { SEPARATOR_OPTIONS, TONE_OPTIONS } from "../axes/breadcrumbs"
import { UNDERLINE_OPTIONS } from "../axes/links"
import { TAB_STYLE_OPTIONS } from "../axes/tabs"
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

/* -------------------------------- Specimens -------------------------------- */

function LinkGlyph({ underline }: { underline: string }) {
  return (
    <span
      className={cn(
        "shrink-0 text-[11px] font-medium text-fg/80 underline-offset-2",
        underline === "always" && "underline",
        underline === "hover" && "underline decoration-fg/30",
      )}
    >
      Link
    </span>
  )
}

function TabGlyph({ style }: { style: string }) {
  if (style === "segmented")
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect
          x="3"
          y="7.5"
          width="18"
          height="9"
          rx="3"
          fill="currentColor"
          opacity=".2"
        />
        <rect
          x="4.5"
          y="9"
          width="7.5"
          height="6"
          rx="2"
          fill="currentColor"
          opacity=".7"
        />
      </svg>
    )
  if (style === "line")
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect
          x="7.5"
          y="8.5"
          width="9"
          height="2.5"
          rx="1.25"
          fill="currentColor"
          opacity=".5"
        />
        <path
          d="M3 16h18"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity=".3"
        />
        <path
          d="M6.5 16h11"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    )
  if (style === "pill")
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect
          x="4.5"
          y="7.5"
          width="15"
          height="9"
          rx="4.5"
          fill="currentColor"
          opacity=".25"
        />
        <rect
          x="8"
          y="10.75"
          width="8"
          height="2.5"
          rx="1.25"
          fill="currentColor"
          opacity=".7"
        />
      </svg>
    )
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 16.5h3.5v-5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v5H21"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="9.5"
        y="11.5"
        width="5"
        height="2.5"
        rx="1.25"
        fill="currentColor"
        opacity=".5"
      />
    </svg>
  )
}

function SeparatorGlyph({ separator }: { separator: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M2.5 12h4M17.5 12h4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity=".35"
      />
      {separator === "slash" ? (
        <path
          d="M13.75 6.5 10.25 17.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="m10.5 7.5 4.5 4.5-4.5 4.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  )
}

/** A page with its sidebar: a member with no rows of its own yet. */
function SidebarGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3.75"
        y="4.75"
        width="16.5"
        height="14.5"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M9.5 5v14" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M6 8.5h1.5M6 11.5h1.5M6 14.5h1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity=".45"
      />
    </svg>
  )
}

/* --------------------------------- Section --------------------------------- */

export function NavigationPreview({ state }: { state: Effective }) {
  return (
    <DialGlyph>
      <TabGlyph style={state.tabStyle} />
    </DialGlyph>
  )
}

export function NavigationSection({ studio }: { studio: Studio }) {
  const { effective } = studio
  return (
    <>
      <FamilyHero>
        <HeroMember name="Tabs">
          <DialGlyph>
            <TabGlyph style={effective.tabStyle} />
          </DialGlyph>
        </HeroMember>
        <HeroMember name="Link">
          <LinkGlyph underline={effective.linkUnderline} />
        </HeroMember>
        <HeroMember name="Breadcrumbs">
          <DialGlyph>
            <SeparatorGlyph separator={effective.breadcrumbSeparator} />
          </DialGlyph>
        </HeroMember>
        <HeroMember name="Sidebar">
          <DialGlyph>
            <SidebarGlyph />
          </DialGlyph>
        </HeroMember>
      </FamilyHero>
      <DialList
        axis="tabStyle"
        label="Tabs"
        options={TAB_STYLE_OPTIONS.map((option) => ({
          ...option,
          preview: (
            <DialGlyph>
              <TabGlyph style={option.value} />
            </DialGlyph>
          ),
        }))}
      />
      <DialGap />
      <UsesRow axis="tabsColor" label="Indicator color" />
      <UsesRow axis="linkColor" label="Link color" />
      <MemberSection id="link" title="Links">
        <DialSelect
          axis="linkUnderline"
          label="Underline"
          options={UNDERLINE_OPTIONS.map((option) => ({
            ...option,
            preview: <LinkGlyph underline={option.value} />,
          }))}
        />
      </MemberSection>
      <MemberSection id="breadcrumbs" title="Breadcrumbs">
        <More keys={["breadcrumbSeparator", "breadcrumbTone"]}>
          <DialSegmented
            axis="breadcrumbSeparator"
            label="Separator"
            options={SEPARATOR_OPTIONS}
          />
          <DialSegmented
            axis="breadcrumbTone"
            label="Ancestors"
            options={TONE_OPTIONS}
          />
        </More>
      </MemberSection>
    </>
  )
}
