"use client";

import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
	Calendar as AriaCalendar,
	CalendarCell as AriaCalendarCell,
	CalendarContext as AriaCalendarContext,
	CalendarGrid as AriaCalendarGrid,
	CalendarGridBody as AriaCalendarGridBody,
	CalendarGridHeader as AriaCalendarGridHeader,
	CalendarHeaderCell as AriaCalendarHeaderCell,
	Heading as AriaHeading,
	RangeCalendar as AriaRangeCalendar,
	RangeCalendarContext as AriaRangeCalendarContext,
	RangeCalendarStateContext as AriaRangeCalendarStateContext,
	composeRenderProps,
	useSlottedContext,
} from "react-aria-components";
import type {
	CalendarProps as AriaCalendarProps,
	RangeCalendarProps as AriaRangeCalendarProps,
	DateValue,
} from "react-aria-components";
import type { VariantProps } from "tailwind-variants";

import { Button } from "@/registry/ui/button";

import { calendarStyles, useCellStyles, useStyles } from "./styles";
import type { CalendarCellStyles } from "./styles";

// MARK: calendarStyles

// MARK: Calendar

interface CalendarProps<T extends DateValue> extends AriaCalendarProps<T> {}

const Calendar = <T extends DateValue>({ className, ...props }: CalendarProps<T>) => {
	const { root } = useStyles()();
	const calendarContext = useSlottedContext(AriaCalendarContext);
	const standalone = !calendarContext;

	return (
		<AriaCalendar
			className={composeRenderProps(className, (className) => root({ standalone, className }))}
			{...props}
		>
			{composeRenderProps(
				props.children,
				(children) =>
					children ?? (
						<>
							<CalendarHeader />
							<CalendarGrid />
						</>
					),
			)}
		</AriaCalendar>
	);
};

// MARK: RangeCalendar

interface RangeCalendarProps<T extends DateValue> extends AriaRangeCalendarProps<T> {}

const RangeCalendar = <T extends DateValue>({ className, ...props }: RangeCalendarProps<T>) => {
	const { root } = useStyles()();
	const rangeCalendarContext = useSlottedContext(AriaRangeCalendarContext);
	const standalone = Object.keys(rangeCalendarContext ?? {}).length === 0;

	return (
		<AriaRangeCalendar
			className={composeRenderProps(className, (className) => root({ standalone, className }))}
			{...props}
		>
			{composeRenderProps(
				props.children,
				(children) =>
					children ?? (
						<>
							<CalendarHeader />
							<CalendarGrid />
						</>
					),
			)}
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
					<Button slot="previous" variant="default" size="icon-sm">
						<ChevronLeftIcon />
					</Button>
					<AriaHeading className="font-medium text-sm" />
					<Button slot="next" variant="default" size="icon-sm">
						<ChevronRightIcon />
					</Button>
				</>
			)}
		</header>
	);
};

// MARK: seperator

interface CalendarGridProps extends React.ComponentProps<typeof AriaCalendarGrid> {}

const CalendarGrid = ({ className, ...props }: CalendarGridProps) => {
	const { grid } = useStyles()();
	return (
		<AriaCalendarGrid className={grid({ className })} {...props}>
			{props.children ?? (
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

interface CalendarCellProps
	extends React.ComponentProps<typeof AriaCalendarCell>,
		Omit<VariantProps<CalendarCellStyles>, "range"> {}
const CalendarCell = ({ variant = "accent", children, className, ...props }: CalendarCellProps) => {
	const { cellRoot, cell } = useCellStyles()();
	const rangeCalendarState = React.use(AriaRangeCalendarStateContext);
	const range = !!rangeCalendarState;

	return (
		<AriaCalendarCell
			{...props}
			className={composeRenderProps(className, (className) =>
				cellRoot({
					range,
					variant,
					className,
				}),
			)}
		>
			{composeRenderProps(
				children,
				(
					_,
					{
						isSelected,
						isFocused,
						isHovered,
						isPressed,
						isUnavailable,
						isDisabled,
						isFocusVisible,
						isInvalid,
						isOutsideMonth,
						isOutsideVisibleRange,
						isSelectionEnd,
						isSelectionStart,
						formattedDate,
					},
				) => (
					<span
						data-slot="calendar-cell"
						data-rac=""
						data-focused={isFocused || undefined}
						data-selected={isSelected || undefined}
						data-hovered={isHovered || undefined}
						data-pressed={isPressed || undefined}
						data-unavailable={isUnavailable || undefined}
						data-disabled={isDisabled || undefined}
						data-focus-visible={isFocusVisible || undefined}
						data-invalid={isInvalid || undefined}
						data-outside-month={isOutsideMonth || undefined}
						data-outside-visible-range={isOutsideVisibleRange || undefined}
						data-selection-end={isSelectionEnd || undefined}
						data-selection-start={isSelectionStart || undefined}
						className={cell({
							range,
							variant,
						})}
					>
						{formattedDate}
					</span>
				),
			)}
		</AriaCalendarCell>
	);
};

export type {
	CalendarCellProps,
	CalendarGridBodyProps,
	CalendarGridHeaderProps,
	CalendarGridProps,
	CalendarHeaderCellProps,
	CalendarHeaderProps,
	CalendarProps,
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
	RangeCalendar,
	calendarStyles,
};
