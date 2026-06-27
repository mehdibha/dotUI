'use client'

import { Tree, TreeItem, TreeItemContent } from '@/registry/ui/tree'

export default function Demo() {
  return (
    <Tree
      aria-label="Files"
      selectionMode="single"
      selectionBehavior="replace"
      defaultExpandedKeys={['documents', 'project', 'photos']}
      className="w-72"
    >
      <TreeItem id="documents" textValue="Documents">
        <TreeItemContent>Documents</TreeItemContent>
        <TreeItem id="project" textValue="Project">
          <TreeItemContent>Project</TreeItemContent>
          <TreeItem id="report" textValue="Weekly report">
            <TreeItemContent>Weekly report</TreeItemContent>
          </TreeItem>
        </TreeItem>
      </TreeItem>
      <TreeItem id="photos" textValue="Photos">
        <TreeItemContent>Photos</TreeItemContent>
        <TreeItem id="mountains" textValue="Mountains.jpg">
          <TreeItemContent>Mountains.jpg</TreeItemContent>
        </TreeItem>
        <TreeItem id="beach" textValue="Beach.jpg">
          <TreeItemContent>Beach.jpg</TreeItemContent>
        </TreeItem>
      </TreeItem>
    </Tree>
  )
}
