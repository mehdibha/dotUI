"use client";

interface StyleProviderProps extends Omit<React.ComponentProps<"div">, "style"> {
	style: any;
}

export function StyleProvider({ children }: { children: React.ReactNode }) {
	return <div>{children}</div>;
}
