"use client";

// type Side = Exclude<React.ComponentProps<typeof MenuContent>["side"], undefined>;
// type Align = Exclude<React.ComponentProps<typeof MenuContent>["align"], undefined>;

export default function MenuDemo() {
  return null;
  // const [side, setSide] = React.useState<Side>("bottom");
  // const [align, setAlign] = React.useState<Align>("end");
  // return (
  //   <div className="flex items-center gap-16">
  //     <MenuRoot>
  //       <MenuTrigger asChild>
  //         <Button shape="square" variant="ghost" aria-label="menu">
  //           <MenuIcon />
  //         </Button>
  //       </MenuTrigger>
  //       <MenuContent align={align} side={side}>
  //         <MenuItem>Profile</MenuItem>
  //         <MenuItem>Billing</MenuItem>
  //         <MenuItem>Settings</MenuItem>
  //       </MenuContent>
  //     </MenuRoot>
  //     <div className="flex gap-4">
  //       <div className="space-y-2">
  //         <Label>Side</Label>
  //         <RadioGroup value={side} onChange={(newVal) => setSide(newVal as Side)}>
  //           <Radio value="top">Top</Radio>
  //           <Radio value="bottom">Bottom</Radio>
  //           <Radio value="right">Right</Radio>
  //           <Radio value="left">Left</Radio>
  //         </RadioGroup>
  //       </div>
  //       <div className="space-y-2">
  //         <Label>Align</Label>
  //         <RadioGroup value={align} onChange={(newVal) => setAlign(newVal as Align)}>
  //           <Radio value="start">Start</Radio>
  //           <Radio value="center">Center</Radio>
  //           <Radio value="end">End</Radio>
  //         </RadioGroup>
  //       </div>
  //     </div>
  //   </div>
  // );
}
