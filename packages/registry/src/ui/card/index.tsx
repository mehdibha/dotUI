"use client";

import { createDynamicComponent } from "@dotui/core/utils/create-dynamic-component";

import * as Default from "./basic";
import type {
	CardActionProps,
	CardContentProps,
	CardDescriptionProps,
	CardFooterProps,
	CardHeaderProps,
	CardProps,
	CardTitleProps,
} from "./types";

export const Card = createDynamicComponent<CardProps>("card", "Card", Default.Card, {});

export const CardHeader = createDynamicComponent<CardHeaderProps>("card", "CardHeader", Default.CardHeader, {});

export const CardTitle = createDynamicComponent<CardTitleProps>("card", "CardTitle", Default.CardTitle, {});

export const CardDescription = createDynamicComponent<CardDescriptionProps>(
	"card",
	"CardDescription",
	Default.CardDescription,
	{},
);

export const CardContent = createDynamicComponent<CardContentProps>("card", "CardContent", Default.CardContent, {});

export const CardFooter = createDynamicComponent<CardFooterProps>("card", "CardFooter", Default.CardFooter, {});

export const CardAction = createDynamicComponent<CardActionProps>("card", "CardAction", Default.CardAction, {});

export type {
	CardProps,
	CardHeaderProps,
	CardTitleProps,
	CardDescriptionProps,
	CardActionProps,
	CardContentProps,
	CardFooterProps,
};
