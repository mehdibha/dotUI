import { Button } from "@/components/dynamic-core/button";
import { DialogContent, DialogRoot } from "@/components/dynamic-core/dialog";
import { Modal } from "@/components/dynamic-core/modal";
import { TextField } from "@/components/dynamic-core/text-field";
import { Heading } from "@/registry/core/heading";

export default function Demo() {
  return (
    <DialogRoot>
      <Button>Edit profile</Button>
      <Modal>
        <DialogContent className="space-y-4">
          <Heading>Edit Profile</Heading>
          <TextField
            autoFocus
            label="Name"
            defaultValue="Mehdi"
            className="w-full"
          />
          <TextField
            label="Username"
            defaultValue="@mehdibha_"
            className="w-full"
          />
          <div className="flex items-center justify-end gap-2">
            <Button slot="close" variant="outline">
              Cancel
            </Button>
            <Button slot="close" variant="primary">
              Save changes
            </Button>
          </div>
        </DialogContent>
      </Modal>
    </DialogRoot>
  );
}
