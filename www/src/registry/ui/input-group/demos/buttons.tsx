import { CopyIcon, TrashIcon } from 'lucide-react'

import { Button } from '@/registry/ui/button'
import { Input, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import { TextField } from '@/registry/ui/text-field'

const variants = [
  'default',
  'primary',
  'quiet',
  'link',
  'warning',
  'danger',
] as const

export default function Demo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-6">
      {variants.map((variant) => (
        <TextField key={variant} aria-label={variant}>
          <InputGroup>
            <InputGroupAddon>
              <Button variant={variant}>{variant}</Button>
            </InputGroupAddon>
            <Input />
          </InputGroup>
        </TextField>
      ))}
      <TextField aria-label="With button">
        <InputGroup>
          <Input />
          <InputGroupAddon>
            <Button>Button</Button>
          </InputGroupAddon>
        </InputGroup>
      </TextField>
      <TextField aria-label="With copy button">
        <InputGroup>
          <Input />
          <InputGroupAddon>
            <Button isIconOnly>
              <CopyIcon />
            </Button>
          </InputGroupAddon>
        </InputGroup>
      </TextField>
      <TextField aria-label="With delete button">
        <InputGroup>
          <Input />
          <InputGroupAddon>
            <Button isIconOnly>
              <TrashIcon />
            </Button>
          </InputGroupAddon>
        </InputGroup>
      </TextField>
    </div>
  )
}
