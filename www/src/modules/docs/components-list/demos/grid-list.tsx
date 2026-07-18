import { GridList, GridListItem } from '@/registry/ui/grid-list'

export function GridListDemo() {
  return (
    <GridList
      aria-label="Toppings"
      selectionMode="multiple"
      defaultSelectedKeys={['mushroom', 'basil']}
      className="w-56"
    >
      <GridListItem id="mushroom">Mushroom</GridListItem>
      <GridListItem id="olives">Olives</GridListItem>
      <GridListItem id="pepperoni">Pepperoni</GridListItem>
      <GridListItem id="basil">Fresh basil</GridListItem>
    </GridList>
  )
}
