import Link from "next/link";
import { LogInIcon } from "lucide-react";
import { Button } from "@/lib/components/core/default/button";

export default function ButtonAsChildDemo() {
  return (
    <Button prefix={<LogInIcon />} asChild>
      <Link href="/login">Login</Link>
    </Button>
  );
}
