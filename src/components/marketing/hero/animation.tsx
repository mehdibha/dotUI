"use client";

import React from "react";
import { LayoutGroup, motion } from "framer-motion";
import { IconExemples } from "@/components/marketing/icon-exemples";
import Filter from "@/lib/blocks/application-ui/filter";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/lib/components/core/default/avatar";
import { AvatarGroup } from "@/lib/components/core/default/avatar-group";
import { Button } from "@/lib/components/core/default/button";
import { Switch } from "@/lib/components/core/default/switch";
import CalendarDemo from "@/lib/demos/components/core/calendar";
import ComboboxDemo from "@/lib/demos/components/core/combobox";

export const Animation = () => {
  const [selectedTab, setSelectedTab] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setSelectedTab((prevTab) => (prevTab + 1) % 5); // Modulo 5 to cycle through tabs
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const animationProps = {
    initial: { y: 10, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.4 },
    layoutId: "underline",
  };

  return (
    <div>
      <LayoutGroup>
        {selectedTab === 0 && (
          <motion.div key={0} {...animationProps} className="h-[450px] w-[350px]">
            <h2 className="text-3xl font-bold">components.</h2>
            <div className="mt-4 space-y-4">
              <AvatarGroup>
                {[
                  { name: "@mehdibha", src: "https://github.com/mehdibha.png" },
                  { name: "@shadcn", src: "https://github.com/shadcn.png" },
                  { name: "@leerob", src: "https://github.com/leerob.png" },
                  { name: "@t3dotgg", src: "https://github.com/t3dotgg.png" },
                  {
                    name: "@joshwcomeau",
                    src: "https://github.com/joshwcomeau.png",
                  },
                ].map((user) => (
                  <Avatar key={user.name}>
                    <AvatarImage src={user.src} alt={user.name} />
                    <AvatarFallback>{user.name[1]}</AvatarFallback>
                  </Avatar>
                ))}
              </AvatarGroup>
              <div className="flex items-center space-x-4">
                <Switch />
                <Button variant="secondary">Button</Button>
                <ComboboxDemo />
              </div>
              <div className="flex justify-start">
                <CalendarDemo />
              </div>
            </div>
          </motion.div>
        )}
        {selectedTab === 1 && (
          <motion.div key={1} {...animationProps} className="h-[450px] w-[350px]">
            <h2 className="text-3xl font-bold">hooks.</h2>
            <div className="mt-4 grid grid-cols-1 gap-4">
              {["useDebounce", "useWindowSize", "useScroll"].map((hookName, i) => (
                <div key={i} className="rounded-md bg-card p-4 shadow">
                  <p className="font-semibold">{hookName}</p>
                  <p className="text-muted-foreground">
                    Delay the execution of function or state update with useDebounce.
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
        {selectedTab === 2 && (
          <motion.div key={2} {...animationProps} className="h-[450px] w-[350px]">
            <h2 className="text-3xl font-bold">blocks.</h2>
            <div className="mt-4">
              <Filter />
            </div>
          </motion.div>
        )}
        {selectedTab === 3 && (
          <motion.div key={3} {...animationProps} className="h-[450px] w-[350px]">
            <h2 className="text-3xl font-bold">icons.</h2>
            <div className="mt-4 grid grid-cols-5 gap-2">
              <IconExemples limit={20} />
            </div>
          </motion.div>
        )}
        {selectedTab === 4 && (
          <motion.div key={4} {...animationProps} className="h-[450px] w-[350px]">
            <h2 className="text-3xl font-bold">templates.</h2>
            <div className="mt-4 flex gap-2">
              <div className="flex flex-1 flex-col gap-2">
                <img
                  src="/previews/templates/taxonomy.png"
                  alt="turbocharger"
                  className="max-h-[100px] rounded-md object-cover object-bottom shadow"
                />
                <img
                  src="/previews/templates/turbocharger.png"
                  alt="turbocharger"
                  className="max-h-[250px] rounded-md object-cover object-top shadow"
                />
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <img
                  src="/previews/templates/turbocharger.png"
                  alt="turbocharger"
                  className="max-h-[250px] rounded-md object-cover object-bottom shadow"
                />
                <img
                  src="/previews/templates/taxonomy.png"
                  alt="turbocharger"
                  className="max-h-[100px] rounded-md object-cover object-top shadow"
                />
              </div>
            </div>
          </motion.div>
        )}
      </LayoutGroup>
    </div>
  );
};
