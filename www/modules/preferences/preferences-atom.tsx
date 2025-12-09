import React from "react";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { withImmer } from "jotai-immer";

interface State {
	activeStyleId: string | null;
	activeMode: "light" | "dark";
	packageManager: "npm" | "yarn" | "pnpm" | "bun";
}

const preferencesAtom = withImmer(
	atomWithStorage<State>("user-preferences", {
		activeStyleId: null,
		activeMode: "dark",
		packageManager: "pnpm",
	}),
);

export const usePreferences = () => {
	const [state, setState] = useAtom(preferencesAtom);

	const activeMode = React.useMemo(() => {
		return state.activeMode;
	}, [state.activeMode]);

	const setActiveMode = (mode: "light" | "dark") => {
		setState((draft) => {
			draft.activeMode = mode;
		});
	};

	const activeStyleId = React.useMemo(() => {
		return state.activeStyleId;
	}, [state.activeStyleId]);

	const setActiveStyleId = (styleSlug: string) => {
		setState((draft) => {
			draft.activeStyleId = styleSlug;
		});
	};

	const packageManager = React.useMemo(() => {
		return state.packageManager;
	}, [state.packageManager]);

	const setPackageManager = (manager: "npm" | "yarn" | "pnpm" | "bun") => {
		setState((draft) => {
			draft.packageManager = manager;
		});
	};

	return {
		activeMode,
		setActiveMode,
		activeStyleId,
		setActiveStyleId,
		packageManager,
		setPackageManager,
	};
};
