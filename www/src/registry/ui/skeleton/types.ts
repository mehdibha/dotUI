/**
 * Missing description.
 */
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
	/**
	 * Whether to show the skeleton loading state. When false, renders children directly.
	 */
	isLoading?: boolean;
	/**
	 * Whether to show the skeleton. When false, renders children directly.
	 * @default true
	 */
	show?: boolean;
}
