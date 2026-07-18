import { FileTextIcon, ImageIcon, VideoIcon } from 'lucide-react'

import {
  GridList,
  GridListItem,
  GridListItemDescription,
  GridListItemLabel,
} from '@/registry/ui/grid-list'

export default function Demo() {
  return (
    <div className="w-72 rounded-md border bg-card shadow-sm">
      <GridList aria-label="Files" selectionMode="single">
        <GridListItem id="report" textValue="Weekly report">
          <FileTextIcon />
          <GridListItemLabel>Weekly report</GridListItemLabel>
          <GridListItemDescription>PDF · 1.2 MB</GridListItemDescription>
        </GridListItem>
        <GridListItem id="mountains" textValue="Mountains">
          <ImageIcon />
          <GridListItemLabel>Mountains</GridListItemLabel>
          <GridListItemDescription>JPG · 3.4 MB</GridListItemDescription>
        </GridListItem>
        <GridListItem id="launch" textValue="Launch video">
          <VideoIcon />
          <GridListItemLabel>Launch video</GridListItemLabel>
          <GridListItemDescription>MP4 · 84 MB</GridListItemDescription>
        </GridListItem>
      </GridList>
    </div>
  )
}
