import {
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogRoot,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogTitle,
  AlertDialogContent,
} from "@/lib/components/core/default/alert-dialog";

export default function AlertDialogDemo() {
  return (
    <AlertDialogRoot>
      <AlertDialogTrigger variant="danger">Delete</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete project</AlertDialogTitle>
          <AlertDialogDescription>
            This project will be deleted, along with all of its settings.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogRoot>
  );
}
