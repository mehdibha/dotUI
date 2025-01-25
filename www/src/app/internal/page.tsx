"use client";

import React from "react";
import { motion } from "motion/react";
import { Tabs, TabList, Tab, TabPanel } from "react-aria-components";
import { tv } from "tailwind-variants";
import { focusRing } from "@/registry/lib/focus-styles";

export default function Demo() {
  const [selectedTab, setSelectedTab] = React.useState("tomato");

  return (
    <div className="space-y-4">
      <div className="h-screen bg-white text-black">
        <ul className="flex w-[200px]">
          {["tomato", "lettuce", "hello"].map((item, index) => (
            <li
              key={index}
              style={{ width: "100%" }}
              className="relative p-[5px_15px] w-full"
              // style={{ position: "relative", padding: "8px", minWidth: 0 , display: "flex"}}
              // className="relative min-w-0 p-2"
              // className="relative p-2"
              // style={{ width: "100%" }}
              onClick={() => setSelectedTab(item)}
            >
              {item}
              {item === selectedTab && (
                <motion.div
                  className="bg-bg-accent absolute inset-x-0 bottom-0 h-[2px]"
                  layoutId="underline"
                />
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const tab: React.CSSProperties = {
  position: "relative",
  width: "100%",
  // borderRadius: 5,
  // borderBottomLeftRadius: 0,
  // borderBottomRightRadius: 0,
  // padding: "10px 15px",

  // background: "white",
  // cursor: "pointer",
  // height: 24,
  // display: "flex",
  // justifyContent: "space-between",
  // alignItems: "center",
  // flex: 1,
  // minWidth: 0,
  // userSelect: "none",
};
