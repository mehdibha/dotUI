"use client"

/* Alert — the inline notice (axes/alert.ts). The hero is the registry Alert
   as the preview renders it; there are no controls yet. */

import { InfoIcon } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/registry/ui/alert"

import { Hero } from "../hero"
import { ControlGroup } from "../rows"
import type { Studio, StudioState } from "../state"

export function AlertHero(_props: { state: StudioState }) {
  return (
    <Hero>
      <Alert variant="info">
        <InfoIcon />
        <AlertTitle>Update available</AlertTitle>
        <AlertDescription>Restart the app to apply it.</AlertDescription>
      </Alert>
    </Hero>
  )
}

export function alertSummary(_state: StudioState): string {
  return "Default"
}

export function AlertSection({ studio }: { studio: Studio }) {
  return (
    <ControlGroup>
      <AlertHero state={studio.state} />
    </ControlGroup>
  )
}
