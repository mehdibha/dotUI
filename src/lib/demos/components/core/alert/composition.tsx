import { WalletIcon } from "lucide-react";
import { AlertContent, AlertRoot, AlertTitle } from "@/lib/components/core/default/alert";
import { Button } from "@/lib/components/core/default/button";

export default function AlertDemo() {
  return (
    <AlertRoot>
      <WalletIcon />
      <div className="flex-1">
        <AlertTitle>Payment Information</AlertTitle>
        <AlertContent>Enter your payment method to complete your purchase.</AlertContent>
      </div>
      <Button variant="primary" size="sm">
        Upgrade
      </Button>
    </AlertRoot>
  );
}
