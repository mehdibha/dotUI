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
  Modal,
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
      <Button>Open modal</Button>
      <Modal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite team members</DialogTitle>
            <DialogDescription>
              Send an invitation to collaborate on this project.
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <TextField aria-label="Email">
              <Input
                placeholder="name@example.com"
                style={{ width: '100%' }}
              />
            </TextField>
          </DialogBody>
          <DialogFooter>
            <Button variant="default">Cancel</Button>
            <Button variant="primary">Send invite</Button>
          </DialogFooter>
        </DialogContent>
      </Modal>
    </Dialog>
  </div>
)
