"use client"

import { Description, Label } from "@/registry/ui/field"
import {
  Tag,
  TagGroup,
  TagList,
  type TagGroupProps,
  type TagProps,
} from "@/registry/ui/tag-group"

export default function Demo({
  label = "Categories",
  description = "",
  appearance = "solid",
  selectionMode = "none",
  removable = false,
  size = "md",
}: {
  label?: string
  description?: string
  appearance?: TagProps["appearance"]
  selectionMode?: TagGroupProps["selectionMode"]
  removable?: boolean
  size?: TagGroupProps["size"]
} = {}) {
  return (
    <TagGroup
      size={size}
      selectionMode={selectionMode}
      onRemove={removable ? (keys) => console.log(keys) : undefined}
    >
      {label && <Label>{label}</Label>}
      <TagList>
        <Tag data-control-target id="news" appearance={appearance}>
          News
        </Tag>
        <Tag data-control-target id="travel" appearance={appearance}>
          Travel
        </Tag>
        <Tag data-control-target id="gaming" appearance={appearance}>
          Gaming
        </Tag>
        <Tag data-control-target id="shopping" appearance={appearance}>
          Shopping
        </Tag>
      </TagList>
      {description && <Description>{description}</Description>}
    </TagGroup>
  )
}
