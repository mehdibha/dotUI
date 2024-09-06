import { WalletIcon } from "@/lib/icons";
import {
  AlertContent,
  AlertRoot,
  AlertTitle,
} from "@/registry/ui/default/core/alert";
import { Button } from "@/registry/ui/default/core/button";

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
