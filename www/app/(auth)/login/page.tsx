"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";

import { Button } from "@dotui/ui/components/button";

import { LoginForm } from "@/modules/auth/components/login-form";

export default function Page() {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };

  return (
    <div className="relative flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="absolute top-4 left-4">
        <Button variant="quiet" prefix={<ArrowLeftIcon />} size="sm" href="/">
          Back to home
        </Button>
      </div>
      <LoginForm />
    </div>
  );
}
