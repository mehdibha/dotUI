'use client'

import { Tree, TreeItem, TreeItemContent } from '@/registry/ui/tree'

export default function Demo() {
  return (
    <Tree
      aria-label="Files"
      selectionMode="multiple"
      disabledKeys={['photos', 'resume']}
      defaultExpandedKeys={['documents']}
      className="w-72"
    >
      <TreeItem id="documents" textValue="Documents">
        <TreeItemContent>Documents</TreeItemContent>
        <TreeItem id="report" textValue="Weekly report">
          <TreeItemContent>Weekly report</TreeItemContent>
        </TreeItem>
        <TreeItem id="resume" textValue="Resume.pdf">
          <TreeItemContent>Resume.pdf</TreeItemContent>
        </TreeItem>
      </TreeItem>
      <TreeItem id="photos" textValue="Photos">
        <TreeItemContent>Photos</TreeItemContent>
        <TreeItem id="mountains" textValue="Mountains.jpg">
          <TreeItemContent>Mountains.jpg</TreeItemContent>
        </TreeItem>
      </TreeItem>
    </Tree>
  )
}
