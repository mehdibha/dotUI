import { PenSquareIcon } from 'lucide-react'
import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Overlay,
  TextField,
} from 'www'

const wrap: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
}

export const Default = () => (
  <div style={wrap}>
    <Dialog defaultOpen>
      <Button>
        <PenSquareIcon /> Create issue
      </Button>
      <Overlay>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new issue</DialogTitle>
            <DialogDescription>
              Report an issue or request a feature.
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <TextField aria-label="Title">
              <Input placeholder="Title" style={{ width: '100%' }} />
            </TextField>
          </DialogBody>
          <DialogFooter>
            <Button variant="default">Cancel</Button>
            <Button variant="primary">Create</Button>
          </DialogFooter>
        </DialogContent>
      </Overlay>
    </Dialog>
  </div>
)
