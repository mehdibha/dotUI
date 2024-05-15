// import {
//   AlertDialogAction,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogRoot,
//   AlertDialogTrigger,
//   AlertDialogCancel,
//   AlertDialogTitle,
//   AlertDialogContent,
//   AlertDialogInset,
// } from "@/lib/components/core/default/alert-dialog";

export default function AlertDialogDemo() {
  return null
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
        <AlertDialogInset className="px-6">
          {Array.from({ length: 30 }, (_, i) => (
            <p key={i}>Some content contained within the Alert Dialog.</p>
          ))}
        </AlertDialogInset>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant={{ initial: "ghost", sm: "danger" }}
            className="max-sm:text-fg-danger"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogRoot>
  );
}
