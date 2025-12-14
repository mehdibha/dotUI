"use client";

import { ChevronsUpDownIcon, CodeIcon, EyeIcon, RocketIcon, RotateCcwIcon, SaveIcon, XIcon } from "lucide-react";

import { cn } from "@dotui/registry/lib/utils";
import { Avatar } from "@dotui/registry/ui/avatar";
import { Button } from "@dotui/registry/ui/button";
import { Dialog, DialogContent } from "@dotui/registry/ui/dialog";
import { Drawer } from "@dotui/registry/ui/drawer";
import { Skeleton } from "@dotui/registry/ui/skeleton";
import { Tooltip, TooltipContent } from "@dotui/registry/ui/tooltip";

import { authClient } from "@/modules/auth/client";
import { LoginModal } from "@/modules/auth/login-modal";
import { CodeModal } from "@/modules/style-editor/code-modal";
import { useDraftStyle } from "@/modules/style-editor/draft-style-atom";
import { PreviewFrame } from "@/modules/style-editor/preview";
import { useStyleEditorForm } from "@/modules/style-editor/style-editor-provider";
import { useEditorStyle } from "@/modules/style-editor/use-editor-style";
import { useResolvedModeState } from "@/modules/style-editor/use-resolved-mode";
import { CreateStyleModal } from "@/modules/styles/create-style-modal";

export function StyleEditorHeader() {
	return (
		<div className="container flex max-w-4xl justify-between">
			<StyleSelector />
			<StyleEditorHeaderActions />
		</div>
	);
}

function StyleSelector() {
	const { isPending, data } = useEditorStyle();
	return (
		<Skeleton show={isPending}>
			<div className="flex items-center gap-2">
				<span className="flex items-center gap-2 text-fg-muted text-sm">
					<Avatar
						src={data?.user.image ?? undefined}
						fallback={data?.user.username.slice(0, 2)}
						alt={data?.user.username ?? undefined}
						className="size-5"
					/>
					{/* {data?.user.username} */}
				</span>
				<span className="text-fg-disabled">/</span>
				<Button variant="default" className="border-0" size="sm">
					{data?.name}
					<ChevronsUpDownIcon />
				</Button>
			</div>
			{/* <h1 className="truncate text-lg leading-none font-bold lg:text-2xl">
        <form.Subscribe selector={(state) => state.values.name}>
          {(name) => name}
        </form.Subscribe>
      </h1> */}
			{/* <Select></Select> */}
		</Skeleton>
	);
}

function StyleEditorHeaderActions() {
	const form = useStyleEditorForm();
	const { resolvedMode } = useResolvedModeState();
	const { data, isPending: isEditorStylePending } = useEditorStyle();
	const { clearDraft } = useDraftStyle();
	const { data: session, isPending: isSessionPending } = authClient.useSession();

	const isUserAuthenticated = session?.user;
	const isUserStyle = isUserAuthenticated && session.user.id === data?.userId;

	return (
		<div className="flex items-center gap-1">
			<CodeModal>
				<Button size="sm" className="@max-md:size-8 @max-md:w-8 @max-md:px-0">
					<CodeIcon />
					<span className="@max-md:hidden">Code</span>
				</Button>
			</CodeModal>
			<Dialog>
				<Button size="sm" aria-label="Preview" className="xl:hidden">
					<EyeIcon />
				</Button>
				<Drawer>
					<DialogContent className="overflow-hidden p-0!">
						<div className="h-[80vh]">
							<PreviewFrame block="login" className="h-full" />
						</div>
						<div className={cn("absolute top-1 right-1 size-7 rounded-lg", resolvedMode === "dark" ? "dark" : "light")}>
							<Button slot="close" variant="quiet" size="sm">
								<XIcon />
							</Button>
						</div>
					</DialogContent>
				</Drawer>
			</Dialog>
			<form.AppForm>
				<Tooltip>
					<form.ResetButton
						aria-label="Reset form"
						size="sm"
						onPress={() => {
							form.reset();
							clearDraft();
						}}
					>
						<RotateCcwIcon />
					</form.ResetButton>
					<TooltipContent>Reset</TooltipContent>
				</Tooltip>
			</form.AppForm>
			<Skeleton show={isEditorStylePending || isSessionPending} className="w-20">
				<form.AppForm>
					{isUserAuthenticated ? (
						isUserStyle ? (
							<form.SubmitButton size="sm">
								<SaveIcon />
								Save
							</form.SubmitButton>
						) : (
							<CreateStyleModal
								initialStyle={{
									theme: form.getFieldValue("theme"),
									icons: form.getFieldValue("icons"),
									variants: form.getFieldValue("variants"),
								}}
							>
								<form.Subscribe selector={(state) => state.isDirty}>
									{(isDirty) => (
										<Button
											size="sm"
											variant="primary"
											isDisabled={!isDirty}
											className="border border-primary hover:border-primary-hover"
										>
											<RocketIcon />
											Publish
										</Button>
									)}
								</form.Subscribe>
							</CreateStyleModal>
						)
					) : (
						<LoginModal>
							<Button size="sm" variant="primary">
								Publish
							</Button>
						</LoginModal>
					)}
				</form.AppForm>
			</Skeleton>
		</div>
	);
}
