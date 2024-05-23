import { Button } from "@/lib/components/core/default/button";
import { DialogRoot, Dialog } from "@/lib/components/core/default/dialog";
// import { Input } from "@/lib/components/core/default/input";
import { Label } from "@/lib/components/core/default/field";

export default function DialogDemo() {
  return null;
  return (
    <DialogRoot>
      <Button variant="outline">Edit Profile</Button>
      <Dialog className="sm:max-w-[425px]">
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" defaultValue="Pedro Duarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" defaultValue="@peduarte" className="col-span-3" />
          </div>
        </div>
      </Dialog>
    </DialogRoot>
  );
}
