import {
  Description,
  FieldError,
  Input,
  Label,
  SearchField,
} from 'www'

const wrap: React.CSSProperties = { width: '100%', maxWidth: 320 }

export const Default = () => (
  <div style={wrap}>
    <SearchField aria-label="Search" placeholder="Search…" />
  </div>
)

export const WithLabel = () => (
  <div style={wrap}>
    <SearchField>
      <Label>Search</Label>
      <Input placeholder="Search components…" />
      <Description>Enter your search query</Description>
    </SearchField>
  </div>
)

export const Disabled = () => (
  <div style={wrap}>
    <SearchField
      aria-label="Search"
      defaultValue="Is dotUI the best UI library?"
      isDisabled
    >
      <Input />
    </SearchField>
  </div>
)

export const Invalid = () => (
  <div style={wrap}>
    <SearchField isInvalid>
      <Label>Search</Label>
      <Input placeholder="Search…" />
      <FieldError>Please fill out this field.</FieldError>
    </SearchField>
  </div>
)
