"use client";

import React from "react";
import { Dialog, DialogRoot } from "@/registry/ui/default/core/dialog";
import { Radio, RadioGroup } from "@/registry/ui/default/core/radio-group";

export const ExploreThemesDialog = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <DialogRoot>
      {children}
      <Dialog type="drawer" className="container max-w-screen-xl !py-8">
        <h2 className="text-lg font-bold">Themes</h2>
        <p className="text-fg-muted text-sm">
          Curated collection of handcrafted themes, inspired by leading brands
          and designed to elevate your project&apos;s visual identity.
        </p>
        <RadioGroup
          variant="card"
          orientation="horizontal"
          className="mt-4 gap-2"
        >
          {[
            { name: "Default", value: "default" },
            { name: "Ruby", value: "ruby" },
            { name: "GitHub", value: "github" },
            { name: "Vercel", value: "vercel" },
          ].map((theme, index) => (
            <Radio key={index} value={theme.value}>
              <div className="p-0">
                <p className="font-semibold">{theme.name}</p>
                <p className="text-fg-muted text-sm">
                  Lorem ipsum dolor sit amet...
                </p>
              </div>
              <div className="mt-2 grid grid-cols-5 overflow-hidden rounded">
                <div className="h-5 bg-slate-600" />
                <div className="h-5 bg-green-500" />
                <div className="h-5 bg-red-500" />
                <div className="h-5 bg-amber-500" />
                <div className="h-5 bg-blue-700" />
              </div>
            </Radio>
          ))}
        </RadioGroup>
        <h2 className="mt-6 text-lg font-bold">Your themes</h2>
        <p className="text-fg-muted text-sm">
          Custom themes you create will appear here.
        </p>
        <RadioGroup
          variant="card"
          orientation="horizontal"
          className="mt-4 gap-2"
        >
          {[{ name: "dotUI", value: "dotUI" }].map((theme, index) => (
            <Radio key={index} value={theme.value}>
              <div className="p-0">
                <p className="font-semibold">{theme.name}</p>
                <p className="text-fg-muted text-sm">
                  Lorem ipsum dolor sit amet...
                </p>
              </div>
              <div className="mt-2 grid grid-cols-5 overflow-hidden rounded">
                <div className="h-5 bg-slate-600" />
                <div className="h-5 bg-green-500" />
                <div className="h-5 bg-red-500" />
                <div className="h-5 bg-amber-500" />
                <div className="h-5 bg-blue-700" />
              </div>
            </Radio>
          ))}
        </RadioGroup>
      </Dialog>
    </DialogRoot>
  );
};
