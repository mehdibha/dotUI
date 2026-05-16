"use client";

import { Link as RouterLink } from "@tanstack/react-router";

import { ExternalLinkIcon, SunIcon } from "lucide-react";

import { buttonStyles } from "@/registry/ui/button";
import { ToggleButton } from "@/registry/ui/toggle-button";

import type { RegistryItem } from "@/registry/types";

interface BlockCardProps {
	block: RegistryItem;
}

export function BlockCard({ block }: BlockCardProps) {
	const iframeUrl = `/view/${block.name}`;

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center justify-between px-2">
				<h2 className="truncate font-medium text-lg tracking-tight">{block.description}</h2>
				<div className="flex items-center gap-2">
					<ToggleButton size="sm" isIconOnly aria-label="Toggle theme">
						<SunIcon />
					</ToggleButton>
					{/* <Button
						className="font-mono max-lg:hidden [&_svg]:size-4 [&_svg]:text-fg-muted"
						onPress={handleCopy}
						size="sm"
					>
						{isCopied ? <CheckIcon className="fade-in animate-in" /> : <TerminalIcon className="fade-in animate-in" />}
						<span className="truncate text-xs">npx shadcn@latest add @dotui/{block.name}</span>
					</Button> */}
					<RouterLink
						to="/view/$block"
						params={{ block: block.name }}
						target="_blank"
						rel="noopener noreferrer"
						className={buttonStyles({ variant: "primary", size: "sm", className: "max-lg:hidden" })}
					>
						<ExternalLinkIcon />
						Open in new tab
					</RouterLink>
				</div>
			</div>
			<div className="overflow-hidden rounded-lg border bg-muted">
				<iframe
					src={iframeUrl}
					style={{ height: block.meta?.containerHeight ?? 400 }}
					title={`Preview for ${block.name}`}
					className="w-full"
				/>
			</div>
		</div>
	);
}
