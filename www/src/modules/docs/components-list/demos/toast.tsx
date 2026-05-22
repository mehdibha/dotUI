"use client";

import { Button } from "@/registry/ui/button";
import { ToastProvider, toastManager } from "@/registry/ui/toast";

export function ToastDemo() {
	return (
		<div className="flex h-40 flex-col items-start">
			<ToastProvider>
				<Button onPress={() => toastManager.add({ title: "Event has been created", type: "success" })}>
					Show Toast
				</Button>
			</ToastProvider>
		</div>
	);
}
