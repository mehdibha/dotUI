// "use client";

// import * as React from "react";
// import { Check, ChevronRightIcon, Circle } from "lucide-react";
// // import { Drawer as DrawerPrimitive } from "vaul";
// import { useMediaQuery } from "@/lib/hooks/use-media-query";
// import { cn } from "@/lib/utils/classes";

// type MenuContext = {
//   isMobile: boolean;
//   open: boolean;
//   onOpenChange: (show: boolean) => void;
//   showDrawerSwipeBar?: boolean;
// };

// const MenuScopeContext = React.createContext<MenuContext | null>(null);

// function useMenuScopeContext() {
//   const context = React.useContext(MenuScopeContext);
//   if (!context) {
//     throw new Error("useMenuScopeContext must be used within a <MenuRoot />");
//   }
//   return context;
// }

// interface MenuRootProps
//   extends Omit<React.ComponentProps<typeof MenuPrimitive.Root>, "children"> {
//   children?: ((isMobile: boolean) => React.ReactNode) | React.ReactNode;
//   showDrawerSwipeBar?: boolean;
// }

// const MenuRoot = ({
//   dir,
//   defaultOpen,
//   open: openProp,
//   onOpenChange: onOpenChangeProp,
//   showDrawerSwipeBar = true,
//   children,
//   ...props
// }: MenuRootProps) => {
//   const isMobile = useMediaQuery("(max-width: 768px)");
//   const [open_, setOpen] = React.useState(false);
//   const onOpenChange_ = (show: boolean) => {
//     setOpen(show);
//   };
//   const open = openProp ?? open_;
//   const onOpenChange = onOpenChangeProp ?? onOpenChange_;

//   if (isMobile) {
//     return (
//       <MenuScopeContext.Provider
//         value={{
//           open,
//           onOpenChange,
//           isMobile,
//           showDrawerSwipeBar,
//         }}
//       >
//         <DrawerPrimitive.Root
//           direction="bottom"
//           open={open}
//           onOpenChange={onOpenChange}
//           shouldScaleBackground
//           {...props}
//         >
//           {typeof children === "function" ? children(isMobile) : children}
//         </DrawerPrimitive.Root>
//       </MenuScopeContext.Provider>
//     );
//   }
//   return (
//     <MenuScopeContext.Provider
//       value={{ open, onOpenChange, showDrawerSwipeBar, isMobile }}
//     >
//       <MenuPrimitive.Root
//         open={open}
//         onOpenChange={onOpenChange}
//         defaultOpen={defaultOpen}
//         dir={dir}
//         {...props}
//       >
//         {typeof children === "function" ? children(isMobile) : children}
//       </MenuPrimitive.Root>
//     </MenuScopeContext.Provider>
//   );
// };
// MenuRoot.displayName = "MenuRoot";

// const MenuTrigger = React.forwardRef<
//   React.ElementRef<typeof MenuPrimitive.Trigger>,
//   React.ComponentPropsWithoutRef<typeof MenuPrimitive.Trigger>
// >((props, ref) => {
//   const { isMobile } = useMenuScopeContext();
//   if (isMobile) {
//     return <DrawerPrimitive.Trigger ref={ref} {...props} />;
//   }
//   return <MenuPrimitive.Trigger ref={ref} {...props} />;
// });
// MenuTrigger.displayName = "MenuTrigger";

// interface MenuContentProps
//   extends React.ComponentPropsWithoutRef<typeof MenuPrimitive.Content> {
//   drawerContentProps?: React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>;
// }

// const MenuContent = React.forwardRef<
//   React.ElementRef<typeof MenuPrimitive.Content>,
//   MenuContentProps
// >(
//   (
//     {
//       className,
//       children,
//       sideOffset = 4,
//       align = "start",
//       drawerContentProps,
//       ...props
//     },
//     ref
//   ) => {
//     const { showDrawerSwipeBar, isMobile } = useMenuScopeContext();

//     if (isMobile) {
//       return (
//         <DrawerPrimitive.Portal>
//           <DrawerPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80" />
//           <DrawerPrimitive.Content
//             ref={ref}
//             {...drawerContentProps}
//             className={cn(
//               "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-bg",
//               drawerContentProps?.className
//             )}
//           >
//             {showDrawerSwipeBar && (
//               <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-bg-muted" />
//             )}
//             <div className="p-2">{children}</div>
//           </DrawerPrimitive.Content>
//         </DrawerPrimitive.Portal>
//       );
//     }
//     return (
//       <MenuPrimitive.Portal>
//         <MenuPrimitive.Content
//           ref={ref}
//           sideOffset={sideOffset}
//           align={align}
//           className={cn(
//             "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
//             className
//           )}
//           {...props}
//         >
//           {children}
//         </MenuPrimitive.Content>
//       </MenuPrimitive.Portal>
//     );
//   }
// );
// MenuContent.displayName = "MenuContent";

// type MenuItemProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Item> & {
//   prefix?: React.ReactNode;
//   suffix?: React.ReactNode;
//   shortcut?: React.ReactNode;
// };

// const MenuItem = React.forwardRef<
//   React.ElementRef<typeof MenuPrimitive.Item>,
//   MenuItemProps
// >(
//   (
//     {
//       className,
//       asChild,
//       disabled,
//       onSelect,
//       textValue,
//       shortcut,
//       suffix,
//       prefix,
//       ...props
//     },
//     ref
//   ) => {
//     const { isMobile } = useMenuScopeContext();

//     const Comp = asChild ? Slot : "div";

//     if (isMobile) {
//       return (
//         <DrawerPrimitive.Close asChild>
//           <Comp
//             ref={ref}
//             role="button"
//             tabIndex={disabled ? -1 : 0}
//             className={cn(
//               "text-md flex h-12 w-full cursor-pointer select-none items-center rounded-md px-2 text-left text-fg transition-colors hover:bg-bg-inverse/10 active:bg-bg-inverse/15 focus:ring focus:ring-border-focus focus:outline-none data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:text-fg-disabled",
//               className
//             )}
//             aria-disabled={disabled ?? undefined}
//             data-disabled={disabled ? "" : undefined}
//             {...props}
//           >
//             {prefix && (
//               <span className="pointer-events-none mr-2 [&_svg]:size-4">{prefix}</span>
//             )}
//             <span className="flex-1">{props.children}</span>
//             {suffix && (
//               <span className="pointer-events-none ml-4 [&_svg]:size-5">{suffix}</span>
//             )}
//           </Comp>
//         </DrawerPrimitive.Close>
//       );
//     }

//     return (
//       <MenuPrimitive.Item
//         ref={ref}
//         className={cn(
//           "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:text-fg-disabled",
//           className
//         )}
//         disabled={disabled}
//         // onSelect={onSelect as typeof MenuPrimitive.Item.defaultProps.onSelect}
//         onSelect={onSelect}
//         // asChild={asChild}
//         textValue={textValue}
//         {...props}
//       >
//         {prefix && (
//           <span className="pointer-events-none mr-2 [&_svg]:size-4">{prefix}</span>
//         )}
//         <span className="flex-1">{props.children}</span>
//         {(suffix ?? shortcut) && (
//           <div className="ml-4 flex items-center space-x-2">
//             {suffix && (
//               <span className="pointer-events-none [&_svg]:size-4">{suffix}</span>
//             )}
//             {shortcut && (
//               <span className="text-xs tracking-widest text-fg-muted">{shortcut}</span>
//             )}
//           </div>
//         )}
//       </MenuPrimitive.Item>
//     );
//   }
// );
// MenuItem.displayName = "MenuItem";

// const MenuGroup = React.forwardRef<
//   React.ElementRef<typeof MenuPrimitive.Group>,
//   React.ComponentPropsWithoutRef<typeof MenuPrimitive.Group>
// >((props, ref) => {
//   const { isMobile } = useMenuScopeContext();
//   if (isMobile) {
//     return props.children;
//   }
//   return <MenuPrimitive.Group ref={ref} {...props} />;
// });
// MenuGroup.displayName = "MenuGroup";

// type MenuSubProps = React.ComponentProps<typeof MenuPrimitive.Sub>;

// const MenuSub = (props: MenuSubProps) => {
//   const { isMobile } = useMenuScopeContext();

//   const { children } = props;

//   if (isMobile) {
//     return <DrawerPrimitive.NestedRoot>{children}</DrawerPrimitive.NestedRoot>;
//   }
//   return <MenuPrimitive.Sub {...props} />;
// };

// const MenuSubTrigger = React.forwardRef<
//   React.ElementRef<typeof MenuPrimitive.SubTrigger>,
//   React.ComponentPropsWithoutRef<typeof MenuPrimitive.SubTrigger> & {
//     inset?: boolean;
//   }
// >(({ className, inset, children, ...props }, ref) => {
//   const { isMobile } = useMenuScopeContext();
//   if (isMobile) {
//     return (
//       <DrawerPrimitive.Trigger asChild>
//         <button
//           className={cn(
//             "text-md flex h-12 w-full items-center rounded-md px-2 outline-none transition-all focus:ring-2 focus:ring-border-focus [&[data-state=open]>svg]:rotate-90"
//           )}
//         >
//           <span className="flex-1 text-left">{children}</span>
//           <ChevronRightIcon className="h-4 w-4 shrink-0 transition-transform duration-200" />
//         </button>
//       </DrawerPrimitive.Trigger>
//     );
//   }
//   return (
//     <MenuPrimitive.SubTrigger
//       ref={ref}
//       className={cn(
//         "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent",
//         inset && "pl-8",
//         className
//       )}
//       {...props}
//     >
//       {children}
//       <ChevronRightIcon className="ml-auto h-4 w-4" />
//     </MenuPrimitive.SubTrigger>
//   );
// });
// MenuSubTrigger.displayName = MenuPrimitive.SubTrigger.displayName;

// const MenuSubContent = React.forwardRef<
//   React.ElementRef<typeof MenuPrimitive.SubContent>,
//   React.ComponentPropsWithoutRef<typeof MenuPrimitive.SubContent>
// >(({ className, ...props }, ref) => {
//   const { isMobile } = useMenuScopeContext();
//   if (isMobile) {
//     return (
//       <DrawerPrimitive.Portal>
//         <DrawerPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80" />
//         <DrawerPrimitive.Content
//           ref={ref}
//           // {...drawerContentProps}
//           className={cn(
//             "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-bg"
//             // drawerContentProps?.className
//           )}
//         >
//           {true && (
//             <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-bg-muted" />
//           )}
//           <div className="p-2">{props.children}</div>
//         </DrawerPrimitive.Content>
//       </DrawerPrimitive.Portal>
//     );
//   }
//   return (
//     <MenuPrimitive.SubContent
//       ref={ref}
//       className={cn(
//         "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
//         className
//       )}
//       {...props}
//     />
//   );
// });
// MenuSubContent.displayName = MenuPrimitive.SubContent.displayName;

// export type MenuRadioGroupProps = Omit<
//   React.ComponentPropsWithoutRef<typeof MenuPrimitive.RadioGroup>,
//   "dir" | "defaultValue"
// > &
//   React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>;

// const MenuRadioGroup = React.forwardRef<
//   React.ElementRef<typeof MenuPrimitive.RadioGroup>,
//   MenuRadioGroupProps
// >((props, ref) => {
//   const { isMobile } = useMenuScopeContext();
//   if (isMobile) {
//     return <RadioGroupPrimitive.Root ref={ref} {...props} />;
//   }
//   return <MenuPrimitive.RadioGroup ref={ref} {...props} />;
// });
// MenuRadioGroup.displayName = "MenuRadioGroup";

// const MenuRadioItem = React.forwardRef<
//   React.ElementRef<typeof MenuPrimitive.RadioItem | typeof RadioGroupPrimitive.Item>,
//   React.ComponentPropsWithoutRef<typeof MenuPrimitive.RadioItem>
// >(({ className, children, ...props }, ref) => {
//   const { isMobile } = useMenuScopeContext();
//   if (isMobile) {
//     return (
//       <DrawerPrimitive.Close asChild>
//         <RadioGroupPrimitive.Item
//           ref={ref as React.RefObject<HTMLButtonElement>}
//           className={cn(
//             "relative flex h-12 w-full cursor-pointer select-none items-center rounded-md py-1.5 pl-10 transition-colors pr-2 text-sm outline-none focus:bg-[#1F6FEB] focus:text-[#000] data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
//             className
//           )}
//           value={props.value}
//         >
//           <RadioGroupPrimitive.Indicator
//             className={cn(
//               "absolute left-2 flex size-6 items-center justify-center",
//               className
//             )}
//           >
//             <Check className="size-5" />
//           </RadioGroupPrimitive.Indicator>
//           <span>{children}</span>
//         </RadioGroupPrimitive.Item>
//       </DrawerPrimitive.Close>
//     );
//   }
//   return (
//     <MenuPrimitive.RadioItem
//       ref={ref as React.RefObject<HTMLDivElement>}
//       className={cn(
//         "relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 transition-colors text-sm outline-none  focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
//         className
//       )}
//       {...props}
//     >
//       <MenuPrimitive.ItemIndicator asChild>
//         <Check className="absolute left-1.5 flex size-5" />
//       </MenuPrimitive.ItemIndicator>
//       {children}
//     </MenuPrimitive.RadioItem>
//   );
// });
// MenuRadioItem.displayName = MenuPrimitive.RadioItem.displayName;

// const MenuCheckboxItem = React.forwardRef<
//   React.ElementRef<typeof MenuPrimitive.CheckboxItem>,
//   React.ComponentPropsWithoutRef<typeof MenuPrimitive.CheckboxItem>
// >(({ className, children, checked, ...props }, ref) => {
//   const { isMobile } = useMenuScopeContext();
//   if (isMobile) {
//     return (
//       <DrawerPrimitive.Close asChild>
//         <CheckboxPrimitive.Root
//           className={cn(
//             "relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-9 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
//             className
//           )}
//         >
//           <CheckboxPrimitive.Indicator className="absolute left-2 flex size-5">
//             <Check />
//           </CheckboxPrimitive.Indicator>
//         </CheckboxPrimitive.Root>
//       </DrawerPrimitive.Close>
//     );
//   }
//   return (
//     <MenuPrimitive.CheckboxItem
//       ref={ref}
//       className={cn(
//         "relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-9 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
//         className
//       )}
//       checked={checked}
//       {...props}
//     >
//       <MenuPrimitive.ItemIndicator className="absolute left-1.5 flex size-4">
//         <Check />
//       </MenuPrimitive.ItemIndicator>
//       {children}
//     </MenuPrimitive.CheckboxItem>
//   );
// });
// MenuCheckboxItem.displayName = MenuPrimitive.CheckboxItem.displayName;

// const MenuLabel = React.forwardRef<
//   React.ElementRef<typeof MenuPrimitive.Label>,
//   React.ComponentPropsWithoutRef<typeof MenuPrimitive.Label> & {
//     inset?: boolean;
//   }
// >(({ className, inset, ...props }, ref) => (
//   <MenuPrimitive.Label
//     ref={ref}
//     className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}
//     {...props}
//   />
// ));
// MenuLabel.displayName = MenuPrimitive.Label.displayName;

// const MenuSeparator = React.forwardRef<
//   React.ElementRef<typeof MenuPrimitive.Separator>,
//   React.ComponentPropsWithoutRef<typeof MenuPrimitive.Separator>
// >(({ className, ...props }, ref) => (
//   <MenuPrimitive.Separator
//     ref={ref}
//     className={cn("-mx-1 my-1 h-px bg-bg-muted", className)}
//     {...props}
//   />
// ));
// MenuSeparator.displayName = MenuPrimitive.Separator.displayName;

// const MenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
//   return (
//     <span
//       className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
//       {...props}
//     />
//   );
// };
// MenuShortcut.displayName = "MenuShortcut";

// export {
//   MenuRoot,
//   MenuTrigger,
//   MenuContent,
//   MenuItem,
//   MenuCheckboxItem,
//   MenuRadioItem,
//   MenuLabel,
//   MenuSeparator,
//   MenuShortcut,
//   MenuGroup,
//   MenuSub,
//   MenuSubContent,
//   MenuSubTrigger,
//   MenuRadioGroup,
// };
