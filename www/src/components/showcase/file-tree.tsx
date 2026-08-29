"use client"

import {
  ChevronsUpDownIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  FolderIcon,
  FolderOpenIcon,
  ImageIcon,
} from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/ui/card"
import { Tree, TreeItem, TreeItemContent } from "@/registry/ui/tree"

function FolderContent({ name }: { name: string }) {
  return (
    <TreeItemContent>
      {({ isExpanded }) => (
        <>
          {isExpanded ? <FolderOpenIcon /> : <FolderIcon />}
          <span className="min-w-0 truncate">{name}</span>
        </>
      )}
    </TreeItemContent>
  )
}

export function FileTree({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Card className={cn("", className)} {...props}>
      <CardHeader>
        <CardTitle>Files</CardTitle>
        <CardDescription>dotui/www on main</CardDescription>
        <CardAction>
          <Button
            variant="quiet"
            size="sm"
            isIconOnly
            aria-label="Collapse all"
          >
            <ChevronsUpDownIcon />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Tree
          aria-label="Project files"
          selectionMode="single"
          selectionBehavior="replace"
          defaultExpandedKeys={["src", "components"]}
          defaultSelectedKeys={["button"]}
          className="w-full border-0 bg-transparent p-0"
        >
          <TreeItem id="src" textValue="src">
            <FolderContent name="src" />
            <TreeItem id="components" textValue="components">
              <FolderContent name="components" />
              <TreeItem id="button" textValue="button.tsx">
                <TreeItemContent>
                  <FileCodeIcon />
                  <span className="min-w-0 truncate">button.tsx</span>
                  <Badge size="sm" className="ml-auto">
                    M
                  </Badge>
                </TreeItemContent>
              </TreeItem>
              <TreeItem id="card" textValue="card.tsx">
                <TreeItemContent>
                  <FileCodeIcon />
                  <span className="min-w-0 truncate">card.tsx</span>
                </TreeItemContent>
              </TreeItem>
              <TreeItem id="input" textValue="input.tsx">
                <TreeItemContent>
                  <FileCodeIcon />
                  <span className="min-w-0 truncate">input.tsx</span>
                </TreeItemContent>
              </TreeItem>
            </TreeItem>
            <TreeItem id="lib" textValue="lib">
              <FolderContent name="lib" />
              <TreeItem id="utils" textValue="utils.ts">
                <TreeItemContent>
                  <FileCodeIcon />
                  <span className="min-w-0 truncate">utils.ts</span>
                </TreeItemContent>
              </TreeItem>
            </TreeItem>
            <TreeItem id="app" textValue="app.tsx">
              <TreeItemContent>
                <FileCodeIcon />
                <span className="min-w-0 truncate">app.tsx</span>
              </TreeItemContent>
            </TreeItem>
            <TreeItem id="styles" textValue="styles.css">
              <TreeItemContent>
                <FileIcon />
                <span className="min-w-0 truncate">styles.css</span>
              </TreeItemContent>
            </TreeItem>
          </TreeItem>
          <TreeItem id="public" textValue="public">
            <FolderContent name="public" />
            <TreeItem id="logo" textValue="logo.svg">
              <TreeItemContent>
                <ImageIcon />
                <span className="min-w-0 truncate">logo.svg</span>
              </TreeItemContent>
            </TreeItem>
            <TreeItem id="og" textValue="og.png">
              <TreeItemContent>
                <ImageIcon />
                <span className="min-w-0 truncate">og.png</span>
              </TreeItemContent>
            </TreeItem>
          </TreeItem>
          <TreeItem id="docs" textValue="docs">
            <FolderContent name="docs" />
            <TreeItem id="getting-started" textValue="getting-started.md">
              <TreeItemContent>
                <FileTextIcon />
                <span className="min-w-0 truncate">getting-started.md</span>
              </TreeItemContent>
            </TreeItem>
          </TreeItem>
        </Tree>
      </CardContent>
    </Card>
  )
}
