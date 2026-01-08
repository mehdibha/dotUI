import React from "react";
import { Link } from "@tanstack/react-router";
import type * as PageTree from "fumadocs-core/page-tree";

import { cn } from "@dotui/registry/lib/utils";
import { Button } from "@dotui/registry/ui/button";
import { Dialog, DialogContent } from "@dotui/registry/ui/dialog";
import { Popover } from "@dotui/registry/ui/popover";

import { navItems } from "@/config/site";

export function MobileNav({ items }: { items: PageTree.Node[] }) {
	const [isOpen, setIsOpen] = React.useState(false);

	return (
		<Dialog isOpen={isOpen} onOpenChange={setIsOpen}>
			<Button
				size="sm"
				className={cn("md:hidden", "relative flex items-center justify-center")}
				aria-label="Toggle Menu"
			>
				<div className="relative h-3.5 w-4 [&>span]:absolute [&>span]:left-0 [&>span]:block [&>span]:h-0.5 [&>span]:w-4 [&>span]:rounded-full [&>span]:bg-fg [&>span]:transition-all [&>span]:duration-150 [&>span]:ease-out">
					<span className={cn("top-0.25", isOpen && "translate-y-[0.31rem] -rotate-45")} />
					<span className={cn("top-1.5", isOpen && "-rotate-45 opacity-0")} />
					<span className={cn("top-2.75", isOpen && "translate-y-[-0.31rem] rotate-45")} />
				</div>
			</Button>
			<Popover
				offset={12}
				containerPadding={0}
				className="size-full max-w-none rounded-none border-0 bg-bg/95 backdrop-blur-md"
			>
				<DialogContent className="overflow-y-auto pt-4">
					{({ close }) => (
						<div className="flex flex-col gap-12">
							<div className="space-y-2">
								<div className="font-medium text-fg-muted text-lg">Menu</div>
								<div className="flex flex-col gap-3">
									<MobileLink to="/" onOpenChange={close}>
										Home
									</MobileLink>
									{navItems.map((item) => (
										<MobileLink key={item.name} to={item.href.to ?? "/"} onOpenChange={close}>
											{item.name}
										</MobileLink>
									))}
								</div>
							</div>
							{items?.map((group, index) => {
								if (group.type === "folder") {
									return (
										// biome-ignore lint/suspicious/noArrayIndexKey: items is static navigation data
										<div key={index} className="flex flex-col gap-3">
											<div className="font-medium text-fg-muted text-lg">{group.name}</div>
											<div className="flex flex-col gap-3">
												{group.children.map((item) => {
													if (item.type === "page") {
														return (
															<MobileLink key={item.url} to={item.url} onOpenChange={close}>
																{item.name}
															</MobileLink>
														);
													}
													return null;
												})}
											</div>
										</div>
									);
								}
								return null;
							})}
						</div>
					)}
				</DialogContent>
			</Popover>
		</Dialog>
	);
}

function MobileLink({
	to,
	onOpenChange,
	className,
	children,
}: {
	to: string;
	onOpenChange?: (open: boolean) => void;
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<Link to={to} onClick={() => onOpenChange?.(false)} className={cn("font-medium text-2xl", className)}>
			{children}
		</Link>
	);
}
