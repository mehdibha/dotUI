import React from "react";
import { mergeRefs } from "@react-aria/utils";
import {
	AnchorProvider,
	ScrollProvider,
	TOCItem as PrimitiveTOCItem,
	type TOCItemType,
	useActiveAnchors,
} from "fumadocs-core/toc";

import { cn } from "@dotui/registry/lib/utils";

export type { TOCItemType, TableOfContents } from "fumadocs-core/toc";

const TOCContext = React.createContext<TOCItemType[]>([]);

export function useTOCItems(): TOCItemType[] {
	return React.use(TOCContext);
}

export function TOCProvider({ toc, children, ...props }: React.ComponentProps<typeof AnchorProvider>) {
	return (
		<TOCContext value={toc}>
			<AnchorProvider toc={toc} {...props}>
				{children}
			</AnchorProvider>
		</TOCContext>
	);
}

export function TOCScrollArea({ ref, className, ...props }: React.ComponentProps<"div">) {
	const viewRef = React.useRef<HTMLDivElement>(null);

	return (
		<div
			ref={mergeRefs(viewRef, ref)}
			className={cn(
				"mask-[linear-gradient(to_bottom,transparent,white_16px,white_calc(100%-16px),transparent)] relative ms-px min-h-0 overflow-auto py-3 text-sm [scrollbar-width:none]",
				className,
			)}
			{...props}
		>
			<ScrollProvider containerRef={viewRef}>{props.children}</ScrollProvider>
		</div>
	);
}

type TocThumb = [top: number, height: number];

interface RefProps {
	containerRef: React.RefObject<HTMLElement | null>;
}

export function TocThumb({ containerRef, ...props }: React.ComponentProps<"div"> & RefProps) {
	const thumbRef = React.useRef<HTMLDivElement>(null);

	return (
		<>
			<div ref={thumbRef} role="none" {...props} />
			<Updater containerRef={containerRef} thumbRef={thumbRef} />
		</>
	);
}

function Updater({ containerRef, thumbRef }: RefProps & { thumbRef: React.RefObject<HTMLElement | null> }) {
	const active = useActiveAnchors();
	const onPrint = React.useEffectEvent(() => {
		if (!containerRef.current || !thumbRef.current) return;
		update(thumbRef.current, calc(containerRef.current, active));
	});

	React.useEffect(() => {
		if (!containerRef.current) return;
		const container = containerRef.current;

		const observer = new ResizeObserver(onPrint);
		observer.observe(container);

		return () => observer.disconnect();
	}, [containerRef]);

	if (containerRef.current && thumbRef.current) {
		update(thumbRef.current, calc(containerRef.current, active));
	}

	return null;
}

function calc(container: HTMLElement, active: string[]): TocThumb {
	if (active.length === 0 || container.clientHeight === 0) {
		return [0, 0];
	}

	let upper = Number.MAX_VALUE;
	let lower = 0;

	for (const item of active) {
		const element = container.querySelector<HTMLElement>(`a[href="#${item}"]`);
		if (!element) continue;

		const styles = getComputedStyle(element);
		upper = Math.min(upper, element.offsetTop + parseFloat(styles.paddingTop));
		lower = Math.max(lower, element.offsetTop + element.clientHeight - parseFloat(styles.paddingBottom));
	}

	return [upper, lower - upper];
}

function update(element: HTMLElement, info: TocThumb): void {
	element.style.setProperty("--toc-top", `${info[0]}px`);
	element.style.setProperty("--toc-height", `${info[1]}px`);
}

export function TOCItems({ ref, className, ...props }: React.ComponentProps<"div">) {
	const containerRef = React.useRef<HTMLDivElement>(null);
	const items = useTOCItems();

	if (items.length === 0) return null;

	return (
		<>
			<TocThumb
				containerRef={containerRef}
				className="absolute top-(--toc-top) h-(--toc-height) w-px bg-primary transition-[height,top]"
			/>
			<nav ref={mergeRefs(ref, containerRef)} className={cn("flex flex-col border-l", className)} {...props}>
				{items.map((item) => (
					<TOCItem key={item.url} item={item} />
				))}
			</nav>
		</>
	);
}

function TOCItem({ item }: { item: TOCItemType }) {
	return (
		<PrimitiveTOCItem
			href={item.url}
			className={cn(
				"wrap-anywhere py-1 text-fg-muted text-sm transition-colors first:pt-0 last:pb-0 data-[active=true]:text-fg",
				item.depth <= 2 && "pl-3",
				item.depth === 3 && "pl-6",
				item.depth >= 4 && "pl-8",
			)}
		>
			{item.title}
		</PrimitiveTOCItem>
	);
}
