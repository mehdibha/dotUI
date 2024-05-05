import {
  AlertDialog,
  AlertDialogTrigger,
} from "@/lib/components/core/default/alert-dialog";

export default function AlertDialogDemo() {
  return (
    <AlertDialog
      trigger={<AlertDialogTrigger variant="outline">Show Dialog</AlertDialogTrigger>}
      action={{ label: "Continue" }}
      cancel={{ label: "Cancel" }}
      title="Are you absolutely sure?"
      description="This action cannot be undone. This will permanently delete your account
        and remove your data from our servers."
    />
  );
}
