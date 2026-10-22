import { LinkIcon, MailIcon, ShareIcon } from "@/registry/icons"
import { Avatar, AvatarFallback } from "@/registry/ui/avatar"
import { Button } from "@/registry/ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/ui/dialog"
import { Label } from "@/registry/ui/field"
import { Input } from "@/registry/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/registry/ui/select"
import { Sheet, SheetHandle } from "@/registry/ui/sheet"
import { TextField } from "@/registry/ui/text-field"

const PEOPLE = [
  ["SR", "Sam Rivera", "Owner"],
  ["NK", "Nadia Karim", "Can edit"],
  ["TL", "Theo Laurent", "Can edit"],
  ["IB", "Imen Bouazizi", "Can comment"],
  ["JW", "Jonas Weber", "Can view"],
]

export function StackedSheetsScene() {
  return (
    <Dialog>
      <Button variant="secondary">
        <ShareIcon />
        Share roadmap
      </Button>
      <Sheet>
        <DialogContent>
          <SheetHandle />
          <DialogHeader>
            <DialogTitle>Share “Q3 roadmap”</DialogTitle>
            <DialogDescription>5 people have access.</DialogDescription>
          </DialogHeader>
          <DialogBody>
            <ul className="flex flex-col gap-3">
              {PEOPLE.map(([initials, name, role]) => (
                <li key={name} className="flex items-center gap-3">
                  <Avatar size="sm">
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <span className="flex-1 text-sm font-medium">{name}</span>
                  <span className="text-sm text-fg-muted">{role}</span>
                </li>
              ))}
            </ul>
          </DialogBody>
          <DialogFooter>
            <Button>
              <LinkIcon />
              Copy link
            </Button>
            <Dialog>
              <Button variant="primary">
                <MailIcon />
                Invite people
              </Button>
              <Sheet>
                <DialogContent>
                  <SheetHandle />
                  <DialogHeader>
                    <DialogTitle>Invite people</DialogTitle>
                  </DialogHeader>
                  <DialogBody>
                    <TextField type="email">
                      <Label>Email</Label>
                      <Input placeholder="name@company.com" />
                    </TextField>
                    <Select defaultValue="edit">
                      <Label>Role</Label>
                      <SelectTrigger />
                      <SelectContent>
                        <SelectItem id="edit">Can edit</SelectItem>
                        <SelectItem id="comment">Can comment</SelectItem>
                        <SelectItem id="view">Can view</SelectItem>
                      </SelectContent>
                    </Select>
                  </DialogBody>
                  <DialogFooter>
                    <Button slot="close" variant="primary">
                      Send invite
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Sheet>
            </Dialog>
          </DialogFooter>
        </DialogContent>
      </Sheet>
    </Dialog>
  )
}
