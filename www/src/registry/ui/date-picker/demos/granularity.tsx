"use client";

import { parseAbsoluteToLocal } from "@internationalized/date";

import { CalendarIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import { Calendar } from "@/registry/ui/calendar";
import { DatePicker } from "@/registry/ui/date-picker";
import { DialogContent } from "@/registry/ui/dialog";
import { Label } from "@/registry/ui/field";
import { DateInput, InputAddon, InputGroup } from "@/registry/ui/input";
import { Overlay } from "@/registry/ui/overlay";

export default function Demo() {
	return (
		<div className="flex flex-col items-center gap-4">
			<DatePicker granularity="hour" defaultValue={parseAbsoluteToLocal("2021-04-07T18:45:22Z")}>
				<Label>Hour</Label>
				<InputGroup>
					<DateInput />
					<InputAddon>
						<Button variant="default" size="icon-sm">
							<CalendarIcon />
						</Button>
					</InputAddon>
				</InputGroup>
				<Overlay type="popover" mobileType="drawer">
					<DialogContent>
						<Calendar />
					</DialogContent>
				</Overlay>
			</DatePicker>

			<DatePicker granularity="minute" defaultValue={parseAbsoluteToLocal("2021-04-07T18:45:22Z")}>
				<Label>Minute</Label>
				<InputGroup>
					<DateInput />
					<InputAddon>
						<Button variant="default" size="icon-sm">
							<CalendarIcon />
						</Button>
					</InputAddon>
				</InputGroup>
				<Overlay type="popover" mobileType="drawer">
					<DialogContent>
						<Calendar />
					</DialogContent>
				</Overlay>
			</DatePicker>

			<DatePicker granularity="second" defaultValue={parseAbsoluteToLocal("2021-04-07T18:45:22Z")}>
				<Label>Second</Label>
				<InputGroup>
					<DateInput />
					<InputAddon>
						<Button variant="default" size="icon-sm">
							<CalendarIcon />
						</Button>
					</InputAddon>
				</InputGroup>
				<Overlay type="popover" mobileType="drawer">
					<DialogContent>
						<Calendar />
					</DialogContent>
				</Overlay>
			</DatePicker>
		</div>
	);
}
