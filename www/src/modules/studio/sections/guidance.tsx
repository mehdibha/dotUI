"use client"

/* Guidance — how an agent should build with the system: copy, hierarchy,
   patterns. Nothing in the preview changes; the choices become rules in the
   agent docs the export installs, which the last row opens. */

import { GUIDANCE_AXES } from "../axes/guidance"
import type { GuidanceKey } from "../axes/guidance"
import { DialGap, DialSegmented, DialSelect, DialTrigger } from "../dial"
import { AgentDocsModal } from "../export/agent-docs-modal"
import type { Studio } from "../state"

function GuideRow({
  label,
  axis,
  studio,
}: {
  label: string
  axis: GuidanceKey
  studio: Studio
}) {
  const { options } = GUIDANCE_AXES[axis]
  const Row = options.length === 2 ? DialSegmented : DialSelect
  return (
    <Row
      label={label}
      value={studio.state[axis]}
      onChange={studio.set(axis)}
      options={options}
    />
  )
}

export function GuidanceSection({ studio }: { studio: Studio }) {
  return (
    <>
      <GuideRow label="Casing" axis="guideCasing" studio={studio} />
      <GuideRow label="Voice" axis="guideVoice" studio={studio} />
      <GuideRow label="Copy" axis="guideCopy" studio={studio} />
      <GuideRow label="Emoji" axis="guideEmoji" studio={studio} />
      <DialGap />
      <GuideRow label="Primary actions" axis="guideActions" studio={studio} />
      <GuideRow label="Color use" axis="guideColor" studio={studio} />
      <GuideRow label="Eyebrows" axis="guideEyebrows" studio={studio} />
      <DialGap />
      <GuideRow label="Forms" axis="guideForms" studio={studio} />
      <GuideRow label="Choices" axis="guideChoices" studio={studio} />
      <GuideRow label="Collections" axis="guideData" studio={studio} />
      <GuideRow label="Icons" axis="guideIcons" studio={studio} />
      <DialGap />
      <DialTrigger label="Agent docs" value="DESIGN.md + skill">
        <AgentDocsModal state={studio.state} />
      </DialTrigger>
    </>
  )
}
