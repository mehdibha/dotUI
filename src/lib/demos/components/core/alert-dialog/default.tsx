import { AlertDialogRoot, AlertDialog } from "@/lib/components/core/default/alert-dialog";
import { Button } from "@/lib/components/core/default/button";

export default function AlertDialogDemo() {
  // return null;
  return (
    <AlertDialogRoot>
      <Button type="danger">Delete</Button>
      <AlertDialog
        title="Delete project"
        // description="This project will be deleted, along with all of its settings."
        // cancel={{ label: "Cancel" }}
        // action={{ label: "Continue"}}}
      />
    </AlertDialogRoot>
  );
}
