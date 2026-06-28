'use client'

import React from 'react'
import * as ColorAreaPrimitives from 'react-aria-components/ColorArea'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/registry/ui/card'
import { ColorArea } from '@/registry/ui/color-area'
import { Label } from '@/registry/ui/field'

export default function Demo() {
  const [primary, setPrimary] = React.useState(
    ColorAreaPrimitives.parseColor('hsl(217, 91%, 60%)'),
  )
  const [secondary, setSecondary] = React.useState(
    ColorAreaPrimitives.parseColor('hsl(280, 70%, 60%)'),
  )
  return (
    <div className="flex w-full flex-col gap-6 sm:flex-row">
      <div className="flex flex-1 gap-6">
        <div className="flex flex-col gap-2">
          <Label>Primary</Label>
          <ColorArea
            value={primary}
            onChange={setPrimary}
            xChannel="saturation"
            yChannel="lightness"
            aria-label="Primary color"
          />
          <span className="text-xs text-fg-muted uppercase">
            {primary.toString('hex')}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Secondary</Label>
          <ColorArea
            value={secondary}
            onChange={setSecondary}
            xChannel="saturation"
            yChannel="lightness"
            aria-label="Secondary color"
          />
          <span className="text-xs text-fg-muted uppercase">
            {secondary.toString('hex')}
          </span>
        </div>
      </div>
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>Live theme colors</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <button
            type="button"
            className="rounded-md px-3 py-2 text-sm font-medium text-white"
            style={{ backgroundColor: primary.toString('hex') }}
          >
            Primary button
          </button>
          <button
            type="button"
            className="rounded-md px-3 py-2 text-sm font-medium text-white"
            style={{ backgroundColor: secondary.toString('hex') }}
          >
            Secondary button
          </button>
        </CardContent>
      </Card>
    </div>
  )
}
