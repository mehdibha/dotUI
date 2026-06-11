import { CircleDashedIcon } from '@/registry/__generated__/icons'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/registry/ui/empty'
import { Input, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import { Kbd } from '@/registry/ui/kbd'
import { TextField } from '@/registry/ui/text-field'

export default function Demo() {
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyTitle>404 - Not Found</EmptyTitle>
        <EmptyDescription>
          The page you're looking for doesn't exist. Try searching for what you
          need below.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <TextField aria-label="Search pages" className="w-3/4">
          <InputGroup>
            <InputGroupAddon>
              <CircleDashedIcon />
            </InputGroupAddon>
            <Input placeholder="Try searching for pages..." />
            <InputGroupAddon>
              <Kbd>/</Kbd>
            </InputGroupAddon>
          </InputGroup>
        </TextField>
        <EmptyDescription>
          Need help? <a href="#">Contact support</a>
        </EmptyDescription>
      </EmptyContent>
    </Empty>
  )
}
