export const createDynamicComponent = <Props extends Record<string, unknown>>(
	componentName: string,
	slotName: string,
	DefaultComponent: React.FC<Props>,
	variants: Record<string, React.FC<Props>>,
) => {
	return (props: Props) => {
		return <DefaultComponent {...props} />;
	};
};
