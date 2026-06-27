import { Tree, TreeItem, TreeItemContent } from '@/registry/ui/tree'

export function TreeDemo() {
  return (
    <Tree
      aria-label="Files"
      selectionMode="single"
      selectionBehavior="replace"
      defaultExpandedKeys={['documents']}
      className="w-56"
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
      </TreeItem>
    </Tree>
  )
}
