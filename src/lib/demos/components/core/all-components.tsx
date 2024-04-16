import AccordionDemo from "./accordion";
import AlertDemo from "./alert";
import AlertDialogDemo from "./alert-dialog";
import AspectRatioDemo from "./aspect-ratio";
import AvatarDemo from "./avatar";
import AvatarGroupDemo from "./avatar-group";
import BreadcrumbDemo from "./breadcrumb";
import ButtonDemo from "./button/default";
import CalendarDemo from "./calendar";
import CardDemo from "./card";
import CarouselDemo from "./carousel";
import CheckboxDemo from "./checkbox";
import CollapsibleDemo from "./collapsible";
import ComboboxDemo from "./combobox";
import CommandDemo from "./command";
import ContextMenuDemo from "./context-menu";
import DataTableDemo from "./data-table";
import DatePickerDemo from "./date-picker";
import DialogDemo from "./dialog";
import DrawerDemo from "./drawer";
import DropdownMenuDemo from "./dropdown-menu";
import HoverCardDemo from "./hover-card";
import InputOTPDemo from "./input-otp";
import LabelDemo from "./label";
import MenubarDemo from "./menu-bar";
import NavigationMenuDemo from "./navigation-menu";
import PaginationDemo from "./pagination";
import PopoverDemo from "./popover";
import ProgressDemo from "./progress";
import RadioGroupDemo from "./radio-group";
import ResizableDemo from "./resizable";
import ScrollAreaDemo from "./scroll-area";
import SelectDemo from "./select";
import SeparatorDemo from "./seperator";
import SheetDemo from "./sheet";
import SkeletonDemo from "./skeleton";
import SliderDemo from "./slider";
import SonnerDemo from "./sonner";
import SwitchDemo from "./switch";
import TableDemo from "./table";
import TabsDemo from "./tabs";
import TextareaDemo from "./textarea";
import ToastDemo from "./toast";
import ToggleDemo from "./toggle";
import ToggleGroupDemo from "./toggle-group";
import TooltipDemo from "./tooltip";

export default function AllComponents() {
  return (
    <div className="p-6">
      <div>
        <h2 className="ml-32 text-lg font-bold tracking-tight">Navigation.</h2>
        <div className="mt-6 flex items-center gap-4">
          <div>
            <NavigationMenuDemo />
          </div>
          <div>
            <PaginationDemo />
          </div>
        </div>
        <div className="mt-2 flex items-start gap-4">
          <CollapsibleDemo />
          <div className="mt-2">
            <BreadcrumbDemo />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 items-start gap-6">
        {/* Col 1 */}
        <div className="mt-6">
          <h2 className="text-lg font-bold tracking-tight">Inputs.</h2>
          <div className="mt-6 space-y-4">
            <ButtonDemo />
            <CheckboxDemo />
            <ComboboxDemo />
            <DatePickerDemo />
            <LabelDemo />
            <InputOTPDemo />
            <MenubarDemo />
            <RadioGroupDemo />
            <SelectDemo />
            <SliderDemo />
            <SwitchDemo />
            <div className="max-w-sm">
              <TabsDemo />
            </div>
            <TextareaDemo />
            <div className="flex space-x-4">
              <ToggleGroupDemo />
              <ToggleDemo />
            </div>
          </div>
        </div>
        {/* Col 2 */}
        <div className="mt-4">
          <CommandDemo />
          <div className="mt-14">
            <h2 className="mt-6 text-lg font-bold tracking-tight">Overlay.</h2>
            <div className="mt-6 space-y-2">
              <ContextMenuDemo />
              <div className="flex justify-between">
                <AlertDialogDemo />
                <PopoverDemo />
              </div>
              <div className="flex flex-col items-end space-y-2">
                <DrawerDemo />
                <DialogDemo />
                <DropdownMenuDemo />
                <SheetDemo />
                <TooltipDemo />
                <HoverCardDemo />
              </div>
            </div>
          </div>
        </div>
        {/* Col 3 */}
        <div className="-mt-4">
          <h2 className="text-lg font-bold tracking-tight">Feedback.</h2>
          <div className="mt-6">
            <div className="space-y-4">
              <AlertDemo />
              <ProgressDemo />
              <SkeletonDemo />
              <SonnerDemo />
              <ToastDemo />
            </div>
            <h2 className="mt-6 text-lg font-bold tracking-tight">Layout.</h2>
            <div className="mt-6 space-y-4">
              <AspectRatioDemo />
              <ResizableDemo />
              <ScrollAreaDemo />
            </div>
          </div>
        </div>
      </div>
      <div className="-mt-10 grid grid-cols-2 gap-6">
        <div />
        <h2 className="-ml-12 text-lg font-bold tracking-tight">Data display.</h2>
        <AccordionDemo />
        <div className="space-y-4">
          <div className="flex space-x-4">
            <AvatarDemo />
            <AvatarGroupDemo />
          </div>
          <SeparatorDemo />
        </div>
        <div className="flex items-center justify-center">
          <CalendarDemo />
        </div>
        <CardDemo />
      </div>
      <div className="mt-4 grid grid-cols-2">
        <div className="ml-6">
          <CarouselDemo />
        </div>
        <div>
          <TableDemo />
        </div>
      </div>
      <div className="mt-6">
        <DataTableDemo />
      </div>
    </div>
  );
}
