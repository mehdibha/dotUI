"use client";

import React from "react";
import { Button } from "@/lib/components/core/default/button";
import { Drawer } from "@/lib/components/core/default/drawer";
import { cn } from "@/lib/utils/classes";

export default function DrawerDemo() {
  const [open, setOpen] = React.useState(false);
  const [snap, setSnap] = React.useState<number | string | null>("230px");
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Drawer</Button>
      <Drawer
        open={open}
        onOpenChange={(show) => {
          setOpen(show);
        }}
        snapPoints={["230px", "440px", 1]}
        activeSnapPoint={snap}
        setActiveSnapPoint={setSnap}
      >
        <Content />
      </Drawer>
    </>
  );
}

const Content = () => {
  return (
    <div className={cn("mx-auto flex w-full max-w-md flex-col p-4 pt-5")}>
      <div className="flex items-center">
        <svg
          className="h-5 w-5 flex-shrink-0 text-yellow-400"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
            clip-rule="evenodd"
          ></path>
        </svg>
        <svg
          className="h-5 w-5 flex-shrink-0 text-yellow-400"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
            clip-rule="evenodd"
          ></path>
        </svg>
        <svg
          className="h-5 w-5 flex-shrink-0 text-yellow-400"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
            clip-rule="evenodd"
          ></path>
        </svg>
        <svg
          className="h-5 w-5 flex-shrink-0 text-yellow-400"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
            clip-rule="evenodd"
          ></path>
        </svg>
        <svg
          className="h-5 w-5 flex-shrink-0 text-gray-300"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </div>{" "}
      <h1 className="mt-2 text-2xl font-medium">The Hidden Details</h1>
      <p className="mb-6 mt-1 text-sm text-gray-600">2 modules, 27 hours of video</p>
      <p className="text-gray-600">
        The world of user interface design is an intricate landscape filled with hidden
        details and nuance. In this course, you will learn something cool. To the
        untrained eye, a beautifully designed UI.
      </p>
      <button className="mt-8 h-[48px] flex-shrink-0 rounded-md bg-black font-medium text-gray-50">
        Buy for $199
      </button>
      <div className="mt-12">
        <h2 className="text-xl font-medium">Module 01. The Details</h2>
        <div className="mt-4 space-y-4">
          <div>
            <span className="block">Layers of UI</span>
            <span className="text-gray-600">
              A basic introduction to Layers of Design.
            </span>
          </div>
          <div>
            <span className="block">Typography</span>
            <span className="text-gray-600">The fundamentals of type.</span>
          </div>
          <div>
            <span className="block">UI Animations</span>
            <span className="text-gray-600">
              Going through the right easings and durations.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
