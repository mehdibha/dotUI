import { Example } from "@/modules/create/preview/example";
import { Examples } from "@/modules/create/preview/examples";
import { Button } from "@/registry/ui/button";
import { toastManager } from "@/registry/ui/toast";

export default function ToastExamples() {
	return (
		<Examples className="md:grid-cols-2">
			<ToastBasic />
			<ToastVariants />
			<ToastWithAction />
			<ToastPromise />
		</Examples>
	);
}

function ToastBasic() {
	return (
		<Example title="Basic">
			<Button onPress={() => toastManager.add({ title: "Your message has been sent." })}>Show toast</Button>
		</Example>
	);
}

function ToastVariants() {
	return (
		<Example title="Variants">
			<div className="flex flex-wrap gap-2">
				<Button
					onPress={() =>
						toastManager.add({
							title: "Changes saved",
							description: "Your update is live.",
							type: "success",
						})
					}
				>
					Success
				</Button>
				<Button
					onPress={() =>
						toastManager.add({
							title: "New comment",
							description: "Maya left a note on this project.",
							type: "info",
						})
					}
				>
					Info
				</Button>
				<Button
					onPress={() =>
						toastManager.add({
							title: "Storage almost full",
							description: "Upgrade or clear space soon.",
							type: "warning",
						})
					}
				>
					Warning
				</Button>
				<Button
					onPress={() =>
						toastManager.add({
							title: "Upload failed",
							description: "Check your connection and try again.",
							type: "error",
						})
					}
				>
					Error
				</Button>
			</div>
		</Example>
	);
}

function ToastWithAction() {
	return (
		<Example title="Action">
			<Button onPress={showActionToast}>Archive message</Button>
		</Example>
	);
}

function showActionToast() {
	const id = toastManager.add({
		title: "Message archived",
		description: "The conversation was moved out of your inbox.",
		type: "info",
		actionProps: {
			children: "Undo",
			onClick: () => {
				toastManager.close(id);
				toastManager.add({ title: "Message restored", type: "success" });
			},
		},
	});
}

function ToastPromise() {
	return (
		<Example title="Promise">
			<Button
				onPress={() => {
					void toastManager.promise(wait(1200), {
						loading: {
							title: "Publishing changes",
							type: "loading",
						},
						success: {
							title: "Published",
							description: "The latest version is now live.",
							type: "success",
						},
						error: {
							title: "Publish failed",
							description: "Something went wrong while publishing.",
							type: "error",
						},
					});
				}}
			>
				Publish
			</Button>
		</Example>
	);
}

function wait(duration: number) {
	return new Promise<void>((resolve) => setTimeout(resolve, duration));
}
