'use client'

import { Label } from '@/registry/ui/field'
import { Input } from '@/registry/ui/input'
import { SearchField } from '@/registry/ui/search-field'

export default function Demo({
  label = 'Search',
  placeholder = 'Search...',
  isDisabled = false,
  isReadOnly = false,
} = {}) {
  return (
    <SearchField isDisabled={isDisabled} isReadOnly={isReadOnly}>
      {label && <Label>{label}</Label>}
      <Input data-control-target placeholder={placeholder} />
    </SearchField>
  )
}
