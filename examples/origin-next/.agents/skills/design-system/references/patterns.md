# Patterns

Starting points written in this system's voice. Adapt them; keep the structure.

## Page header

```tsx
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"

<header className="flex flex-wrap items-end justify-between gap-4">
  <div className="flex flex-col gap-1">
    <h1 className="text-2xl">Projects</h1>
    <p className="text-sm text-fg-muted">Everything your team is building, in one place.</p>
  </div>
  <Button variant="primary">
    <PlusIcon data-icon-start="" /> New project
  </Button>
</header>
```

## Form

```tsx
import { Button } from "@/components/ui/button"
import { Description, FieldGroup, Fieldset, Label, Legend } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { TextField } from "@/components/ui/text-field"

<form className="flex max-w-3xl flex-col gap-8">
  <Fieldset>
    <Legend>Profile</Legend>
    <FieldGroup>
      <TextField isRequired>
        <Label>Display name</Label>
        <Input />
      </TextField>
      <TextField type="email" isRequired>
        <Label>Email</Label>
        <Input />
        <Description>Used for sign-in and notifications.</Description>
      </TextField>
      <Select defaultSelectedKey="utc">
        <Label>Time zone</Label>
        <SelectTrigger />
        <SelectContent>
          <SelectItem id="utc">UTC</SelectItem>
          <SelectItem id="cet">Central European Time</SelectItem>
        </SelectContent>
      </Select>
    </FieldGroup>
  </Fieldset>
  <Button type="submit" variant="primary" className="self-start">
    Save changes
  </Button>
</form>
```

## Collection

```tsx
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCell, TableColumn, TableContainer, TableHeader, TableRow,
} from "@/components/ui/table"

<TableContainer>
  <Table aria-label="Projects">
    <TableHeader>
      <TableColumn isRowHeader>Name</TableColumn>
      <TableColumn>Status</TableColumn>
      <TableColumn>Updated</TableColumn>
    </TableHeader>
    <TableBody items={projects} renderEmptyState={() => <ProjectsEmpty />}>
      {(project) => (
        <TableRow>
          <TableCell>{project.name}</TableCell>
          <TableCell>
            <Badge variant={project.live ? "success" : "neutral"}>
              {project.live ? "Live" : "Draft"}
            </Badge>
          </TableCell>
          <TableCell className="tabular-nums text-fg-muted">{project.updatedAt}</TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
</TableContainer>
```

## Empty state

```tsx
import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"

<Empty>
  <EmptyHeader>
    <EmptyTitle>No projects yet</EmptyTitle>
    <EmptyDescription>Projects you create will show up here. Start with your first one.</EmptyDescription>
  </EmptyHeader>
  <EmptyContent>
    <Button variant="primary">Create project</Button>
  </EmptyContent>
</Empty>
```

## Row actions

```tsx
import { Button } from "@/components/ui/button"
import { Menu, MenuContent, MenuItem } from "@/components/ui/menu"
import { Popover } from "@/components/ui/popover"
import { Tooltip, TooltipContent } from "@/components/ui/tooltip"
import { MoreHorizontalIcon } from "lucide-react"

<Menu>
  <Tooltip>
    <Button variant="quiet" size="sm" isIconOnly aria-label="Project actions">
      <MoreHorizontalIcon />
    </Button>
    <TooltipContent>Actions</TooltipContent>
  </Tooltip>
  <Popover>
    <MenuContent onAction={handleAction}>
      <MenuItem id="rename">Rename</MenuItem>
      <MenuItem id="duplicate">Duplicate</MenuItem>
      <MenuItem id="delete">Delete…</MenuItem>
    </MenuContent>
  </Popover>
</Menu>
```

## Destructive confirmation

```tsx
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Modal } from "@/components/ui/modal"

<Dialog>
  <Button variant="danger">Delete project…</Button>
  <Modal>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete “Acme web”?</DialogTitle>
        <DialogDescription>
          This permanently deletes the project and its 12 deployments. You can't undo this.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button slot="close">Cancel</Button>
        <Button slot="close" variant="danger" onPress={deleteProject}>
          Delete project
        </Button>
      </DialogFooter>
    </DialogContent>
  </Modal>
</Dialog>
```

## Action feedback

```tsx
import { toastManager } from "@/components/ui/toast"

toastManager.add({ title: "Changes saved", type: "success" })
toastManager.add({
  title: "Couldn't save changes",
  description: "Check your connection and try again.",
  type: "error",
})
```
