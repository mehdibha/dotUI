import { HexagonIcon } from "lucide-react";
import { Button } from "@/registry/ui/default/core/button";

export default function PreviewPage() {
  return (
    <div className="container">
      {/* Header */}
      <div className="sticky top-4 mx-auto flex w-full max-w-screen-lg items-center gap-4 rounded-lg border px-4 py-2">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <HexagonIcon />
          <div className="font-bold">Acme</div>
        </div>
        {/* Navigation */}
        <div className="flex flex-1 items-center gap-2">
          {[{ label: "Features", href: "#" }].map((link, index) => (
            <Button key={index} variant="quiet" size="sm">
              {link.label}
            </Button>
          ))}
        </div>
        {/* Call to actions */}
        <div className="flex items-center gap-2">
          <Button size="sm" href={"/preview/login"}>
            Login
          </Button>
          <Button variant="primary" size="sm" href={"/preview/signup"}>
            Sign up
          </Button>
        </div>
      </div>
      <main className="container min-h-[2500px]">
        {/* Hero */}
        <div></div>
      </main>
    </div>
  );
}
