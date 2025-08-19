"use client";

import React from "react";
import { useWatch, type UseFormReturn } from "react-hook-form";

import { useDebounce } from "@/hooks/use-debounce";
import { useLiveStyleProducer } from "@/modules/styles/atoms/live-style-atom";

import type { StyleFormData } from "./schema";

export function useLivePreviewSync(
	form: UseFormReturn<StyleFormData>,
	styleKey: string,
	shouldSync: boolean,
) {
	const { updateLiveStyle } = useLiveStyleProducer(styleKey);
	const watchedValues = useWatch({ control: form.control }) as
		| StyleFormData
		| undefined;
	const debounced = useDebounce(watchedValues, 30);

	React.useEffect(() => {
		if (shouldSync && debounced) {
			updateLiveStyle(debounced);
		}
	}, [debounced, shouldSync, updateLiveStyle]);
}

