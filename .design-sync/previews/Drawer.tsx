import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Drawer,
  DrawerHandle,
  Input,
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
      <Button>Open drawer</Button>
      <Drawer>
        <DialogContent>
          <DrawerHandle />
          <DialogHeader>
            <DialogTitle>Filters</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <TextField aria-label="Search">
              <Input placeholder="Search filters…" style={{ width: '100%' }} />
            </TextField>
          </DialogBody>
        </DialogContent>
      </Drawer>
    </Dialog>
  </div>
)
