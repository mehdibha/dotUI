'use client'

import { Separator, type SeparatorProps } from '@/registry/ui/separator'

export default function Demo({
  orientation = 'horizontal',
}: SeparatorProps = {}) {
  return <Separator orientation={orientation}></Separator>
}
