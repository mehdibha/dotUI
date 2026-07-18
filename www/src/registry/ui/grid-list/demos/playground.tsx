'use client'

import { GridList, GridListItem } from '@/registry/ui/grid-list'
import type { GridListProps } from '@/registry/ui/grid-list'

export default function Demo({
  selectionMode = 'multiple',
  layout = 'stack',
}: {
  selectionMode?: GridListProps<object>['selectionMode']
  layout?: GridListProps<object>['layout']
} = {}) {
  return (
    <GridList
      aria-label="Toppings"
      selectionMode={selectionMode}
      layout={layout}
      defaultSelectedKeys={['mushroom']}
      className="w-72 rounded-md border bg-card shadow-sm"
    >
      <GridListItem id="mushroom">Mushroom</GridListItem>
      <GridListItem id="olives">Olives</GridListItem>
      <GridListItem id="onion">Onion</GridListItem>
      <GridListItem id="pepperoni">Pepperoni</GridListItem>
      <GridListItem id="basil">Fresh basil</GridListItem>
      <GridListItem id="bacon">Bacon</GridListItem>
    </GridList>
  )
}
