"use client";

import React from "react";

export default function MenuDemo() {
  const [position, setPosition] = React.useState("bottom");
  return null;
  // return (
  //   <MenuRoot>
  //     <MenuTrigger asChild>
  //       <Button variant="outline">Sort</Button>
  //     </MenuTrigger>
  //     <MenuContent align="end">
  //       <MenuLabel>Sort shows</MenuLabel>
  //       <MenuSeparator />
  //       <MenuRadioGroup value={position} onValueChange={setPosition}>
  //         <MenuRadioItem value="top">Title</MenuRadioItem>
  //         <MenuRadioItem value="bottom">Date added</MenuRadioItem>
  //         <MenuRadioItem value="right">Manual</MenuRadioItem>
  //       </MenuRadioGroup>
  //     </MenuContent>
  //   </MenuRoot>
  // );
}
