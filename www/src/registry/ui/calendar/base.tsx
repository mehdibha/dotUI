"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import * as CalendarPrimitives from "react-aria-components/Calendar";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as RangeCalendarPrimitives from "react-aria-components/RangeCalendar";
import type React from "react";

import { Button } from "@/registry/ui/button";

import { useStyles } from "./styles";

// MARK: calendarStyles

// MARK: seperator

interface CalendarProps<T extends CalendarPrimitives.DateValue> extends CalendarPrimitives.CalendarProps<T> {}
const Calendar = <T extends CalendarPrimitives.DateValue>({ className, ...props }: CalendarProps<T>) => {
	const { root } = useStyles()();
	return (
		<CalendarPrimitives.Calendar
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
		</CalendarPrimitives.Calendar>
	);
};

// MARK: seperator

interface RangeCalendarProps<T extends CalendarPrimitives.DateValue>
	extends RangeCalendarPrimitives.RangeCalendarProps<T> {}
const RangeCalendar = <T extends CalendarPrimitives.DateValue>({ className, ...props }: RangeCalendarProps<T>) => {
	const { root } = useStyles()();
	return (
		<RangeCalendarPrimitives.RangeCalendar
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
		</RangeCalendarPrimitives.RangeCalendar>
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

interface CalendarHeadingProps extends React.ComponentProps<typeof CalendarPrimitives.Heading> {}
const CalendarHeading = ({ className, ...props }: CalendarHeadingProps) => {
	const { heading } = useStyles()();
	return <CalendarPrimitives.Heading data-calendar-heading="" className={heading({ className })} {...props} />;
};

// MARK: seperator

interface CalendarGridProps extends React.ComponentProps<typeof CalendarPrimitives.CalendarGrid> {}
const CalendarGrid = ({ className, children, ...props }: CalendarGridProps) => {
	const { grid } = useStyles()();
	return (
		<CalendarPrimitives.CalendarGrid data-calendar-grid="" className={grid({ className })} {...props}>
			{children ?? (
				<>
					<CalendarGridHeader>{(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}</CalendarGridHeader>
					<CalendarGridBody>{(date) => <CalendarCell date={date} />}</CalendarGridBody>
				</>
			)}
		</CalendarPrimitives.CalendarGrid>
	);
};

// MARK: seperator

interface CalendarGridHeaderProps extends React.ComponentProps<typeof CalendarPrimitives.CalendarGridHeader> {}
const CalendarGridHeader = ({ className, ...props }: CalendarGridHeaderProps) => {
	const { gridHeader } = useStyles()();
	return (
		<CalendarPrimitives.CalendarGridHeader
			data-calendar-grid-header=""
			className={gridHeader({ className })}
			{...props}
		/>
	);
};

// MARK: seperator

interface CalendarHeaderCellProps extends React.ComponentProps<typeof CalendarPrimitives.CalendarHeaderCell> {}
const CalendarHeaderCell = ({ className, ...props }: CalendarHeaderCellProps) => {
	const { gridHeaderCell } = useStyles()();
	return (
		<CalendarPrimitives.CalendarHeaderCell
			data-calendar-header-cell=""
			className={gridHeaderCell({ className })}
			{...props}
		/>
	);
};

// MARK: seperator

interface CalendarGridBodyProps extends React.ComponentProps<typeof CalendarPrimitives.CalendarGridBody> {}
const CalendarGridBody = ({ className, ...props }: CalendarGridBodyProps) => {
	const { gridBody } = useStyles()();
	return (
		<CalendarPrimitives.CalendarGridBody data-calendar-grid-body="" className={gridBody({ className })} {...props} />
	);
};

// MARK: seperator

interface CalendarCellProps extends React.ComponentProps<typeof CalendarPrimitives.CalendarCell> {}
const CalendarCell = ({ className, ...props }: CalendarCellProps) => {
	const { cell, cellInner } = useStyles()();
	return (
		<CalendarPrimitives.CalendarCell
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
		</CalendarPrimitives.CalendarCell>
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
