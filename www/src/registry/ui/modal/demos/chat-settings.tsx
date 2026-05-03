"use client";

import * as React from "react";
import type * as MenuPrimitives from "react-aria-components/Menu";

import { InfoIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import { Checkbox, CheckboxControl } from "@/registry/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogHeading,
} from "@/registry/ui/dialog";
import { Description, Field, FieldContent, FieldGroup, Fieldset, Label, Legend } from "@/registry/ui/field";
import { Input, InputGroup, InputGroupAddon, TextArea } from "@/registry/ui/input";
import { Kbd } from "@/registry/ui/kbd";
import { Modal } from "@/registry/ui/modal";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/registry/ui/select";
import { Switch, SwitchIndicator, SwitchThumb } from "@/registry/ui/switch";
import { Tab, TabList, TabPanel, Tabs } from "@/registry/ui/tabs";
import { TextField } from "@/registry/ui/text-field";
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip";

const spokenLanguages = [
	{ label: "Auto", value: "auto" },
	{ label: "English", value: "en" },
	{ label: "Spanish", value: "es" },
	{ label: "French", value: "fr" },
	{ label: "German", value: "de" },
	{ label: "Italian", value: "it" },
	{ label: "Portuguese", value: "pt" },
	{ label: "Russian", value: "ru" },
	{ label: "Chinese", value: "zh" },
	{ label: "Japanese", value: "ja" },
	{ label: "Korean", value: "ko" },
	{ label: "Arabic", value: "ar" },
	{ label: "Hindi", value: "hi" },
	{ label: "Bengali", value: "bn" },
	{ label: "Telugu", value: "te" },
	{ label: "Marathi", value: "mr" },
	{ label: "Kannada", value: "kn" },
	{ label: "Malayalam", value: "ml" },
];

const voices = [
	{ label: "Samantha", value: "samantha" },
	{ label: "Alex", value: "alex" },
	{ label: "Fred", value: "fred" },
	{ label: "Victoria", value: "victoria" },
	{ label: "Tom", value: "tom" },
	{ label: "Karen", value: "karen" },
	{ label: "Sam", value: "sam" },
	{ label: "Daniel", value: "daniel" },
];

const themes = [
	{ label: "Light", value: "light" },
	{ label: "Dark", value: "dark" },
	{ label: "System", value: "system" },
];

const accents = [
	{ label: "Default", value: "default" },
	{ label: "Red", value: "red" },
	{ label: "Blue", value: "blue" },
	{ label: "Green", value: "green" },
	{ label: "Purple", value: "purple" },
	{ label: "Pink", value: "pink" },
];

export default function Demo() {
	const [tab, setTab] = React.useState<MenuPrimitives.Key>("general");
	const [theme, setTheme] = React.useState<MenuPrimitives.Key>("system");
	const [accentColor, setAccentColor] = React.useState<MenuPrimitives.Key>("default");
	const [spokenLanguage, setSpokenLanguage] = React.useState<MenuPrimitives.Key>("en");
	const [voice, setVoice] = React.useState<MenuPrimitives.Key>("samantha");

	return (
		<Dialog>
			<Button>Chat Settings</Button>
			<Modal className="sm:max-w-2xl">
				<DialogContent>
					<DialogHeader>
						<DialogHeading>Chat Settings</DialogHeading>
						<DialogDescription>
							Customize your chat settings: theme, accent color, spoken language, voice, personality, and custom
							instructions.
						</DialogDescription>
					</DialogHeader>
					<div className="flex flex-col gap-4">
						<select
							aria-label="Settings section"
							value={String(tab)}
							onChange={(event) => setTab(event.target.value)}
							className="h-9 rounded-md border bg-bg px-3 text-sm md:hidden"
						>
							<option value="general">General</option>
							<option value="notifications">Notifications</option>
							<option value="personalization">Personalization</option>
							<option value="security">Security</option>
						</select>
						<Tabs selectedKey={tab} onSelectionChange={setTab}>
							<TabList className="hidden w-full md:flex">
								<Tab id="general">General</Tab>
								<Tab id="notifications">Notifications</Tab>
								<Tab id="personalization">Personalization</Tab>
								<Tab id="security">Security</Tab>
							</TabList>
							<div className="min-h-[450px] rounded-lg border p-4">
								<TabPanel id="general">
									<Fieldset>
										<FieldGroup>
											<Field orientation="horizontal" className="items-center justify-between">
												<Label>Theme</Label>
												<Select
													aria-label="Theme"
													value={theme}
													onChange={(value) => {
														if (value != null) setTheme(value);
													}}
												>
													<SelectTrigger className="min-w-32" />
													<SelectContent>
														{themes.map((item) => (
															<SelectItem key={item.value} id={item.value}>
																{item.label}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</Field>
											<Field orientation="horizontal" className="items-center justify-between">
												<Label>Accent Color</Label>
												<Select
													aria-label="Accent color"
													value={accentColor}
													onChange={(value) => {
														if (value != null) setAccentColor(value);
													}}
												>
													<SelectTrigger className="min-w-32" />
													<SelectContent>
														{accents.map((item) => (
															<SelectItem key={item.value} id={item.value}>
																{item.label}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</Field>
											<Field orientation="horizontal" className="items-start justify-between">
												<FieldContent>
													<Label>Spoken Language</Label>
													<Description>
														For best results, select the language you mainly speak. If it&apos;s not listed, it may
														still be supported via auto-detection.
													</Description>
												</FieldContent>
												<Select
													aria-label="Spoken language"
													value={spokenLanguage}
													onChange={(value) => {
														if (value != null) setSpokenLanguage(value);
													}}
												>
													<SelectTrigger className="min-w-32" />
													<SelectContent>
														{spokenLanguages.map((item) => (
															<SelectItem key={item.value} id={item.value}>
																{item.label}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</Field>
											<Field orientation="horizontal" className="items-center justify-between">
												<Label>Voice</Label>
												<Select
													aria-label="Voice"
													value={voice}
													onChange={(value) => {
														if (value != null) setVoice(value);
													}}
												>
													<SelectTrigger className="min-w-32" />
													<SelectContent>
														{voices.map((item) => (
															<SelectItem key={item.value} id={item.value}>
																{item.label}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</Field>
										</FieldGroup>
									</Fieldset>
								</TabPanel>
								<TabPanel id="notifications">
									<FieldGroup>
										<Fieldset>
											<Legend>Responses</Legend>
											<Description>
												Get notified when ChatGPT responds to requests that take time, like research or image
												generation.
											</Description>
											<FieldGroup className="mt-4 gap-3">
												<Checkbox defaultSelected isDisabled>
													<CheckboxControl />
													<Label>Push notifications</Label>
												</Checkbox>
											</FieldGroup>
										</Fieldset>
										<Fieldset>
											<Legend>Tasks</Legend>
											<Description>Get notified when tasks you&apos;ve created have updates.</Description>
											<FieldGroup className="mt-4 gap-3">
												<Checkbox>
													<CheckboxControl />
													<Label>Push notifications</Label>
												</Checkbox>
												<Checkbox>
													<CheckboxControl />
													<Label>Email notifications</Label>
												</Checkbox>
											</FieldGroup>
										</Fieldset>
									</FieldGroup>
								</TabPanel>
								<TabPanel id="personalization">
									<FieldGroup>
										<TextField>
											<Label>Nickname</Label>
											<InputGroup>
												<Input placeholder="Broski" />
												<InputGroupAddon>
													<Tooltip>
														<Button aria-label="Nickname info" isIconOnly size="xs" variant="quiet">
															<InfoIcon />
														</Button>
														<TooltipContent>
															Used to identify you in the chat. <Kbd>N</Kbd>
														</TooltipContent>
													</Tooltip>
												</InputGroupAddon>
											</InputGroup>
										</TextField>
										<TextField>
											<Label>More about you</Label>
											<Description>
												Tell us more about yourself. This will be used to help us personalize your experience.
											</Description>
											<TextArea placeholder="I'm a software engineer..." className="min-h-28" />
										</TextField>
										<Field orientation="horizontal" className="items-center justify-between">
											<FieldContent>
												<Label>Enable customizations</Label>
												<Description>Enable customizations to make ChatGPT more personalized.</Description>
											</FieldContent>
											<Switch defaultSelected aria-label="Enable customizations">
												<SwitchIndicator>
													<SwitchThumb />
												</SwitchIndicator>
											</Switch>
										</Field>
									</FieldGroup>
								</TabPanel>
								<TabPanel id="security">
									<FieldGroup>
										<Field orientation="horizontal" className="items-center justify-between">
											<FieldContent>
												<Label>Multi-factor authentication</Label>
												<Description>
													Enable multi-factor authentication to secure your account. If you do not have a two-factor
													authentication device, you can use a one-time code sent to your email.
												</Description>
											</FieldContent>
											<Switch aria-label="Multi-factor authentication">
												<SwitchIndicator>
													<SwitchThumb />
												</SwitchIndicator>
											</Switch>
										</Field>
										<Field orientation="horizontal" className="items-center justify-between">
											<FieldContent>
												<p className="font-medium text-sm">Log out</p>
												<Description>Log out of your account on this device.</Description>
											</FieldContent>
											<Button size="sm">Log Out</Button>
										</Field>
										<Field orientation="horizontal" className="items-center justify-between">
											<FieldContent>
												<p className="font-medium text-sm">Log out of all devices</p>
												<Description>
													This will log you out of all devices, including the current session. It may take up to 30
													minutes for the changes to take effect.
												</Description>
											</FieldContent>
											<Button size="sm">Log Out All</Button>
										</Field>
									</FieldGroup>
								</TabPanel>
							</div>
						</Tabs>
					</div>
					<DialogFooter>
						<Button slot="close">Done</Button>
					</DialogFooter>
				</DialogContent>
			</Modal>
		</Dialog>
	);
}
