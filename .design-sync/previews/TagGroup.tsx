import { BookmarkIcon, FlameIcon, SparklesIcon, TagIcon } from 'lucide-react'
import { Label, Tag, TagGroup, TagList } from 'www'

export const Basic = () => (
  <TagGroup style={{ width: 300 }}>
    <Label>Categories</Label>
    <TagList>
      <Tag>News</Tag>
      <Tag>Travel</Tag>
      <Tag>Gaming</Tag>
      <Tag>Shopping</Tag>
    </TagList>
  </TagGroup>
)

export const WithIcons = () => (
  <TagGroup style={{ width: 300 }}>
    <Label>Topics</Label>
    <TagList>
      <Tag textValue="General">
        <TagIcon /> General
      </Tag>
      <Tag textValue="Trending">
        <FlameIcon /> Trending
      </Tag>
      <Tag textValue="New">
        <SparklesIcon /> New
      </Tag>
      <Tag textValue="Saved">
        <BookmarkIcon /> Saved
      </Tag>
    </TagList>
  </TagGroup>
)

export const Selection = () => (
  <TagGroup
    selectionMode="single"
    defaultSelectedKeys={['chocolate']}
    style={{ width: 300 }}
  >
    <Label>Favorite flavor</Label>
    <TagList>
      <Tag id="chocolate">Chocolate</Tag>
      <Tag id="mint">Mint</Tag>
      <Tag id="strawberry">Strawberry</Tag>
      <Tag id="vanilla">Vanilla</Tag>
    </TagList>
  </TagGroup>
)

export const Removable = () => (
  <TagGroup onRemove={() => {}} style={{ width: 300 }}>
    <Label>Selected tags</Label>
    <TagList>
      <Tag id="design">Design</Tag>
      <Tag id="frontend">Frontend</Tag>
      <Tag id="research">Research</Tag>
    </TagList>
  </TagGroup>
)
