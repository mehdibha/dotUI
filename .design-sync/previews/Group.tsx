import {
  FlipHorizontalIcon,
  FlipVerticalIcon,
  MinusIcon,
  PlusIcon,
  RotateCwIcon,
} from 'lucide-react'
import {
  Button,
  Group,
  Input,
  InputGroup,
  InputGroupAddon,
} from 'www'

export const Horizontal = () => (
  <Group>
    <Button>Day</Button>
    <Button>Week</Button>
    <Button>Month</Button>
  </Group>
)

export const IconButtons = () => (
  <Group>
    <Button isIconOnly aria-label="Flip horizontal">
      <FlipHorizontalIcon />
    </Button>
    <Button isIconOnly aria-label="Flip vertical">
      <FlipVerticalIcon />
    </Button>
    <Button isIconOnly aria-label="Rotate">
      <RotateCwIcon />
    </Button>
  </Group>
)

export const WithInput = () => (
  <Group>
    <InputGroup>
      <InputGroupAddon>W</InputGroupAddon>
      <Input aria-label="Width" defaultValue="320" style={{ width: 96 }} />
      <InputGroupAddon>px</InputGroupAddon>
    </InputGroup>
    <Button isIconOnly aria-label="Decrease">
      <MinusIcon />
    </Button>
    <Button isIconOnly aria-label="Increase">
      <PlusIcon />
    </Button>
  </Group>
)
