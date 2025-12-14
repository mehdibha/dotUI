"use client";

import React from "react";
import type { ContrastColor } from "@adobe/leonardo-contrast-colors";
import type z from "zod/v4";

import { createStyleSchema } from "@dotui/db/schemas";
import { DEFAULT_STYLE } from "@dotui/registry/constants";
import { useAppForm } from "@dotui/registry/ui/tanstack-form";
import { toast } from "@dotui/registry/ui/toast";
import { createColorScales } from "@dotui/style-system/core";
import { DEFAULT_LIGHT_MODE } from "@dotui/style-system/utils";

import { NavigationBlocker } from "@/modules/style-editor/navigation-blocker";
import { useEditorStyle } from "@/modules/style-editor/use-editor-style";
import { useResolvedModeState } from "@/modules/style-editor/use-resolved-mode";
import { useStyleEditorParams } from "@/modules/style-editor/use-style-editor-params";
import { useUpdateStyleMutation } from "@/modules/style-editor/use-update-style-mutation";

import { convertThemeColorObjects } from "./theme-utils";

const styleEditorFormSchema = createStyleSchema.extend({});

export type StyleFormData = z.infer<typeof styleEditorFormSchema>;

const defaultValues = {
	name: "random-fake",
	...DEFAULT_STYLE,
} as StyleFormData;

const useForm = () => {
	const { data: style, refetch } = useEditorStyle();
	const { slug } = useStyleEditorParams();

	const updateStyleMutation = useUpdateStyleMutation(
		{
			styleId: style?.id,
			slug,
		},
		{
			onError: () => {
				toast.add({
					title: "Failed to update style",
					variant: "danger",
				});
			},
		},
	);

	return useAppForm({
		defaultValues: (style as StyleFormData | undefined) ?? defaultValues,
		validators: {
			onSubmit: styleEditorFormSchema,
		},

		onSubmit: async ({ formApi, value }) => {
			await updateStyleMutation.mutateAsync({
				...value,
				theme: convertThemeColorObjects(value.theme) as StyleFormData["theme"],
			});
			await refetch();
			formApi.reset();
		},
	});
};

const StyleEditorFormContext = React.createContext<ReturnType<typeof useForm> | null>(null);

export function StyleEditorProvider({ children }: { children: React.ReactNode }) {
	const form = useForm();

	return (
		<StyleEditorFormContext value={form}>
			<NavigationBlocker />
			<GeneratedThemeProvider>{children}</GeneratedThemeProvider>
		</StyleEditorFormContext>
	);
}

// Overload signatures
export function useStyleEditorForm(disableWarning: true): ReturnType<typeof useForm> | null;
export function useStyleEditorForm(disableWarning?: false): ReturnType<typeof useForm>;

export function useStyleEditorForm(disableWarning = false) {
	const context = React.use(StyleEditorFormContext);
	if (!context && !disableWarning) {
		throw new Error("useStyleEditorForm must be used within a StyleEditorFormProvider");
	}
	return context;
}

type GeneratedTheme = ContrastColor[];

const defaultGeneratedTheme: GeneratedTheme = createColorScales({
	lightness: DEFAULT_LIGHT_MODE.lightness,
	saturation: DEFAULT_LIGHT_MODE.saturation,
	contrast: DEFAULT_LIGHT_MODE.contrast,
	neutralScale: DEFAULT_LIGHT_MODE.scales.neutral,
	scales: Object.values(DEFAULT_LIGHT_MODE.scales),
});

const GeneratedThemeContext = React.createContext<GeneratedTheme>(defaultGeneratedTheme);

const SyncThemeContext = React.createContext<() => void>(() => {});

export function GeneratedThemeProvider({ children }: { children: React.ReactNode }) {
	const { isSuccess } = useEditorStyle();
	const form = useStyleEditorForm();
	const [generatedTheme, setGeneratedTheme] = React.useState<GeneratedTheme>(defaultGeneratedTheme);
	const { resolvedMode } = useResolvedModeState();

	const syncTheme = React.useCallback(() => {
		const generatedTheme = createColorScales({
			lightness: form.getFieldValue(`theme.colors.modes.${resolvedMode}.lightness`),
			saturation: form.getFieldValue(`theme.colors.modes.${resolvedMode}.saturation`),
			contrast: form.getFieldValue(`theme.colors.modes.${resolvedMode}.contrast`),
			neutralScale: form.getFieldValue(`theme.colors.modes.${resolvedMode}.scales.neutral`),
			scales: Object.values(form.getFieldValue(`theme.colors.modes.${resolvedMode}.scales`)),
		});
		setGeneratedTheme(generatedTheme);
	}, [form, resolvedMode]);

	React.useEffect(() => {
		if (isSuccess) {
			syncTheme();
		}
	}, [isSuccess, syncTheme]);

	return (
		<SyncThemeContext value={syncTheme}>
			<GeneratedThemeContext value={generatedTheme}>{children}</GeneratedThemeContext>
		</SyncThemeContext>
	);
}

export const useGeneratedTheme = () => {
	const ctx = React.use(GeneratedThemeContext);
	if (!ctx) {
		throw new Error("useGeneratedTheme must be used within a GeneratedThemeProvider");
	}
	return ctx;
};

export const useSyncTheme = () => {
	const ctx = React.use(SyncThemeContext);
	if (!ctx) {
		throw new Error("useSyncTheme must be used within a GeneratedThemeProvider");
	}
	return ctx;
};

export const StyleEditorForm = ({ children }: { children: React.ReactNode }) => {
	const form = useStyleEditorForm();
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
		>
			{children}
		</form>
	);
};
