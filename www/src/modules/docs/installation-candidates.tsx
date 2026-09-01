import { Children, isValidElement } from "react"

import { useTweak } from "@/dev/tweaker"

// Throwaway exploration scaffolding: three from-scratch installation page
// drafts behind one tweaker select. The pick gets baked into installation.mdx
// and this file deleted before merge.
export function InstallationCandidates({
  children,
}: {
  children: React.ReactNode
}) {
  const pick = useTweak("Candidate", {
    type: "select",
    options: ["A", "B", "C"],
    default: "A",
    group: "Installation page",
  })
  return Children.toArray(children).find(
    (child) =>
      isValidElement(child) && (child.props as { name?: string }).name === pick,
  )
}

export function InstallationCandidate(props: {
  name: string
  children: React.ReactNode
}) {
  return props.children
}
