"use client";

import { getLocalTimeZone, today } from "@internationalized/date";
import { I18nProvider } from "react-aria-components";

import { Calendar } from "@/registry/ui/calendar";

export default function Demo() {
	return (
		<I18nProvider locale="ar-EG">
			<Calendar aria-label="التاريخ" defaultValue={today(getLocalTimeZone())} />
		</I18nProvider>
	);
}
