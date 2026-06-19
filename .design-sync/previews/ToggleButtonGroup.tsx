import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  ItalicIcon,
  LayoutGridIcon,
  ListIcon,
  TableIcon,
  UnderlineIcon,
} from 'lucide-react'
import { ToggleButton, ToggleButtonGroup } from 'www'

const wrap: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 16,
}

export const Toolbar = () => (
  <ToggleButtonGroup
    selectionMode="multiple"
    defaultSelectedKeys={['bold']}
    aria-label="Text formatting"
  >
    <ToggleButton id="bold" isIconOnly aria-label="Bold">
      <BoldIcon />
    </ToggleButton>
    <ToggleButton id="italic" isIconOnly aria-label="Italic">
      <ItalicIcon />
    </ToggleButton>
    <ToggleButton id="underline" isIconOnly aria-label="Underline">
      <UnderlineIcon />
    </ToggleButton>
  </ToggleButtonGroup>
)

export const SingleSelection = () => (
  <ToggleButtonGroup
    defaultSelectedKeys={['grid']}
    aria-label="View mode"
  >
    <ToggleButton id="list" isIconOnly aria-label="List view">
      <ListIcon />
    </ToggleButton>
    <ToggleButton id="grid" isIconOnly aria-label="Grid view">
      <LayoutGridIcon />
    </ToggleButton>
    <ToggleButton id="table" isIconOnly aria-label="Table view">
      <TableIcon />
    </ToggleButton>
  </ToggleButtonGroup>
)

export const WithText = () => (
  <ToggleButtonGroup
    defaultSelectedKeys={['left']}
    aria-label="Text alignment"
  >
    <ToggleButton id="left">
      <AlignLeftIcon data-icon-start="" />
      Left
    </ToggleButton>
    <ToggleButton id="center">
      <AlignCenterIcon data-icon-start="" />
      Center
    </ToggleButton>
    <ToggleButton id="right">
      <AlignRightIcon data-icon-start="" />
      Right
    </ToggleButton>
  </ToggleButtonGroup>
)

export const Variants = () => (
  <div style={wrap}>
    {(['default', 'primary', 'quiet'] as const).map((variant) => (
      <ToggleButtonGroup
        key={variant}
        variant={variant}
        defaultSelectedKeys={[`${variant}-bold`]}
        selectionMode="multiple"
        aria-label={`${variant} formatting`}
      >
        <ToggleButton id={`${variant}-bold`} isIconOnly aria-label="Bold">
          <BoldIcon />
        </ToggleButton>
        <ToggleButton id={`${variant}-italic`} isIconOnly aria-label="Italic">
          <ItalicIcon />
        </ToggleButton>
        <ToggleButton
          id={`${variant}-underline`}
          isIconOnly
          aria-label="Underline"
        >
          <UnderlineIcon />
        </ToggleButton>
      </ToggleButtonGroup>
    ))}
  </div>
)

export const Vertical = () => (
  <ToggleButtonGroup
    orientation="vertical"
    defaultSelectedKeys={['grid']}
    aria-label="View mode"
  >
    <ToggleButton id="list" isIconOnly aria-label="List view">
      <ListIcon />
    </ToggleButton>
    <ToggleButton id="grid" isIconOnly aria-label="Grid view">
      <LayoutGridIcon />
    </ToggleButton>
    <ToggleButton id="table" isIconOnly aria-label="Table view">
      <TableIcon />
    </ToggleButton>
  </ToggleButtonGroup>
)
