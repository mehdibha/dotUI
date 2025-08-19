"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { fakeData, formSchema, type StyleFormData } from "./schema";

export function useStyleForm(style?: Partial<StyleFormData> | null) {
	const form = useForm<StyleFormData>({
		resolver: zodResolver(formSchema),
		defaultValues: fakeData,
		values: style ? { ...(style as any), slug: (style as any).name } : undefined,
	});
	return form;
}

export type { StyleFormData };

