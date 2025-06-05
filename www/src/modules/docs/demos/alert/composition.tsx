import {
  AlertContent,
  AlertRoot,
  AlertTitle,
} from "@/components/dynamic-ui/alert";
import { Button } from "@/components/dynamic-ui/button";
import { WalletIcon } from "lucide-react";

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
