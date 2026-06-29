import { Description, Label } from '@/registry/ui/field'
import { Input } from '@/registry/ui/input'
import { SearchField } from '@/registry/ui/search-field'

export default function Demo() {
  return (
    <SearchField className="max-w-xs">
      <Label>Search</Label>
      <Input />
      <Description>Enter your search query</Description>
    </SearchField>
  )
}
