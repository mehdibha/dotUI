import { Button } from "@dotui/ui/components/button";
import { Dialog, DialogRoot } from "@dotui/ui/components/dialog";

import { StyleColorsEditor } from "@/modules/styles/components/style-colors-editor";

export default function StyleColorsPage() {
  return (
    <>
      <DialogRoot>
        <Button>hello</Button>
        <Dialog>content</Dialog>
      </DialogRoot>
      <StyleColorsEditor />
    </>
  );
}
