"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import * as CalendarPrimitive from "react-aria-components/Calendar";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as RangeCalendarPrimitive from "react-aria-components/RangeCalendar";
import type React from "react";

import { Button } from "@/registry/ui/button";

import { useStyles } from "./styles";

// MARK: calendarStyles

// MARK: seperator

interface CalendarProps<T extends CalendarPrimitive.DateValue> extends CalendarPrimitive.CalendarProps<T> {}
const Calendar = <T extends CalendarPrimitive.DateValue>({ className, ...props }: CalendarProps<T>) => {
	const { root } = useStyles()();
	return (
		<CalendarPrimitive.Calendar
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
		</CalendarPrimitive.Calendar>
	);
};

// MARK: seperator

interface RangeCalendarProps<T extends CalendarPrimitive.DateValue>
	extends RangeCalendarPrimitive.RangeCalendarProps<T> {}
const RangeCalendar = <T extends CalendarPrimitive.DateValue>({ className, ...props }: RangeCalendarProps<T>) => {
	const { root } = useStyles()();
	return (
		<RangeCalendarPrimitive.RangeCalendar
			data-range-calendar=""
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
		</RangeCalendarPrimitive.RangeCalendar>
	);
};

// MARK: seperator

interface CalendarHeaderProps extends React.ComponentProps<"header"> {}
const CalendarHeader = ({ className, ...props }: CalendarHeaderProps) => {
	const { header } = useStyles()();
	return (
		<header data-calendar-header="" className={header({ className })} {...props}>
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

interface CalendarHeadingProps extends React.ComponentProps<typeof CalendarPrimitive.Heading> {}
const CalendarHeading = ({ className, ...props }: CalendarHeadingProps) => {
	const { heading } = useStyles()();
	return <CalendarPrimitive.Heading data-calendar-heading="" className={heading({ className })} {...props} />;
};

// MARK: seperator

interface CalendarGridProps extends React.ComponentProps<typeof CalendarPrimitive.CalendarGrid> {}
const CalendarGrid = ({ className, children, ...props }: CalendarGridProps) => {
	const { grid } = useStyles()();
	return (
		<CalendarPrimitive.CalendarGrid data-calendar-grid="" className={grid({ className })} {...props}>
			{children ?? (
				<>
					<CalendarGridHeader>{(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}</CalendarGridHeader>
					<CalendarGridBody>{(date) => <CalendarCell date={date} />}</CalendarGridBody>
				</>
			)}
		</CalendarPrimitive.CalendarGrid>
	);
};

// MARK: seperator

interface CalendarGridHeaderProps extends React.ComponentProps<typeof CalendarPrimitive.CalendarGridHeader> {}
const CalendarGridHeader = ({ className, ...props }: CalendarGridHeaderProps) => {
	const { gridHeader } = useStyles()();
	return (
		<CalendarPrimitive.CalendarGridHeader
			data-calendar-grid-header=""
			className={gridHeader({ className })}
			{...props}
		/>
	);
};

// MARK: seperator

interface CalendarHeaderCellProps extends React.ComponentProps<typeof CalendarPrimitive.CalendarHeaderCell> {}
const CalendarHeaderCell = ({ className, ...props }: CalendarHeaderCellProps) => {
	const { gridHeaderCell } = useStyles()();
	return (
		<CalendarPrimitive.CalendarHeaderCell
			data-calendar-header-cell=""
			className={gridHeaderCell({ className })}
			{...props}
		/>
	);
};

// MARK: seperator

interface CalendarGridBodyProps extends React.ComponentProps<typeof CalendarPrimitive.CalendarGridBody> {}
const CalendarGridBody = ({ className, ...props }: CalendarGridBodyProps) => {
	const { gridBody } = useStyles()();
	return (
		<CalendarPrimitive.CalendarGridBody data-calendar-grid-body="" className={gridBody({ className })} {...props} />
	);
};

// MARK: seperator

interface CalendarCellProps extends React.ComponentProps<typeof CalendarPrimitive.CalendarCell> {}
const CalendarCell = ({ className, ...props }: CalendarCellProps) => {
	const { cell, cellInner } = useStyles()();
	return (
		<CalendarPrimitive.CalendarCell
			data-calendar-cell=""
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
		</CalendarPrimitive.CalendarCell>
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
	CalendarHeading,
	RangeCalendar,
};
