import { HexagonIcon } from "lucide-react";
import { Button } from "@/registry/ui/default/core/button";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container max-w-screen-lg">
      <Header />
      <main className="mt-16">{children}</main>
      <Footer />
    </div>
  );
}

const Header = () => {
  return (
    <div className="bg-bg-muted/50 sticky top-4 mx-auto flex w-full items-center gap-4 rounded-lg border px-4 py-2 backdrop-blur-lg">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <HexagonIcon />
        <div className="font-bold">Acme</div>
      </div>
      {/* Navigation */}
      <div className="flex flex-1 items-center gap-2">
        {[{ label: "Pricing", href: "/pricing" }].map((link, index) => (
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
  );
};

const Footer = () => {
  return (
    <div className="mt-16">
      <div className="flex items-center gap-2">
        <div className="font-bold">Acme</div>
        <div className="text-fg-muted">© 2024</div>
      </div>
    </div>
  );
};
