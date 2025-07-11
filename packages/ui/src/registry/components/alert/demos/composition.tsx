import { WalletIcon } from "lucide-react";

import {
  AlertContent,
  AlertRoot,
  AlertTitle,
} from "@dotui/ui/components/alert";
import { Button } from "@dotui/ui/components/button";

export default function AlertDemo() {
  return (
    <AlertRoot>
      <WalletIcon />
      <div className="flex-1">
        <AlertTitle>Payment Information</AlertTitle>
        <AlertContent>
          Enter your payment method to complete your purchase.
        </AlertContent>
      </div>
      <Button variant="primary" size="sm">
        Upgrade
      </Button>
    </AlertRoot>
  );
}
