"use client";

import { Keyboard as AriaKeyboard } from "react-aria-components";

import { useStyles } from "./styles";

// MARK: kbdStyles

// MARK: KbdGroup

interface KbdGroupProps extends React.HTMLAttributes<HTMLElement> {}

const KbdGroup = ({ className, ...props }: KbdGroupProps) => {
	const { group } = useStyles()();
	return <kbd className={group({ className })} {...props} />;
};

// MARK: Kbd

interface KbdProps extends React.ComponentProps<typeof AriaKeyboard> {}

const Kbd = ({ className, ...props }: KbdProps) => {
	const { kbd } = useStyles()();
	return <AriaKeyboard className={kbd({ className })} {...props} />;
};

// MARK: separator

export { KbdGroup, Kbd };
export type { KbdProps, KbdGroupProps };
