import { createFileRoute } from "@tanstack/react-router";
import { Dialog, DialogTrigger, Modal, ModalOverlay } from "react-aria-components/Modal";

import { Button } from "@/registry/ui/button";
import { Input } from "@/registry/ui/input";
import { TextField } from "@/registry/ui/text-field";

export const Route = createFileRoute("/playground")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-10">
			<h1 className="font-semibold text-2xl">Playground</h1>
			<p>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer non neque at arcu laoreet congue. Suspendisse
				potenti. Sed ullamcorper, ipsum vitae tincidunt bibendum, massa mi interdum justo, nec condimentum sem lacus sit
				amet erat.
			</p>
			<p>
				Praesent luctus, sapien eu egestas tincidunt, turpis lectus facilisis mauris, sed varius magna mi nec lectus.
				Curabitur dignissim lorem at enim viverra, vitae facilisis nibh viverra. Duis sed lectus ac diam ultricies
				interdum.
			</p>
			<p>
				Aliquam erat volutpat. Fusce suscipit, massa at placerat finibus, justo arcu vestibulum risus, sit amet sagittis
				velit magna sed eros. Donec non lorem in sem cursus efficitur.
			</p>
			<DialogTrigger>
				<Button>Open dialog</Button>
				<ModalOverlay isDismissable className="absolute top-0 left-0 z-50 h-(--page-height) w-full bg-black/40">
					<div className="sticky top-0 h-(--visual-viewport-height) bg-blue-500/40 w-full flex items-end">
						<Modal className="w-full rounded-t-xl bg-muted/40 p-4">
							<Dialog className="flex flex-col gap-30">
								<p>this is the dialog content</p>
								<TextField>
									<Input />
								</TextField>
							</Dialog>
						</Modal>
					</div>
				</ModalOverlay>
			</DialogTrigger>
			{Array.from({ length: 18 }, (_, index) => (
				<p key={index}>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vestibulum risus sed massa feugiat, vitae
					congue justo gravida. Phasellus non risus et elit luctus tempor. Vestibulum ante ipsum primis in faucibus orci
					luctus et ultrices posuere cubilia curae; Donec venenatis, nisl at ullamcorper malesuada, nibh justo facilisis
					magna, at posuere nibh arcu vitae justo.
				</p>
			))}
		</div>
	);
}
