"use client";

import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
	Calendar as AriaCalendar,
	CalendarCell as AriaCalendarCell,
	CalendarGrid as AriaCalendarGrid,
	CalendarGridBody as AriaCalendarGridBody,
	CalendarGridHeader as AriaCalendarGridHeader,
	CalendarHeaderCell as AriaCalendarHeaderCell,
	Heading as AriaHeading,
	RangeCalendar as AriaRangeCalendar,
	CalendarStateContext,
	composeRenderProps,
	Provider,
	RangeCalendarStateContext,
	SelectContext,
} from "react-aria-components";
import type {
	CalendarProps as AriaCalendarProps,
	RangeCalendarProps as AriaRangeCalendarProps,
	DateValue,
	Key,
} from "react-aria-components";

import { Button } from "@/registry/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/registry/ui/select";
import type { SelectProps } from "@/registry/ui/select";

import { useStyles } from "./styles";

// MARK: calendarStyles

// MARK: seperator

interface CalendarProps<T extends DateValue> extends AriaCalendarProps<T> {}

const Calendar = <T extends DateValue>({ className, ...props }: CalendarProps<T>) => {
	const { root } = useStyles()();

	return (
		<AriaCalendar
			data-calendar=""
			className={composeRenderProps(className, (className) => root({ className }))}
			{...props}
		>
			{composeRenderProps(props.children, (children) => (
				<>
					{children ?? (
						<>
							<CalendarHeader>
								<Button slot="previous" variant="quiet" size="icon">
									<ChevronLeftIcon />
								</Button>
								<CalendarHeading />
								<Button slot="next" variant="quiet" size="icon">
									<ChevronRightIcon />
								</Button>
							</CalendarHeader>
							<CalendarGrid />
						</>
					)}
				</>
			))}
		</AriaCalendar>
	);
};

// MARK: seperator

interface RangeCalendarProps<T extends DateValue> extends AriaRangeCalendarProps<T> {}

const RangeCalendar = <T extends DateValue>({ className, ...props }: RangeCalendarProps<T>) => {
	const { root } = useStyles()();

	return (
		<AriaRangeCalendar
			data-range-calendar=""
			className={composeRenderProps(className, (className) => root({ className }))}
			{...props}
		>
			{composeRenderProps(props.children, (children) => (
				<CalendarPickerBridge>
					{children ?? (
						<>
							<CalendarHeader>
								<Button slot="previous" variant="quiet" size="icon">
									<ChevronLeftIcon />
								</Button>
								<CalendarHeading />
								<Button slot="next" variant="quiet" size="icon">
									<ChevronRightIcon />
								</Button>
							</CalendarHeader>
							<CalendarGrid />
						</>
					)}
				</CalendarPickerBridge>
			))}
		</AriaRangeCalendar>
	);
};

// MARK: seperator

interface CalendarHeaderProps extends React.ComponentProps<"header"> {}

const CalendarHeader = ({ className, ...props }: CalendarHeaderProps) => {
	const { header } = useStyles()();
	return (
		<header className={header({ className })} {...props}>
			{props.children ?? (
				<>
					<Button slot="previous" variant="quiet" size="icon">
						<ChevronLeftIcon />
					</Button>
					<CalendarHeading />
					<Button slot="next" variant="quiet" size="icon">
						<ChevronRightIcon />
					</Button>
				</>
			)}
		</header>
	);
};

// MARK: seperator

interface CalendarHeadingProps extends React.ComponentProps<typeof AriaHeading> {}
const CalendarHeading = ({ className, ...props }: CalendarHeadingProps) => {
	const { heading } = useStyles()();
	return <AriaHeading className={heading({ className })} {...props} />;
};

// MARK: seperator

interface CalendarGridProps extends React.ComponentProps<typeof AriaCalendarGrid> {}

const CalendarGrid = ({ className, children, ...props }: CalendarGridProps) => {
	const { grid } = useStyles()();
	return (
		<AriaCalendarGrid className={grid({ className })} {...props}>
			{children ?? (
				<>
					<CalendarGridHeader>{(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}</CalendarGridHeader>
					<CalendarGridBody>{(date) => <CalendarCell date={date} />}</CalendarGridBody>
				</>
			)}
		</AriaCalendarGrid>
	);
};

// MARK: seperator

interface CalendarGridHeaderProps extends React.ComponentProps<typeof AriaCalendarGridHeader> {}
const CalendarGridHeader = ({ className, ...props }: CalendarGridHeaderProps) => {
	const { gridHeader } = useStyles()();
	return <AriaCalendarGridHeader className={gridHeader({ className })} {...props} />;
};

// MARK: seperator

interface CalendarHeaderCellProps extends React.ComponentProps<typeof AriaCalendarHeaderCell> {}
const CalendarHeaderCell = ({ className, ...props }: CalendarHeaderCellProps) => {
	const { gridHeaderCell } = useStyles()();
	return <AriaCalendarHeaderCell className={gridHeaderCell({ className })} {...props} />;
};

// MARK: seperator

interface CalendarGridBodyProps extends React.ComponentProps<typeof AriaCalendarGridBody> {}
const CalendarGridBody = ({ className, ...props }: CalendarGridBodyProps) => {
	const { gridBody } = useStyles()();
	return <AriaCalendarGridBody className={gridBody({ className })} {...props} />;
};

// MARK: seperator

interface CalendarCellProps extends React.ComponentProps<typeof AriaCalendarCell> {}
const CalendarCell = ({ className, ...props }: CalendarCellProps) => {
	const { cell, cellInner } = useStyles()();

	return (
		<AriaCalendarCell
			className={composeRenderProps(className, (className) =>
				cell({
					className,
				}),
			)}
			{...props}
		>
			{composeRenderProps(props.children, (children, { formattedDate }) => (
				<span data-cell-inner="" className={cellInner()}>
					{children ?? formattedDate}
				</span>
			))}
		</AriaCalendarCell>
	);
};

// MARK: seperator

// ============================================================================
// APPROACH A: Slotted SelectContext bridge
// ----------------------------------------------------------------------------
// Calendar internally provides SelectContext with "month-picker" and
// "year-picker" slots. Consumers render <Select slot="month-picker"> and
// supply their own items. Zero per-Calendar state wiring.
// ============================================================================

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
] as const;

const useCalendarFocusedDate = () => {
	const calendarState = React.useContext(CalendarStateContext);
	const rangeState = React.useContext(RangeCalendarStateContext);
	return calendarState ?? rangeState;
};

interface CalendarPickerBridgeProps {
	children?: React.ReactNode;
}

const CalendarPickerBridge = ({ children }: CalendarPickerBridgeProps) => {
	const state = useCalendarFocusedDate();

	if (!state) return <>{children}</>;

	const focused = state.focusedDate;

	const selectContextValue = {
		slots: {
			"month-picker": {
				"aria-label": "Month",
				selectedKey: String(focused.month),
				onSelectionChange: (key: Key | null) => {
					if (key == null) return;
					state.setFocusedDate(focused.set({ month: Number(key) }));
				},
			},
			"year-picker": {
				"aria-label": "Year",
				selectedKey: String(focused.year),
				onSelectionChange: (key: Key | null) => {
					if (key == null) return;
					state.setFocusedDate(focused.set({ year: Number(key) }));
				},
			},
		},
	};

	return <Provider values={[[SelectContext, selectContextValue as never]]}>{children}</Provider>;
};

// MARK: seperator

// ============================================================================
// APPROACH B: Dedicated picker components
// ----------------------------------------------------------------------------
// CalendarMonthPicker and CalendarYearPicker read CalendarStateContext
// directly and render a fully-configured Select. Zero-config for consumers.
// ============================================================================

interface CalendarMonthPickerProps
	extends Omit<SelectProps<object>, "selectedKey" | "onSelectionChange" | "children" | "items"> {
	monthNames?: readonly string[];
}

const CalendarMonthPicker = ({
	monthNames = MONTHS,
	"aria-label": ariaLabel = "Month",
	...props
}: CalendarMonthPickerProps) => {
	const state = useCalendarFocusedDate();
	if (!state) return null;
	const focused = state.focusedDate;

	return (
		<Select
			slot={null}
			aria-label={ariaLabel}
			selectedKey={String(focused.month)}
			onSelectionChange={(key) => {
				if (key == null) return;
				state.setFocusedDate(focused.set({ month: Number(key) }));
			}}
			{...props}
		>
			<SelectTrigger slot={null} />
			<SelectContent>
				{monthNames.map((name, i) => (
					<SelectItem key={i + 1} id={String(i + 1)}>
						{name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

interface CalendarYearPickerProps
	extends Omit<SelectProps<object>, "selectedKey" | "onSelectionChange" | "children" | "items"> {
	yearsBefore?: number;
	yearsAfter?: number;
}

const CalendarYearPicker = ({
	yearsBefore = 10,
	yearsAfter = 10,
	"aria-label": ariaLabel = "Year",
	...props
}: CalendarYearPickerProps) => {
	const state = useCalendarFocusedDate();
	if (!state) return null;
	const focused = state.focusedDate;
	const years = Array.from({ length: yearsBefore + yearsAfter + 1 }, (_, i) => focused.year - yearsBefore + i);

	return (
		<Select
			slot={null}
			aria-label={ariaLabel}
			selectedKey={String(focused.year)}
			onSelectionChange={(key) => {
				if (key == null) return;
				state.setFocusedDate(focused.set({ year: Number(key) }));
			}}
			{...props}
		>
			<SelectTrigger slot={null} />
			<SelectContent>
				{years.map((y) => (
					<SelectItem key={y} id={String(y)}>
						{y}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

// MARK: seperator

export type {
	CalendarCellProps,
	CalendarGridBodyProps,
	CalendarGridHeaderProps,
	CalendarGridProps,
	CalendarHeaderCellProps,
	CalendarHeaderProps,
	CalendarHeadingProps,
	CalendarMonthPickerProps,
	CalendarProps,
	CalendarYearPickerProps,
	RangeCalendarProps,
};
export {
	Calendar,
	CalendarCell,
	CalendarGrid,
	CalendarGridBody,
	CalendarGridHeader,
	CalendarHeader,
	CalendarHeaderCell,
	CalendarHeading,
	CalendarMonthPicker,
	CalendarYearPicker,
	RangeCalendar,
};
