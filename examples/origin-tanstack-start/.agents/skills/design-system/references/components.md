# Components

Import from `@/components/ui/<name>`. Install a missing one with `npx shadcn@latest add @dotui/<name>`.

## Choosing between components

**Picking one option**
- Show options when there are few: 2–5 exclusive options → `RadioGroup` (`SegmentedControl` for switching views); 6+ → `Select`; long or searchable lists → `Combobox`.
- Switching between views of the same content → `Tabs` (page sections) or `SegmentedControl` (compact, in a toolbar).

**Picking several options**
- Few → `CheckboxGroup`; many or searchable → `Combobox` with multiple selection; free-form entries → `TokenField`.

**On/off**
- Applies immediately → `Switch`. Submitted with a form → `Checkbox`. A pressed state in a toolbar → `ToggleButton`.

**Actions**
- Does something → `Button`. Goes somewhere → `Link` (inline) or `LinkButton` (looks like a button).
- Several related actions → a `Menu` behind one `Button`; a row of equal actions → `ToggleButtonGroup` or a `Group` of buttons.

**Showing something on top**
- A decision or a form → `Dialog` + `Modal` (`Drawer` on small screens).
- Light, non-blocking detail anchored to a trigger → `Dialog` + `Popover`.
- A label for an icon-only control → `Tooltip`. Never put interactive content in a tooltip.
- Command palette → `Command`.

**Telling the user something**
- The result of their action → `toastManager.add()` (mount `ToastProvider` once at the root).
- A standing condition on the page → `Alert`.
- Nothing to show yet → `Empty`. Still loading → `Skeleton` shaped like the content, `Loader` inside buttons.
- Short status on an item → `Badge`.

**Collections**
- Show collections as a `Table` by default — comparing rows is the job. Cards only for visual content (images, previews).
- Hierarchical data → `Tree`. Plain selectable list → `ListBox`.

## Catalog

### Buttons

- **Button** (`@dotui/button`) — Displays a button or a component that looks like a button. Exports: `Button`, `LinkButton`.
- **File Trigger** (`@dotui/file-trigger`) — A file trigger allows a user to access the file system with any pressable element. Exports: `FileTrigger`.
- **Link** (`@dotui/link`) — A link allows a user to navigate to another page or resource. Exports: `Link`.
- **Segmented Control** (`@dotui/segmented-control`) — A segmented control lets users pick one option from a small set, with a pill indicator that slides to the selection. Exports: `SegmentedControl`, `SegmentedControlItem`.
- **Toggle Button** (`@dotui/toggle-button`) — A toggle button allows a user to toggle a selection on or off. Exports: `ToggleButton`, `ToggleButtonProvider`.
- **Toggle Button Group** (`@dotui/toggle-button-group`) — A toggle button group allows users to select one or more options from a set. Exports: `ToggleButtonGroup`.

### Text inputs

- **Color Field** (`@dotui/color-field`) — A color field allows users to edit a color value using a text field. Exports: `ColorField`.
- **Date Field** (`@dotui/date-field`) — A date field allows users to enter and edit date values using a keyboard. Exports: `DateField`.
- **Field** (`@dotui/field`) — A field wraps form inputs with labels, descriptions, and error messages. Exports: `Description`, `Field`, `FieldContent`, `FieldError`, `FieldGroup`, `Fieldset`, `Label`, `Legend`.
- **Input** (`@dotui/input`) — A basic input component for text entry. Exports: `DateInput`, `DateSegment`, `Input`, `InputGroup`, `InputGroupAddon`, `TextArea`.
- **Number Field** (`@dotui/number-field`) — A number field allows a user to enter a number value with a keyboard or increment/decrement with step buttons. Exports: `NumberField`, `NumberFieldDecrement`, `NumberFieldGroup`, `NumberFieldIncrement`.
- **OTP Field** (`@dotui/otp-field`) — An OTP field lets users enter a one-time passcode across multiple single-character inputs. Exports: `OTPField`, `OTPFieldGroup`, `OTPFieldSeparator`.
- **Search Field** (`@dotui/search-field`) — A search field allows a user to enter and clear a search query. Exports: `SearchField`.
- **TextField** (`@dotui/text-field`) — TextField allows a user to enter a plain text value with a keyboard. Exports: `TextField`.
- **Time Field** (`@dotui/time-field`) — A time field allows users to enter and edit time values using a keyboard. Exports: `TimeField`.
- **Token Field** (`@dotui/token-field`) — Token field lets users enter text with inline tokens such as mentions, tags, or object references. Exports: `Token`, `TokenField`, `TokenInput`.

### Selection controls

- **Checkbox** (`@dotui/checkbox`) — Checkboxes allow users to select multiple items from a list of individual items, or to mark one individual item as selected. Exports: `Checkbox`, `CheckboxControl`, `CheckboxIndicator`.
- **Checkbox Group** (`@dotui/checkbox-group`) — A checkbox group allows a user to select multiple items from a list of options. Exports: `CheckboxGroup`.
- **Radio Group** (`@dotui/radio-group`) — A radio group allows a user to select a single item from a list of mutually exclusive options. Exports: `Radio`, `RadioControl`, `RadioGroup`, `RadioIndicator`.
- **Switch** (`@dotui/switch`) — Switches allow users to turn an individual option on or off. Exports: `Switch`, `SwitchControl`, `SwitchIndicator`, `SwitchThumb`.

### Pickers

- **Color Picker** (`@dotui/color-picker`) — A color picker allows users to select a color from a palette or input a custom color value. Exports: `ColorPicker`.
- **Combobox** (`@dotui/combobox`) — Combobox combines a text input with a listbox, allowing users to filter a list of options to items matching a query. Exports: `Combobox`, `ComboboxValue`.
- **Date Picker** (`@dotui/date-picker`) — A date picker combines a date field and a calendar popover to allow users to select a date. Exports: `DatePicker`, `DateRangePicker`.
- **Mention** (`@dotui/mention`) — Mention lets users type a trigger character to insert people, commands, or other tokens inline as they write. Exports: `Mention`.
- **Select** (`@dotui/select`) — Select displays a collapsible list of options and allows a user to select one of them. Exports: `SelectItem`, `SelectSection`, `SelectSectionHeader`, `Select`, `SelectContent`, `SelectTrigger`, `SelectValue`.
- **Time Picker** (`@dotui/time-picker`) — A time picker combines a time field and a scrollable column popover to allow users to select a time. Exports: `TimePicker`, `TimePickerColumns`.

### Sliders

- **Color Area** (`@dotui/color-area`) — A color area allows users to select a color from a two-dimensional gradient. Exports: `ColorArea`.
- **Color Slider** (`@dotui/color-slider`) — A color slider allows users to adjust an individual channel of a color value. Exports: `ColorSlider`, `ColorSliderControl`, `ColorSliderOutput`.
- **Slider** (`@dotui/slider`) — An input where the user selects a value from within a given range. Exports: `Slider`, `SliderControl`, `SliderFill`, `SliderOutput`, `SliderThumb`, `SliderTrack`.

### Menus & lists

- **Command** (`@dotui/command`) — A command menu lets users search a list of commands and run one. Exports: `Command`, `CommandContent`, `CommandItem`, `CommandSection`, `CommandSectionHeader`, `CommandInput`.
- **List Box** (`@dotui/list-box`) — A listbox displays a list of options and allows a user to select one or more of them. Exports: `ListBox`, `ListBoxItem`, `ListBoxItemDescription`, `ListBoxItemLabel`, `ListBoxSection`, `ListBoxSectionHeader`, `ListBoxVirtualizer`.
- **Menu** (`@dotui/menu`) — A menu displays a list of actions or options that a user can choose. Exports: `Menu`, `MenuContent`, `MenuItem`, `MenuItemDescription`, `MenuItemLabel`, `MenuSection`, `MenuSectionHeader`, `MenuSub`.
- **Tree** (`@dotui/tree`) — A tree provides users with a way to navigate nested hierarchical information, with support for keyboard navigation and selection. Exports: `Tree`, `TreeItem`, `TreeItemContent`.

### Overlays

- **Dialog** (`@dotui/dialog`) — A dialog is an overlay shown above other content in an application. Exports: `Dialog`, `DialogBody`, `DialogContent`, `DialogDescription`, `DialogFooter`, `DialogHeader`, `DialogInset`, `DialogTitle`.
- **Drawer** (`@dotui/drawer`) — A drawer slides in from the edge of the screen to display content. Exports: `Drawer`, `DrawerHandle`, `DrawerIndent`, `DrawerIndentBackground`, `DrawerProvider`, `DrawerSwipeArea`.
- **Modal** (`@dotui/modal`) — A modal displays content in a layer that overlays the page content. Exports: `Modal`, `ModalBackdrop`, `ModalOverlay`, `ModalPanel`, `ModalViewport`.
- **Popover** (`@dotui/popover`) — A popover displays content in a floating container that appears above other content. Exports: `Popover`.
- **Tooltip** (`@dotui/tooltip`) — A tooltip displays a description of an element on hover or focus. Exports: `Tooltip`, `TooltipContent`.

### Navigation

- **Breadcrumbs** (`@dotui/breadcrumbs`) — Breadcrumbs display a hierarchy of links to the current page or resource in an application. Exports: `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbSeparator`, `Breadcrumbs`.
- **Pagination** (`@dotui/pagination`) — Pagination lets users navigate through content split across multiple pages. Exports: `Pagination`, `PaginationEllipsis`, `PaginationItem`, `PaginationLink`, `PaginationList`, `PaginationNext`, `PaginationPrevious`.
- **Sidebar** (`@dotui/sidebar`) — A composable, collapsible sidebar for application shells — with a mobile drawer, icon mode, and keyboard toggle. Exports: `Sidebar`, `SidebarContent`, `SidebarFooter`, `SidebarGroup`, `SidebarGroupAction`, `SidebarGroupContent`, `SidebarGroupLabel`, `SidebarHeader`, `SidebarInset`, `SidebarMenu`, `SidebarMenuAction`, `SidebarMenuBadge`, `SidebarMenuButton`, `SidebarMenuItem`, `SidebarMenuSkeleton`, `SidebarMenuSub`, `SidebarMenuSubButton`, `SidebarMenuSubItem`, `SidebarProvider`, `SidebarRail`, `SidebarSeparator`, `SidebarTrigger`.
- **Tabs** (`@dotui/tabs`) — Tabs organize content into multiple sections and allow users to navigate between them. Exports: `Tab`, `TabIndicator`, `TabList`, `TabPanel`, `Tabs`.

### Disclosure

- **Accordion** (`@dotui/accordion`) — A stack of collapsible sections, one or many open at a time. Exports: `Accordion`, `AccordionItem`, `AccordionPanel`, `AccordionTrigger`.
- **Collapsible** (`@dotui/collapsible`) — Shows and hides a section of content from a trigger. Exports: `Collapsible`, `CollapsiblePanel`, `CollapsibleTrigger`.

### Layout & containers

- **Attachment** (`@dotui/attachment`) — A file attached to a message or composer — preview, metadata, actions, and upload states. Exports: `Attachment`, `AttachmentAction`, `AttachmentActions`, `AttachmentContent`, `AttachmentDescription`, `AttachmentGroup`, `AttachmentMedia`, `AttachmentTitle`, `AttachmentTrigger`.
- **Avatar** (`@dotui/avatar`) — An avatar is a visual representation of a user or entity. Exports: `Avatar`, `AvatarBadge`, `AvatarFallback`, `AvatarGroup`, `AvatarGroupCount`, `AvatarImage`.
- **Bubble** (`@dotui/bubble`) — A chat bubble — contained message content with variants, alignment, and reactions. Exports: `Bubble`, `BubbleContent`, `BubbleGroup`, `BubbleReactions`.
- **Card** (`@dotui/card`) — A card groups related content and actions. Exports: `Card`, `CardAction`, `CardContent`, `CardDescription`, `CardFooter`, `CardHeader`, `CardTitle`.
- **Group** (`@dotui/group`) — A group visually groups related UI elements together. Exports: `Group`, `GroupText`.
- **Marker** (`@dotui/marker`) — A labeled divider row — a date in a message list, a section label in a feed. Exports: `Marker`, `MarkerContent`, `MarkerIcon`.
- **Message** (`@dotui/message`) — One turn in a conversation — avatar, header, content, and footer, aligned to a side of the thread. Exports: `Message`, `MessageAvatar`, `MessageContent`, `MessageFooter`, `MessageGroup`, `MessageHeader`.
- **MessageScroller** (`@dotui/message-scroller`) — A message list that sticks to the newest message, with a scroll-to-bottom button and lazy-rendered items. Exports: `MessageScroller`, `MessageScrollerButton`, `MessageScrollerContent`, `MessageScrollerItem`, `MessageScrollerProvider`, `MessageScrollerViewport`.
- **QR Code** (`@dotui/qr-code`) — A QR code encodes a value, such as a URL, as a scannable matrix barcode. Exports: `QRCode`.
- **Questionnaire** (`@dotui/questionnaire`) — A multi-step survey — one question at a time, with progress, keyboard shortcuts, and navigation. Exports: `Questionnaire`, `QuestionnaireActions`, `QuestionnaireChoice`, `QuestionnaireChoiceDescription`, `QuestionnaireChoices`, `QuestionnaireDescription`, `QuestionnaireError`, `QuestionnaireInput`, `QuestionnaireItem`, `QuestionnaireNext`, `QuestionnairePrevious`, `QuestionnaireProgress`, `QuestionnaireSkip`, `QuestionnaireSubmit`, `QuestionnaireTitle`.
- **Separator** (`@dotui/separator`) — A separator visually divides content in lists, menus, or other places. Exports: `Separator`.
- **Table** (`@dotui/table`) — A table displays data in rows and columns and enables a user to navigate and select its contents. Exports: `Table`, `TableBody`, `TableCell`, `TableColumn`, `TableContainer`, `TableDropIndicator`, `TableFooter`, `TableHeader`, `TableLayout`, `TableLoadMore`, `TableRow`, `TableVirtualizer`.

### Feedback

- **Alert** (`@dotui/alert`) — Alerts display a short, important message in a way that attracts the user's attention. Exports: `Alert`, `AlertAction`, `AlertDescription`, `AlertTitle`.
- **Empty** (`@dotui/empty`) — An empty state placeholder for when there's no content to display. Exports: `Empty`, `EmptyContent`, `EmptyDescription`, `EmptyHeader`, `EmptyMedia`, `EmptyTitle`.
- **Toast** (`@dotui/toast`) — A toast displays a brief, temporary notification. Exports: `Toaster`, `ToastPrimitive`, `ToastProvider`.

### Progress

- **Loader** (`@dotui/loader`) — A loader indicates that content is being loaded. Exports: `Loader`.
- **Progress Bar** (`@dotui/progress-bar`) — A progress bar shows the progression of a task. Exports: `ProgressBar`, `ProgressBarControl`, `ProgressBarFill`, `ProgressBarOutput`, `ProgressBarTrack`.
- **Skeleton** (`@dotui/skeleton`) — Skeleton is a placeholder component that displays while content is loading. Exports: `Skeleton`.

### Tags

- **Badge** (`@dotui/badge`) — Badges are small status descriptors for UI elements. Exports: `Badge`.
- **Kbd** (`@dotui/kbd`) — A keyboard key indicator displays keyboard shortcuts. Exports: `Kbd`, `KbdGroup`.
- **Tag Group** (`@dotui/tag-group`) — A tag group displays a collection of tags. Exports: `Tag`, `TagGroup`, `TagList`.

### Dates

- **Calendar** (`@dotui/calendar`) — A calendar allows a user to select a single date value. Exports: `Calendar`, `CalendarCell`, `CalendarGrid`, `CalendarGridBody`, `CalendarGridHeader`, `CalendarHeader`, `CalendarHeaderCell`, `CalendarHeading`, `RangeCalendar`.

### Color

- **Color Editor** (`@dotui/color-editor`) — A color editor allows users to adjust a color value using a color area, channel sliders, and field inputs in multiple color formats. Exports: `ColorEditor`, `ColorEditorArea`, `ColorEditorFields`.
- **Color Swatch** (`@dotui/color-swatch`) — A color swatch displays a color sample. Exports: `ColorSwatch`.
- **Color Swatch Picker** (`@dotui/color-swatch-picker`) — A color swatch picker allows users to select a color from a list of swatches. Exports: `ColorSwatchPickerItem`, `ColorSwatchPicker`.

### Charts

- **Area Chart** (`@dotui/chart-area`) — A filled line chart for values that accumulate, compose, or are read against a baseline. Exports: `AreaChart`.
- **Bar Chart** (`@dotui/chart-bar`) — Compares categories with bars — grouped, stacked, horizontal, or labelled. Exports: `BarChart`.
- **Heatmap** (`@dotui/chart-heatmap`) — Show one value per pair of categories, with color carrying the magnitude. Exports: `HeatmapChart`.
- **Line Chart** (`@dotui/chart-line`) — Draws one line per series across an ordered domain, themed by your design system. Exports: `LineChart`.
- **Pie Chart** (`@dotui/chart-pie`) — A circle divided into slices, for parts of a single whole. Exports: `PieChart`.
- **Radar Chart** (`@dotui/chart-radar`) — Plots a handful of categories around a circle, so a series reads as one recognisable shape. Exports: `RadarChart`.
- **Radial Chart** (`@dotui/chart-radial`) — Bars bent around a circle — progress against a target, or a few categories compared at a glance. Exports: `RadialBarChart`.

### Files

- **Drop Zone** (`@dotui/drop-zone`) — A drop zone is an area into which one or more objects can be dragged and dropped. Exports: `DropZone`, `DropZoneLabel`.
