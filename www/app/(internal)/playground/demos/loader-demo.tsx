"use client";

import { Loader } from "@dotui/registry/ui/loader";

export function LoaderDemo() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-4">
        <Loader size={16} />
        <Loader size={20} />
        <Loader size={24} />
        <Loader size={32} />
        <Loader size={40} />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Loader size={24} stroke={1} />
        <Loader size={24} stroke={2} />
        <Loader size={24} stroke={3} />
        <Loader size={24} stroke={4} />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Loader size={24} strokeLength={0.15} />
        <Loader size={24} strokeLength={0.25} />
        <Loader size={24} strokeLength={0.5} />
        <Loader size={24} strokeLength={0.75} />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Loader size={24} speed={0.5} />
        <Loader size={24} speed={0.8} />
        <Loader size={24} speed={1.2} />
        <Loader size={24} speed={2} />
      </div>
    </div>
  );
}
