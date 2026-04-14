import { createFileRoute } from "@tanstack/react-router";
import { type MotionValue, motion, useScroll, useTransform } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import {
	Button as AriaButton,
	Dialog as AriaDialog,
	DialogTrigger as AriaDialogTrigger,
	ListBox as AriaListBox,
	ListBoxItem as AriaListBoxItem,
	Popover as AriaPopover,
} from "react-aria-components";

export const Route = createFileRoute("/playground")({
	component: PlaygroundPage,
});

const MONTHS = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];
const YEARS = Array.from({ length: 150 }, (_, i) => 1950 + i);

const ITEM_HEIGHT = 36;
const VISIBLE = 5;
const CONTAINER_H = ITEM_HEIGHT * VISIBLE;
const PAD = (CONTAINER_H - ITEM_HEIGHT) / 2;

type DateValue = { month: number; year: number };

function PlaygroundPage() {
	const [value, setValue] = useState<DateValue>(() => {
		const d = new Date();
		return { month: d.getMonth(), year: d.getFullYear() };
	});
	return (
		<div className="flex min-h-screen items-center justify-center gap-4 bg-bg p-8">
			<MonthYearPicker value={value} onChange={setValue} />
		</div>
	);
}

function MonthYearPicker({ value, onChange }: { value: DateValue; onChange: (v: DateValue) => void }) {
	return (
		<AriaDialogTrigger>
			<AriaButton className="rounded-lg border border-border bg-bg-muted px-4 py-2 text-sm font-medium tabular-nums outline-none transition-colors hover:bg-bg-hover focus-visible:ring-2 focus-visible:ring-fg/20">
				{MONTHS[value.month]} {value.year}
			</AriaButton>
			<AriaPopover
				placement="bottom"
				offset={8}
				className="rounded-xl border border-border bg-bg p-3 shadow-lg outline-none data-[entering]:animate-in data-[exiting]:animate-out data-[entering]:fade-in-0 data-[exiting]:fade-out-0 data-[entering]:zoom-in-95 data-[exiting]:zoom-out-95"
			>
				<AriaDialog className="outline-none" aria-label="Select month and year">
					<div
						className="relative flex gap-2"
						style={{ perspective: 1000, perspectiveOrigin: "center" }}
					>
						<Wheel
							ariaLabel="Month"
							items={MONTHS.map((m, i) => ({ id: i, label: m }))}
							value={value.month}
							onChange={(month) => onChange({ ...value, month })}
						/>
						<Wheel
							ariaLabel="Year"
							items={YEARS.map((y) => ({ id: y, label: String(y) }))}
							value={value.year}
							onChange={(year) => onChange({ ...value, year })}
						/>
						<div
							aria-hidden
							className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 rounded-md bg-fg/5"
							style={{ height: ITEM_HEIGHT }}
						/>
						<div
							aria-hidden
							className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-bg to-transparent"
						/>
						<div
							aria-hidden
							className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-bg to-transparent"
						/>
					</div>
				</AriaDialog>
			</AriaPopover>
		</AriaDialogTrigger>
	);
}

type Item = { id: number; label: string };

function Wheel({
	items,
	value,
	onChange,
	ariaLabel,
}: {
	items: Item[];
	value: number;
	onChange: (v: number) => void;
	ariaLabel: string;
}) {
	const scrollRef = useRef<HTMLDivElement>(null);
	const { scrollY } = useScroll({ container: scrollRef });
	const settleTimer = useRef<number | null>(null);
	const isProgrammaticScroll = useRef(false);

	useLayoutEffect(() => {
		const el = scrollRef.current;
		if (!el) return;
		const index = items.findIndex((i) => i.id === value);
		if (index < 0) return;
		isProgrammaticScroll.current = true;
		el.scrollTop = index * ITEM_HEIGHT;
		requestAnimationFrame(() => {
			isProgrammaticScroll.current = false;
		});
		// Only scroll on mount — subsequent selection changes handled in onSelectionChange.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const settle = () => {
		const el = scrollRef.current;
		if (!el) return;
		const idx = Math.round(el.scrollTop / ITEM_HEIGHT);
		const clamped = Math.max(0, Math.min(items.length - 1, idx));
		const next = items[clamped];
		if (next && next.id !== value) onChange(next.id);
	};

	const handleScroll = () => {
		if (isProgrammaticScroll.current) return;
		if (settleTimer.current !== null) window.clearTimeout(settleTimer.current);
		settleTimer.current = window.setTimeout(settle, 120);
	};

	return (
		<AriaListBox
			ref={scrollRef}
			aria-label={ariaLabel}
			selectionMode="single"
			disallowEmptySelection
			selectedKeys={[String(value)]}
			onSelectionChange={(keys) => {
				if (keys === "all") return;
				const k = [...keys][0];
				if (k == null) return;
				const next = items.find((i) => String(i.id) === String(k));
				if (!next) return;
				if (next.id !== value) onChange(next.id);
				const idx = items.indexOf(next);
				const el = scrollRef.current;
				if (el) {
					isProgrammaticScroll.current = true;
					el.scrollTo({ top: idx * ITEM_HEIGHT, behavior: "smooth" });
					window.setTimeout(() => {
						isProgrammaticScroll.current = false;
					}, 300);
				}
			}}
			onScroll={handleScroll}
			className="min-w-28 outline-none [&::-webkit-scrollbar]:hidden"
			style={{
				height: CONTAINER_H,
				paddingBlock: PAD,
				overflowY: "auto",
				scrollSnapType: "y mandatory",
				scrollbarWidth: "none",
				transformStyle: "preserve-3d",
			}}
		>
			{items.map((item, i) => (
				<AriaListBoxItem
					key={item.id}
					id={String(item.id)}
					textValue={item.label}
					className="outline-none"
					style={{ scrollSnapAlign: "center" }}
				>
					{({ isSelected, isFocusVisible }) => (
						<WheelItemView index={i} scrollY={scrollY} isSelected={isSelected} isFocusVisible={isFocusVisible}>
							{item.label}
						</WheelItemView>
					)}
				</AriaListBoxItem>
			))}
		</AriaListBox>
	);
}

function WheelItemView({
	index,
	scrollY,
	isSelected,
	isFocusVisible,
	children,
}: {
	index: number;
	scrollY: MotionValue<number>;
	isSelected: boolean;
	isFocusVisible: boolean;
	children: React.ReactNode;
}) {
	const center = index * ITEM_HEIGHT;
	const range = [
		center - 3 * ITEM_HEIGHT,
		center - 2 * ITEM_HEIGHT,
		center - ITEM_HEIGHT,
		center,
		center + ITEM_HEIGHT,
		center + 2 * ITEM_HEIGHT,
		center + 3 * ITEM_HEIGHT,
	];
	const rotateX = useTransform(scrollY, range, [75, 55, 30, 0, -30, -55, -75]);
	const opacity = useTransform(
		scrollY,
		[center - 3 * ITEM_HEIGHT, center, center + 3 * ITEM_HEIGHT],
		[0.15, 1, 0.15],
	);
	const scale = useTransform(
		scrollY,
		[center - 2 * ITEM_HEIGHT, center, center + 2 * ITEM_HEIGHT],
		[0.82, 1, 0.82],
	);

	return (
		<motion.div
			data-selected={isSelected || undefined}
			data-focus-visible={isFocusVisible || undefined}
			style={{
				rotateX,
				opacity,
				scale,
				height: ITEM_HEIGHT,
				transformStyle: "preserve-3d",
				backfaceVisibility: "hidden",
			}}
			className="flex items-center justify-center text-sm font-medium tabular-nums data-[focus-visible]:text-fg data-[selected]:text-fg"
		>
			{children}
		</motion.div>
	);
}
