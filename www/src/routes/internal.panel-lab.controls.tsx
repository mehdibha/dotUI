import { createFileRoute } from '@tanstack/react-router'

import { ControlLab } from '@/modules/control-lab/page'

export const Route = createFileRoute('/internal/panel-lab/controls')({
  component: ControlLab,
  head: () => ({ meta: [{ title: 'Control Lab · dotUI' }] }),
})
