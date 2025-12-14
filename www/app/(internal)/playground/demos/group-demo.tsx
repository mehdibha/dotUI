"use client";

import { useState } from "react";
import {
	IconArrowRight,
	IconBrandGithubCopilot,
	IconChevronDown,
	IconCloudCode,
	IconHeart,
	IconMinus,
	IconPlus,
} from "@tabler/icons-react";
import {
	ArchiveIcon,
	ArrowLeftIcon,
	ArrowRightIcon,
	AudioLinesIcon,
	CalendarPlusIcon,
	ChevronDownIcon,
	CopyIcon,
	FlipHorizontalIcon,
	FlipVerticalIcon,
	ListFilterPlusIcon,
	MailCheckIcon,
	MoreHorizontalIcon,
	PercentIcon,
	RotateCwIcon,
	ShareIcon,
	TagIcon,
	Trash2Icon,
	TrashIcon,
} from "lucide-react";

import { SearchIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";
import { ColorField } from "@dotui/registry/ui/color-field";
import { ColorPicker } from "@dotui/registry/ui/color-picker";
import { ColorSwatch } from "@dotui/registry/ui/color-swatch";
import { ColorSwatchPicker, ColorSwatchPickerItem } from "@dotui/registry/ui/color-swatch-picker";
import { Dialog, DialogBody, DialogContent, DialogHeader, DialogHeading } from "@dotui/registry/ui/dialog";
import { Label } from "@dotui/registry/ui/field";
import { Group } from "@dotui/registry/ui/group";
import { Input, InputAddon, InputGroup, TextArea } from "@dotui/registry/ui/input";
import { Menu, MenuContent, MenuItem, MenuSection, MenuSub } from "@dotui/registry/ui/menu";
import { NumberField } from "@dotui/registry/ui/number-field";
import { Popover } from "@dotui/registry/ui/popover";
import { SearchField } from "@dotui/registry/ui/search-field";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@dotui/registry/ui/select";
import { Separator } from "@dotui/registry/ui/separator";
import { Text } from "@dotui/registry/ui/text";
import { TextField } from "@dotui/registry/ui/text-field";
import { Tooltip, TooltipContent } from "@dotui/registry/ui/tooltip";

export function GroupDemo() {
	const [currency, setCurrency] = useState("$");
	return (
		<div className="space-y-30">
			<div className="space-y-4">
				<Input />

				<InputGroup>
					<Input />
				</InputGroup>

				<TextField>
					<Input />
				</TextField>

				<TextField>
					<InputGroup>
						<Input />
					</InputGroup>
				</TextField>

				<Group>
					<Input />
				</Group>

				<TextField>
					<Group>
						<Input />
					</Group>
				</TextField>
			</div>

			{/* --------------------------------------------------------------------------------- */}

			<div className="flex flex-wrap gap-8">
				<div className="flex max-w-md flex-col gap-6 *:w-full">
					<Group>
						<TextField>
							<Input placeholder="Type something here..." />
						</TextField>
						<Button>Button</Button>
					</Group>

					<Group>
						<Button>Button</Button>
						<TextField>
							<Input placeholder="Type something here..." />
						</TextField>
					</Group>

					<TextField>
						<Group>
							<Label>
								<IconCloudCode /> GPU Size
							</Label>
							<Input placeholder="Type something here..." />
						</Group>
					</TextField>

					<TextField>
						<Group>
							<Text>Prefix</Text>
							<Input placeholder="Type something here..." />
							<Text>Suffix</Text>
						</Group>
					</TextField>

					<TextField>
						<Label>Amount</Label>
						<Group>
							<Select placeholder="Select currency" value={currency} onChange={(key) => setCurrency(key as string)}>
								<SelectTrigger />
								<SelectContent>
									<SelectItem id="$">$</SelectItem>
									<SelectItem id="€">€</SelectItem>
									<SelectItem id="£">£</SelectItem>
								</SelectContent>
							</Select>
							<TextField>
								<Input placeholder="Enter amount to send" />
							</TextField>
							<Button>
								<ArrowRightIcon />
							</Button>
						</Group>
					</TextField>
				</div>

				<div className="flex max-w-sm flex-col gap-6">
					<Group className="[--spacing:0.2rem]">
						<Button>
							<FlipHorizontalIcon />
						</Button>
						<Button>
							<FlipVerticalIcon />
						</Button>
						<Button>
							<RotateCwIcon />
						</Button>
						<InputGroup>
							<InputAddon>
								<PercentIcon />
							</InputAddon>
							<Input placeholder="Enter percentage" />
						</InputGroup>
					</Group>

					<Group className="[--radius-factor:2] [--spacing:0.22rem]">
						<SearchField>
							<InputGroup>
								<InputAddon>
									<SearchIcon />
								</InputAddon>
								<Input placeholder="Type to search..." />
							</InputGroup>
						</SearchField>
						<Group>
							<Button>
								<IconBrandGithubCopilot />
							</Button>
							<Dialog>
								<Button aspect="default">
									<IconCloudCode />
									<IconChevronDown />
								</Button>
								<Popover>
									<DialogContent className="">
										<DialogHeader>
											<DialogHeading>Agent Tasks</DialogHeading>
										</DialogHeader>
										<Separator orientation="horizontal" />
										<DialogBody>
											<TextArea
												placeholder="Describe your task in natural language."
												className="mb-4 w-full resize-none"
											/>
											<p className="font-medium">Start a new task with Copilot</p>
											<p className="text-muted-foreground">
												Describe your task in natural language. Copilot will work in the background and open a pull
												request for your review.
											</p>
										</DialogBody>
									</DialogContent>
								</Popover>
							</Dialog>
						</Group>
					</Group>

					<SearchField>
						<Group>
							<Input placeholder="Type to search..." />
							<Button>
								<SearchIcon />
							</Button>
						</Group>
					</SearchField>

					<Group className="[--spacing:0.22rem]">
						<NumberField>
							<Group>
								<InputGroup>
									<InputAddon>W</InputAddon>
									<Input id="width" />
									<InputAddon>px</InputAddon>
								</InputGroup>
								<Button slot="decrement">
									<IconMinus />
								</Button>
								<Button slot="increment">
									<IconPlus />
								</Button>
							</Group>
						</NumberField>

						<ColorPicker defaultValue="#EA4335">
							<ColorField>
								<InputGroup>
									<InputAddon>
										<Button variant="quiet">
											<ColorSwatch className="" />
										</Button>
									</InputAddon>
									{/* <InputAddon>#</InputAddon> */}
									<Input className="w-20" />
								</InputGroup>
							</ColorField>
							<Popover>
								<DialogContent>
									<ColorSwatchPicker>
										{[
											"#EA4335", // Red
											"#FBBC04", // Yellow
											"#34A853", // Green
											"#4285F4", // Blue
											"#9333EA", // Purple
											"#EC4899", // Pink
											"#10B981", // Emerald
											"#F97316", // Orange
											"#6366F1", // Indigo
											"#14B8A6", // Teal
											"#8B5CF6", // Violet
											"#F59E0B", // Amber
										].map((color) => (
											<ColorSwatchPickerItem key={color} color={color} />
										))}
									</ColorSwatchPicker>
								</DialogContent>
							</Popover>
						</ColorPicker>
					</Group>

					<Group>
						<TextField>
							<Input aria-label="Select export type" />
						</TextField>
						<Select defaultValue="pdf" className="w-fit">
							<SelectTrigger />
							<SelectContent>
								<SelectItem id="pdf">pdf</SelectItem>
								<SelectItem id="xlsx">xlsx</SelectItem>
								<SelectItem id="csv">csv</SelectItem>
								<SelectItem id="json">json</SelectItem>
							</SelectContent>
						</Select>
					</Group>

					<Group>
						<Select defaultValue="hours" className="w-fit">
							<SelectTrigger />
							<SelectContent>
								<SelectItem id="hours">Hours</SelectItem>
								<SelectItem id="days">Days</SelectItem>
								<SelectItem id="weeks">Weeks</SelectItem>
							</SelectContent>
						</Select>
						<NumberField>
							<InputGroup>
								<Input aria-label="Select duration" />
								<InputAddon>
									<Group>
										<Button slot="decrement" />
										<Button slot="increment" />
									</Group>
								</InputAddon>
							</InputGroup>
						</NumberField>
					</Group>

					<Group className="[--radius-factor:9999]">
						<Group>
							<Button>
								<IconPlus />
							</Button>
						</Group>
						<Group>
							<InputGroup>
								<InputAddon>
									<Tooltip>
										<Button variant="quiet" size="sm" className="size-7">
											<AudioLinesIcon />
										</Button>
										<TooltipContent>Use Voice Mode</TooltipContent>
									</Tooltip>
								</InputAddon>
								<Input placeholder="Send a message..." />
							</InputGroup>
						</Group>
					</Group>
				</div>
			</div>

			{/* --------------------------------------------------------------------------------- */}

			<div className="flex flex-wrap gap-8">
				<div className="flex max-w-md flex-col gap-6 *:w-full">
					<Group>
						<Button aria-label="Go Back">
							<ArrowLeftIcon />
						</Button>
						<Group>
							<Button>Archive</Button>
							<Button>Report</Button>
						</Group>
						<Group>
							<Button>Snooze</Button>
							<Menu>
								<Button>
									<MoreHorizontalIcon />
								</Button>
								<Popover placement="bottom start">
									<MenuContent>
										<MenuSection>
											<MenuItem>
												<MailCheckIcon />
												Mark as Read
											</MenuItem>
											<MenuItem>
												<ArchiveIcon />
												Archive
											</MenuItem>
										</MenuSection>
										<Separator />
										<MenuSection>
											<MenuItem>
												<CalendarPlusIcon />
												Add to Calendar
											</MenuItem>
											<MenuItem>
												<ListFilterPlusIcon />
												Add to List
											</MenuItem>
											<MenuSub>
												<MenuItem>
													<TagIcon />
													Label As...
												</MenuItem>
												<Popover>
													<MenuContent selectionMode="single">
														<MenuItem>Personal</MenuItem>
														<MenuItem>Work</MenuItem>
														<MenuItem>Other</MenuItem>
													</MenuContent>
												</Popover>
											</MenuSub>
										</MenuSection>
										<Separator />
										<MenuItem variant="danger">
											<Trash2Icon />
											Trash
										</MenuItem>
									</MenuContent>
								</Popover>
							</Menu>
						</Group>
					</Group>

					<Group>
						<Button variant="primary">Button</Button>
						<Button variant="primary">
							Get Started <IconArrowRight />
						</Button>
					</Group>

					<Group>
						<Button variant="primary">Button</Button>
						<Separator />
						<Button variant="primary">
							Get Started <IconArrowRight />
						</Button>
					</Group>

					<Group>
						<Input placeholder="Type something here..." />
						<Button>Button</Button>
					</Group>

					<Group>
						<Button>Button</Button>
						<Input placeholder="Type something here..." />
					</Group>

					<Group>
						<Button>Button</Button>
						<Button>Another Button</Button>
					</Group>

					<Group>
						<Text>Text</Text>
						<Button>Another Button</Button>
					</Group>

					<TextField>
						<Group>
							<Label>
								<IconCloudCode /> GPU Size
							</Label>
							<Input placeholder="Type something here..." />
						</Group>
					</TextField>

					<Group>
						<Text>Prefix</Text>
						<Input placeholder="Type something here..." />
						<Text>Suffix</Text>
					</Group>

					<Group>
						<Group>
							<Button>Update</Button>
							<Menu>
								<Button>
									<ChevronDownIcon />
								</Button>
								<Popover placement="bottom end">
									<MenuContent>
										<MenuItem>Disable</MenuItem>
										<MenuItem variant="danger">Uninstall</MenuItem>
									</MenuContent>
								</Popover>
							</Menu>
						</Group>
						<Group className="[--radius-factor:999]">
							<Button>Follow</Button>
							<Menu>
								<Button>
									<ChevronDownIcon />
								</Button>
								<Popover placement="bottom end">
									<MenuContent>
										<MenuItem>Mute Conversation</MenuItem>
										<MenuItem>Mark as Read</MenuItem>
										<MenuItem>Report Conversation</MenuItem>
										<MenuItem>Block User</MenuItem>
										<MenuItem>Share Conversation</MenuItem>
										<MenuItem>Copy Conversation</MenuItem>
										<MenuItem variant="danger">Delete Conversation</MenuItem>
									</MenuContent>
								</Popover>
							</Menu>
						</Group>
						<Group className="[--radius-factor:0.9]">
							<Button>Actions</Button>
							<Separator />
							<Menu>
								<Button>
									<MoreHorizontalIcon />
								</Button>
								<Popover placement="bottom end">
									<MenuContent>
										<MenuItem>Select Messages</MenuItem>
										<MenuItem>Edit Pins</MenuItem>
										<MenuItem>Set Up Name & Photo</MenuItem>
										<MenuItem>Delete Messages</MenuItem>
										<MenuItem variant="danger">Delete Pins</MenuItem>
									</MenuContent>
								</Popover>
							</Menu>
						</Group>
					</Group>

					<TextField>
						<Label>Amount</Label>
						<Group>
							<Select placeholder="Select currency" value={currency} onChange={(key) => setCurrency(key as string)}>
								<SelectTrigger />
								<SelectContent>
									<SelectItem id="$">$</SelectItem>
									<SelectItem id="€">€</SelectItem>
									<SelectItem id="£">£</SelectItem>
								</SelectContent>
							</Select>
							<Input placeholder="Enter amount to send" />
							<Button>
								<ArrowRightIcon />
							</Button>
						</Group>
					</TextField>
				</div>

				<div className="flex max-w-sm flex-col gap-6">
					<Group className="[--spacing:0.2rem]">
						<Button>
							<FlipHorizontalIcon />
						</Button>
						<Button>
							<FlipVerticalIcon />
						</Button>
						<Button>
							<RotateCwIcon />
						</Button>
						<InputGroup>
							<InputAddon>
								<PercentIcon />
							</InputAddon>
							<Input placeholder="Enter percentage" />
						</InputGroup>
					</Group>

					<Group className="[--radius-factor:2] [--spacing:0.22rem]">
						<InputGroup>
							<InputAddon>
								<SearchIcon />
							</InputAddon>
							<Input placeholder="Type to search..." />
						</InputGroup>
						<Group>
							<Button>
								<IconBrandGithubCopilot />
							</Button>
							<Dialog>
								<Button aspect="default">
									<IconCloudCode />
									<IconChevronDown />
								</Button>
								<Popover>
									<DialogContent className="">
										<DialogHeader>
											<DialogHeading>Agent Tasks</DialogHeading>
										</DialogHeader>
										<Separator orientation="horizontal" />
										<DialogBody>
											<TextArea
												placeholder="Describe your task in natural language."
												className="mb-4 w-full resize-none"
											/>
											<p className="font-medium">Start a new task with Copilot</p>
											<p className="text-muted-foreground">
												Describe your task in natural language. Copilot will work in the background and open a pull
												request for your review.
											</p>
										</DialogBody>
									</DialogContent>
								</Popover>
							</Dialog>
						</Group>
					</Group>

					<Group className="[--spacing:0.22rem]">
						<Group>
							<InputGroup>
								<InputAddon>W</InputAddon>
								<Input id="width" />
								<InputAddon>px</InputAddon>
							</InputGroup>
							<Button>
								<IconMinus />
							</Button>
							<Button>
								<IconPlus />
							</Button>
						</Group>

						<Group>
							<InputGroup>
								<InputAddon>
									<Dialog>
										<Button variant="quiet">
											<span className="size-4 rounded-xs bg-blue-600" />
										</Button>
										<Popover>
											<DialogContent>
												<ColorSwatchPicker>
													{[
														"#EA4335", // Red
														"#FBBC04", // Yellow
														"#34A853", // Green
														"#4285F4", // Blue
														"#9333EA", // Purple
														"#EC4899", // Pink
														"#10B981", // Emerald
														"#F97316", // Orange
														"#6366F1", // Indigo
														"#14B8A6", // Teal
														"#8B5CF6", // Violet
														"#F59E0B", // Amber
													].map((color) => (
														<ColorSwatchPickerItem key={color} color={color} />
													))}
												</ColorSwatchPicker>
											</DialogContent>
										</Popover>
									</Dialog>
								</InputAddon>
								<Input className="w-16" />
								<InputAddon>%</InputAddon>
							</InputGroup>
						</Group>
					</Group>

					<Group>
						<Button>
							<IconHeart /> Like
						</Button>
						<Text>1.2K</Text>
					</Group>

					<Group>
						<Input aria-label="Select export type" />
						<Select defaultValue="pdf" className="w-fit">
							<SelectTrigger />
							<SelectContent>
								<SelectItem id="pdf">pdf</SelectItem>
								<SelectItem id="xlsx">xlsx</SelectItem>
								<SelectItem id="csv">csv</SelectItem>
								<SelectItem id="json">json</SelectItem>
							</SelectContent>
						</Select>
					</Group>

					<Group>
						<Select defaultValue="hours" className="w-fit">
							<SelectTrigger />
							<SelectContent>
								<SelectItem id="hours">Hours</SelectItem>
								<SelectItem id="days">Days</SelectItem>
								<SelectItem id="weeks">Weeks</SelectItem>
							</SelectContent>
						</Select>
						<Input aria-label="Select duration" />
					</Group>

					<Group className="[--radius-factor:9999]">
						<Group>
							<Button>
								<IconPlus />
							</Button>
						</Group>
						<Group>
							<InputGroup>
								<InputAddon>
									<Tooltip>
										<Button variant="quiet" size="sm" className="size-7">
											<AudioLinesIcon />
										</Button>
										<TooltipContent>Use Voice Mode</TooltipContent>
									</Tooltip>
								</InputAddon>
								<Input placeholder="Send a message..." />
							</InputGroup>
						</Group>
					</Group>

					<Group>
						<Button size="sm">
							<ArrowLeftIcon />
							Previous
						</Button>
						<Button size="sm">1</Button>
						<Button size="sm">2</Button>
						<Button size="sm">3</Button>
						<Button size="sm">4</Button>
						<Button size="sm">5</Button>
						<Button size="sm">
							Next
							<ArrowRightIcon />
						</Button>
					</Group>

					<Group className="[--radius:0.9rem] [--spacing:0.22rem]">
						<Group>
							<Button>1</Button>
							<Button>2</Button>
							<Button>3</Button>
							<Button>4</Button>
							<Button>5</Button>
						</Group>
						<Group>
							<Button>
								<ArrowLeftIcon />
							</Button>
							<Button>
								<ArrowRightIcon />
							</Button>
						</Group>
					</Group>

					<Group>
						<Group>
							<Button>
								<ArrowLeftIcon />
							</Button>
							<Button>
								<ArrowRightIcon />
							</Button>
						</Group>
						<Group aria-label="Single navigation button">
							<Button>
								<ArrowLeftIcon />
							</Button>
						</Group>
					</Group>

					<div>
						<Label id="alignment-label">Text Alignment</Label>
						<Group aria-labelledby="alignment-label">
							<Button size="sm">Left</Button>
							<Button size="sm">Center</Button>
							<Button size="sm">Right</Button>
							<Button size="sm">Justify</Button>
						</Group>
					</div>
				</div>
				<div className="flex max-w-xs flex-col gap-6">
					<div className="flex gap-6">
						<Group orientation="vertical" aria-label="Media controls">
							<Button>
								<IconPlus />
							</Button>
							<Button>
								<IconMinus />
							</Button>
						</Group>
						<Group orientation="vertical" aria-label="Design tools palette">
							<Group orientation="vertical">
								<Button>
									<SearchIcon />
								</Button>
								<Button>
									<CopyIcon />
								</Button>
								<Button>
									<ShareIcon />
								</Button>
							</Group>
							<Group orientation="vertical">
								<Button>
									<FlipHorizontalIcon />
								</Button>
								<Button>
									<FlipVerticalIcon />
								</Button>
								<Button>
									<RotateCwIcon />
								</Button>
							</Group>
							<Group>
								<Button>
									<TrashIcon />
								</Button>
							</Group>
						</Group>
						<Group orientation="vertical">
							<Button size="sm">
								<IconPlus /> Increase
							</Button>
							<Button size="sm">
								<IconMinus /> Decrease
							</Button>
						</Group>
						<Group orientation="vertical">
							<Button size="sm">
								<IconPlus /> Increase
							</Button>
							<Separator orientation="horizontal" />
							<Button size="sm">
								<IconMinus /> Decrease
							</Button>
						</Group>
					</div>
				</div>
			</div>
		</div>
	);
}
