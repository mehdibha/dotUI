import React from "react";
import { CircleIcon, FileIcon } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SearchDialog = (props: SearchDialogProps) => {
  const { open, onOpenChange } = props;
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Components">
          <CommandItem>
            {/* <FileIcon className="mr-2 h-4 w-4" /> */}
            salem
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Hooks">
          <CommandItem value="hey" onSelect={() => {console.log('yay')}}>
            {/* <div className="mr-2 flex h-4 w-4 items-center justify-center">
              <CircleIcon className="h-3 w-3" />
            </div> */}
            salem
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
      </CommandList>
    </CommandDialog>
  );
};
