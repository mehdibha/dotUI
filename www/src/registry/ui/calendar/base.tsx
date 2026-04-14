"use client";

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
	composeRenderProps,
} from "react-aria-components";
import type React from "react";
import type {
	CalendarProps as AriaCalendarProps,
	RangeCalendarProps as AriaRangeCalendarProps,
	DateValue,
} from "react-aria-components";

import { Button } from "@/registry/ui/button";

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
			{composeRenderProps(
				props.children,
				(children) =>
					children ?? (
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
							<CalendarGrid>
								<CalendarGridHeader>{(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}</CalendarGridHeader>
								<CalendarGridBody>{(date) => <CalendarCell date={date} />}</CalendarGridBody>
							</CalendarGrid>
						</>
					),
			)}
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
			{composeRenderProps(
				props.children,
				(children) =>
					children ?? (
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
							<CalendarGrid>
								<CalendarGridHeader>{(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}</CalendarGridHeader>
								<CalendarGridBody>{(date) => <CalendarCell date={date} />}</CalendarGridBody>
							</CalendarGrid>
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
	return <header className={header({ className })} {...props} />;
};

// MARK: seperator

interface CalendarHeadingProps extends React.ComponentProps<typeof AriaHeading> {}
const CalendarHeading = ({ className, ...props }: CalendarHeadingProps) => {
	const { heading } = useStyles()();
	return <AriaHeading className={heading({ className })} {...props} />;
};

// MARK: seperator

interface CalendarGridProps extends React.ComponentProps<typeof AriaCalendarGrid> {}

const CalendarGrid = ({ className, ...props }: CalendarGridProps) => {
	const { grid } = useStyles()();
	return <AriaCalendarGrid className={grid({ className })} {...props} />;
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
