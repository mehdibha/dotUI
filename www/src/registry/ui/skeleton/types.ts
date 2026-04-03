/**
 * Missing description.
 */
export interface SkeletonProviderProps {
	children: React.ReactNode;
	/**
	 * Whether the skeleton loading state is active.
	 */
	isLoading?: boolean;
}

/**
 * Missing description.
 */
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
	/**
	 * Whether to show the skeleton. When false, renders children directly.
	 * @default true
	 */
	show?: boolean;
}
