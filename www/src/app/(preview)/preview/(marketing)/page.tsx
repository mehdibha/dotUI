import { Button } from "@/components/core/button";

export default function PreviewPage() {
  return (
    <div className="space-y-20">
      {/* Hero */}
      <div>
        <h1 className="text-balance text-3xl font-semibold tracking-tighter">
          Acme is a purpose-built tool for planning and building products
        </h1>
        <p className="text-fg-muted mt-4 text-balance text-sm">
          Meet the system for modern software development. Streamline issues,
          projects, and product roadmaps.
        </p>
        <div className="mt-4 flex items-center gap-2">
          <Button href="/preview/login" variant="primary" className="mt-4">
            Start for free
          </Button>
          <Button variant="quiet" className="mt-4">
            Learn more
          </Button>
        </div>
      </div>
      {/* Brands */}
      <div className="text-center">
        <h2 className="text-fg-muted text-base tracking-tighter">
          Powering the world&apos;s best product teams.
        </h2>
        <div className="grid grid-cols-4 grid-rows-2 gap-4"></div>
      </div>
      {/* Features */}
      <div className="grid h-[700px] grid-cols-3 grid-rows-4 gap-4">
        <div className="bg-bg-muted col-span-1 row-span-1 rounded-lg"></div>
        <div className="bg-bg-muted col-span-1 row-span-2 rounded-lg"></div>
        <div className="bg-bg-muted col-span-1 row-span-1 rounded-lg"></div>
        <div className="bg-bg-muted col-span-1 row-span-2 rounded-lg"></div>
        <div className="bg-bg-muted col-span-1 row-span-1 rounded-lg"></div>
        <div className="bg-bg-muted col-span-1 row-span-1 rounded-lg"></div>
        <div className="bg-bg-muted col-span-1 row-span-1 rounded-lg"></div>
      </div>
    </div>
  );
}
