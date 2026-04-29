"use client";

import { useCallback, useMemo } from "react";
import { getRouteApi } from "@tanstack/react-router";

import { decodePreset, encodePreset } from "./codec";
import { DEFAULTS } from "./defaults";
import type { Density, DesignSystem } from "./types";

const routeApi = getRouteApi("/_app/create");

export function useDesignSystem() {
	const { preset } = routeApi.useSearch();
	const navigate = routeApi.useNavigate();

	const designSystem: DesignSystem = useMemo(() => {
		if (!preset) return DEFAULTS;
		return decodePreset(preset);
	}, [preset]);

	const setDesignSystem = useCallback(
		(updater: DesignSystem | ((prev: DesignSystem) => DesignSystem)) => {
			const next = typeof updater === "function" ? updater(designSystem) : updater;
			const encoded = encodePreset(next);
			navigate({
				search: (prev) => ({ ...prev, preset: encoded }),
				replace: true,
			});
		},
		[designSystem, navigate],
	);

	const setComponentStyle = useCallback(
		(componentName: string, style: string) => {
			setDesignSystem((prev) => ({
				...prev,
				componentStyles: { ...prev.componentStyles, [componentName]: style },
			}));
		},
		[setDesignSystem],
	);

	const setComponentToken = useCallback(
		(tokenName: string, value: string) => {
			setDesignSystem((prev) => ({
				...prev,
				componentTokens: { ...prev.componentTokens, [tokenName]: value },
			}));
		},
		[setDesignSystem],
	);

	const setComponentParam = useCallback(
		(componentName: string, paramName: string, value: string) => {
			setDesignSystem((prev) => ({
				...prev,
				componentParams: {
					...prev.componentParams,
					[componentName]: { ...(prev.componentParams[componentName] ?? {}), [paramName]: value },
				},
			}));
		},
		[setDesignSystem],
	);

	const setDensity = useCallback(
		(density: Density) => {
			setDesignSystem((prev) => ({ ...prev, density }));
		},
		[setDesignSystem],
	);

	return { designSystem, setDesignSystem, setComponentStyle, setComponentToken, setComponentParam, setDensity };
}
