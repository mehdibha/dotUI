import { Alert, AlertDescription, AlertTitle } from '@/registry/ui/alert'
import { Badge } from '@/registry/ui/badge'
import { Button } from '@/registry/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/registry/ui/card'
import { Label } from '@/registry/ui/field'
import { Input } from '@/registry/ui/input'
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSection,
  MenuSectionHeader,
} from '@/registry/ui/menu'
import { Popover } from '@/registry/ui/popover'
import { TextField } from '@/registry/ui/text-field'

/** The shared component cluster, re-rendered under each injected palette. */
export function ComponentCluster() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="primary" size="sm">
          Primary
        </Button>
        <Button variant="default" size="sm">
          Default
        </Button>
        <Button variant="quiet" size="sm">
          Quiet
        </Button>
        <Menu>
          <Button variant="default" size="sm">
            Menu
          </Button>
          <Popover>
            <MenuContent>
              <MenuSection>
                <MenuSectionHeader>Actions</MenuSectionHeader>
                <MenuItem id="edit">Edit</MenuItem>
                <MenuItem id="duplicate">Duplicate</MenuItem>
                <MenuItem id="archive">Archive</MenuItem>
              </MenuSection>
            </MenuContent>
          </Popover>
        </Menu>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="accent">accent</Badge>
        <Badge variant="neutral">neutral</Badge>
        <Badge variant="accent" appearance="subtle">
          subtle
        </Badge>
      </div>

      <TextField className="max-w-xs">
        <Label>Email</Label>
        <Input placeholder="you@example.com" />
      </TextField>

      <Alert variant="neutral">
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>
          An alert on the accent-tinted surface.
        </AlertDescription>
      </Alert>

      <Card size="sm">
        <CardHeader>
          <CardTitle>Card</CardTitle>
          <CardDescription>Sitting on the card surface.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="primary" size="sm">
            Confirm
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
