"use client";

import {
  Menu,
  MenuItem,
  MenuTrigger,
  Button,
  Dialog,
  DialogTrigger,
  Heading,
  Input,
  Label,
  Modal,
  TextField,
  Popover,
  ModalOverlay,
} from "react-aria-components";

export default function Demo() {
  return (
    <>
      <DialogTrigger>
        <Button>Sign up…</Button>
        <ModalOverlay
          isDismissable
          className="fixed inset-0 z-50 bg-black/80 data-[exiting]:duration-300 data-[entering]:animate-in data-[exiting]:animate-out data-[entering]:fade-in-0 data-[exiting]:fade-out-0"
        >
          <Modal className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] border bg-background p-6 shadow-lg duration-200 data-[exiting]:duration-300 data-[entering]:animate-in data-[exiting]:animate-out data-[entering]:fade-in-0 data-[exiting]:fade-out-0 data-[entering]:zoom-in-95 data-[exiting]:zoom-out-95 data-[entering]:slide-in-from-left-1/2 data-[entering]:slide-in-from-top-[48%] data-[exiting]:slide-out-to-left-1/2 data-[exiting]:slide-out-to-top-[48%] sm:rounded-lg md:w-full">
            <Dialog>
              {({ close }) => (
                <form>
                  <Heading slot="title">Sign up</Heading>
                  <TextField autoFocus>
                    <Label>First Name</Label>
                    <Input />
                  </TextField>
                  <TextField>
                    <Label>Last Name</Label>
                    <Input />
                  </TextField>
                  <Button onPress={close} style={{ marginTop: 8 }}>
                    Submit
                  </Button>
                </form>
              )}
            </Dialog>
          </Modal>
        </ModalOverlay>
      </DialogTrigger>
      <MenuTrigger>
        <Button aria-label="Menu">☰</Button>
        <ModalOverlay
          isDismissable
          className="fixed inset-0 z-50 bg-black/80 data-[exiting]:duration-300 data-[entering]:animate-in data-[exiting]:animate-out data-[entering]:fade-in-0 data-[exiting]:fade-out-0"
        >
          <Modal className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] border bg-background p-6 shadow-lg duration-200 data-[exiting]:duration-300 data-[entering]:animate-in data-[exiting]:animate-out data-[entering]:fade-in-0 data-[exiting]:fade-out-0 data-[entering]:zoom-in-95 data-[exiting]:zoom-out-95 data-[entering]:slide-in-from-left-1/2 data-[entering]:slide-in-from-top-[48%] data-[exiting]:slide-out-to-left-1/2 data-[exiting]:slide-out-to-top-[48%] sm:rounded-lg md:w-full">
            <Menu>
              <MenuItem onAction={() => alert("open")}>Open</MenuItem>
              <MenuItem onAction={() => alert("rename")}>Rename…</MenuItem>
              <MenuItem onAction={() => alert("duplicate")}>Duplicate</MenuItem>
              <MenuItem onAction={() => alert("share")}>Share…</MenuItem>
              <MenuItem onAction={() => alert("delete")}>Delete…</MenuItem>
            </Menu>
          </Modal>
        </ModalOverlay>
      </MenuTrigger>
    </>
  );
}

// "use client";

// import React from "react";
// import { LogOutIcon, PlusIcon, Settings2Icon } from "lucide-react";
// import { Avatar } from "@/lib/components/core/default/avatar";
// import {
//   MenuContent,
//   MenuItem,
//   MenuRadioGroup,
//   MenuRadioItem,
//   MenuRoot,
//   MenuSeparator,
//   MenuSub,
//   MenuSubContent,
//   MenuSubTrigger,
//   MenuTrigger,
// } from "@/lib/components/core/default/menu";
// import { cn } from "@/lib/utils/classes";

// export default function MenuDemo() {
//   const [theme, setTheme] = React.useState("system");

//   return (
//     <MenuRoot>
//       {(isMobile) => (
//         <>
//           <MenuTrigger asChild>
//             <button>
//               <Avatar src="https://github.com/mehdibha.png" fallback="M" />
//             </button>
//           </MenuTrigger>
//           <MenuContent align="end">
//             <div className={cn("px-2 py-1.5 text-sm", isMobile && "text-md")}>
//               <p className={cn("font-semibold")}>mehdi</p>
//               <p className="text-fg-muted">hello@mehdibha.com</p>
//             </div>
//             <MenuItem suffix={<Settings2Icon />}>Account settings</MenuItem>
//             <MenuItem suffix={<PlusIcon />}>Create team</MenuItem>
//             <MenuSeparator />
//             <MenuSub>
//               <MenuItem shortcut="⌘+K">Command menu</MenuItem>
//               <MenuSubTrigger>Theme</MenuSubTrigger>
//               <MenuSubContent>
//                 <MenuRadioGroup
//                   value={theme}
//                   onValueChange={(newVal) => setTheme(newVal)}
//                 >
//                   <MenuRadioItem value="system">System</MenuRadioItem>
//                   <MenuRadioItem value="light">Light</MenuRadioItem>
//                   <MenuRadioItem value="dark">Dark</MenuRadioItem>
//                 </MenuRadioGroup>
//               </MenuSubContent>
//             </MenuSub>
//             <MenuSeparator />
//             <MenuItem suffix={<LogOutIcon />}>Log out</MenuItem>
//           </MenuContent>
//         </>
//       )}
//     </MenuRoot>
//   );
// }
