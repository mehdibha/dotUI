import { createFileRoute } from '@tanstack/react-router'

import { PresetsPage } from '@/modules/presets/presets-page'

export const Route = createFileRoute('/_app/presets')({
  component: PresetsPage,
})
