"use client";

import React from "react";
import Link from "next/link";
import { LayoutGroup, motion } from "framer-motion";
import {
  AlignCenterIcon,
  ArrowRightIcon,
  AtSignIcon,
  BarChart4Icon,
  BellIcon,
  BluetoothIcon,
  BoldIcon,
  BriefcaseIcon,
  Clock2Icon,
  CloudIcon,
  CodeIcon,
  InboxIcon,
  LinkIcon,
  MailIcon,
  MoonIcon,
  SearchIcon,
  SparklesIcon,
  ThumbsUpIcon,
  UserRoundIcon,
} from "lucide-react";
import Balancer from "react-wrap-balancer";
import { badgeVariants } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/classes";

export const Hero = ({ className }: { className?: string }) => {
  return (
    <section className={cn("flex items-start justify-between space-x-8", className)}>
      <div>
        <Link
          href="https://github.com/mehdibha/rcopy"
          target="_blank"
          className={cn(
            badgeVariants({ variant: "outline", size: "md" }),
            "cursor-pointer space-x-2 font-mono delay-75 duration-200 hover:bg-secondary"
          )}
        >
          <SparklesIcon size={18} />
          <span>Star us on GitHub</span> <ArrowRightIcon size={15} />
        </Link>
        <h1 className="mt-4 font-display text-6xl font-bold leading-tight tracking-tight">
          <Balancer>Everything you need to build your React app</Balancer>
        </h1>
        <h2 className="text-md mt-6 text-muted-foreground md:text-lg lg:text-xl">
          Copy the code, paste it, customize it, own it. Done.
        </h2>
        <div className="mt-10 flex space-x-4">
          <Button size="lg" variant="default">
            Explore components
          </Button>
          <Button size="lg" variant="outline">
            <SearchIcon size={20} className="mr-2" />
            Quick search
          </Button>
        </div>
      </div>
      <Animation />
    </section>
  );
};

const Animation = () => {
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
    <div className="relative w-[300px]">
      <LayoutGroup>
        {selectedTab === 0 && (
          <motion.div key={0} {...animationProps} className="h-96 w-full">
            <h2 className="text-3xl font-bold">Components.</h2>
            <div className="mt-4 grid grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="h-16 rounded-md bg-card shadow"></div>
              ))}
            </div>
          </motion.div>
        )}
        {selectedTab === 1 && (
          <motion.div key={1} {...animationProps} className="h-96 w-full">
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
          <motion.div key={2} {...animationProps} className="h-96 w-full">
            <h2 className="text-3xl font-bold">Icons.</h2>
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
                BarChart4Icon,
                BluetoothIcon,
                BriefcaseIcon,
                Clock2Icon,
                CloudIcon,
                UserRoundIcon,
                ThumbsUpIcon,
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
