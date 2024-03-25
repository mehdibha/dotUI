"use client";

import React from "react";
import { LayoutGroup, motion } from "framer-motion";
import {
  AlignCenterIcon,
  AtSignIcon,
  BarChart4Icon,
  BellIcon,
  BluetoothIcon,
  BoldIcon,
  CodeIcon,
  InboxIcon,
  LinkIcon,
  MailIcon,
  MoonIcon,
  UserRoundIcon,
} from "lucide-react";

export const Animation = () => {
  const [selectedTab, setSelectedTab] = React.useState(2);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setSelectedTab((prevTab) => (prevTab + 1) % 3); // Modulo 4 to cycle through tabs
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const animationProps = {
    initial: { y: 10, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    // exit: { y: -10, opacity: 0 },
    transition: { duration: 0.4 },
    layoutId: "underline",
  };

  return (
    <div>
      <LayoutGroup>
        {selectedTab === 0 && (
          <motion.div key={0} {...animationProps} className="h-96 w-[300px]">
            <h2 className="text-3xl font-bold">components.</h2>
            <div className="mt-4 grid grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="h-16 rounded-md bg-card shadow"></div>
              ))}
            </div>
          </motion.div>
        )}
        {selectedTab === 1 && (
          <motion.div key={1} {...animationProps} className="h-96 w-[300px]">
            <h2 className="text-3xl font-bold">hooks.</h2>
            <div className="mt-4 grid grid-cols-1 gap-4">
              {["useDebounce", "useWindowSize", "useScroll"].map((hookName, i) => (
                <div key={i} className="rounded-md bg-card p-4 shadow">
                  <p className="font-semibold">{hookName}</p>
                  <p className="truncate text-muted-foreground">
                    Delay the execution of function or state update with useDebounce.
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
        {selectedTab === 2 && (
          <motion.div key={2} {...animationProps} className="h-96 w-[300px]">
            <h2 className="text-3xl font-bold">icons.</h2>
            <div className="mt-4 grid grid-cols-4 gap-4">
              {[
                CodeIcon,
                BellIcon,
                InboxIcon,
                MoonIcon,
                MailIcon,
                AtSignIcon,
                LinkIcon,
                AlignCenterIcon,
                BoldIcon,
                UserRoundIcon,
                BarChart4Icon,
                BluetoothIcon,
              ].map((Icon, i) => (
                <div
                  key={i}
                  className="flex h-16 items-center justify-center rounded-md bg-card shadow"
                >
                  <Icon size={30} />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </LayoutGroup>
    </div>
  );
};
