'use client'

import {
  FileTextIcon,
  FolderIcon,
  FolderOpenIcon,
  ImageIcon,
} from 'lucide-react'

import { Tree, TreeItem, TreeItemContent } from '@/registry/ui/tree'

export default function Demo() {
  return (
    <Tree
      aria-label="Files"
      selectionMode="single"
      selectionBehavior="replace"
      defaultExpandedKeys={['documents', 'photos']}
      className="w-72"
    >
      <TreeItem id="documents" textValue="Documents">
        <TreeItemContent>
          {({ isExpanded }) => (
            <>
              {isExpanded ? <FolderOpenIcon /> : <FolderIcon />}
              Documents
            </>
          )}
        </TreeItemContent>
        <TreeItem id="report" textValue="Weekly report">
          <TreeItemContent>
            <FileTextIcon />
            Weekly report
          </TreeItemContent>
        </TreeItem>
        <TreeItem id="resume" textValue="Resume.pdf">
          <TreeItemContent>
            <FileTextIcon />
            Resume.pdf
          </TreeItemContent>
        </TreeItem>
      </TreeItem>
      <TreeItem id="photos" textValue="Photos">
        <TreeItemContent>
          {({ isExpanded }) => (
            <>
              {isExpanded ? <FolderOpenIcon /> : <FolderIcon />}
              Photos
            </>
          )}
        </TreeItemContent>
        <TreeItem id="mountains" textValue="Mountains.jpg">
          <TreeItemContent>
            <ImageIcon />
            Mountains.jpg
          </TreeItemContent>
        </TreeItem>
        <TreeItem id="beach" textValue="Beach.jpg">
          <TreeItemContent>
            <ImageIcon />
            Beach.jpg
          </TreeItemContent>
        </TreeItem>
      </TreeItem>
    </Tree>
  )
}
