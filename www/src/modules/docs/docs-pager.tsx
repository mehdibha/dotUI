import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

import { Button, LinkButton } from '@/registry/ui/button'
import { Group } from '@/registry/ui/group'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'

type Neighbour = { name: string; path: string }

type Neighbours = {
  previous?: Neighbour
  next?: Neighbour
}

export function DocsPager({ neighbours }: { neighbours: Neighbours }) {
  const { previous, next } = neighbours

  // When there is no neighbour we render a plain disabled Button rather than a hrefless
  // LinkButton. A LinkButton without an href renders a non-pressable <span>, and wrapping that
  // in a Tooltip triggers react-aria's "PressResponder without a pressable child" warning (and a
  // disabled control has no page name to show in a tooltip anyway).
  const renderNeighbour = (
    neighbour: Neighbour | undefined,
    icon: React.ReactNode,
    label: string,
  ) =>
    neighbour ? (
      <Tooltip>
        <LinkButton
          aria-label={label}
          size="sm"
          isIconOnly
          href={{ to: '/docs/$', params: { _splat: neighbour.path } }}
        >
          {icon}
        </LinkButton>
        <TooltipContent>{neighbour.name}</TooltipContent>
      </Tooltip>
    ) : (
      <Button aria-label={label} size="sm" isIconOnly isDisabled>
        {icon}
      </Button>
    )

  return (
    <Group>
      {renderNeighbour(previous, <ChevronLeftIcon />, 'Go to previous page')}
      {renderNeighbour(next, <ChevronRightIcon />, 'Go to next page')}
    </Group>
  )
}
