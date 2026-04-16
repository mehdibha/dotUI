"use client";

import * as KeyboardPrimitives from "react-aria-components/Keyboard";

import { useStyles } from "./styles";

// MARK: kbdStyles

// MARK: KbdGroup

interface KbdGroupProps extends React.HTMLAttributes<HTMLElement> {}

const KbdGroup = ({ className, ...props }: KbdGroupProps) => {
	const { group } = useStyles()();
	return <kbd className={group({ className })} {...props} />;
};

// MARK: Kbd

interface KbdProps extends React.ComponentProps<typeof KeyboardPrimitives.Keyboard> {}

const Kbd = ({ className, ...props }: KbdProps) => {
	const { kbd } = useStyles()();
	return <KeyboardPrimitives.Keyboard className={kbd({ className })} {...props} />;
};

// MARK: separator

export type { KbdGroupProps, KbdProps };
export { Kbd, KbdGroup };
