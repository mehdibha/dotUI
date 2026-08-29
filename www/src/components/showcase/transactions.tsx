"use client"

import {
  MonitorIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  WalletIcon,
  ZapIcon,
} from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/registry/ui/card"
import { Separator } from "@/registry/ui/separator"

const transactions = [
  {
    merchant: "Whole Foods Market",
    date: "Aug 28",
    amount: "-$86.20",
    icon: ShoppingCartIcon,
  },
  {
    merchant: "Stripe payout",
    date: "Aug 27",
    amount: "+$1,250.00",
    positive: true,
    icon: WalletIcon,
  },
  {
    merchant: "Netflix",
    date: "Aug 26",
    amount: "-$15.49",
    icon: MonitorIcon,
  },
  {
    merchant: "Amazon",
    date: "Aug 24",
    amount: "-$42.99",
    icon: ShoppingBagIcon,
  },
  {
    merchant: "Con Edison",
    date: "Aug 22",
    amount: "-$128.34",
    icon: ZapIcon,
  },
  {
    merchant: "Trader Joe's",
    date: "Aug 21",
    amount: "-$54.87",
    icon: ShoppingCartIcon,
  },
]

export function Transactions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <Card className={cn(className)} {...props}>
      <CardHeader>
        <CardTitle>Recent transactions</CardTitle>
        <CardAction>
          <Button variant="quiet" size="sm">
            View all
          </Button>
        </CardAction>
      </CardHeader>
      <Separator />
      <CardContent className="space-y-4">
        {transactions.map((transaction) => (
          <div
            key={transaction.merchant}
            className="flex items-center justify-between gap-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-neutral">
                <transaction.icon className="size-4" aria-hidden />
              </div>
              <div className="min-w-0 text-sm">
                <p className="truncate">{transaction.merchant}</p>
                <p className="text-fg-muted">{transaction.date}</p>
              </div>
            </div>
            <p
              className={cn(
                "shrink-0 text-sm tabular-nums",
                transaction.positive && "text-fg-success",
              )}
            >
              {transaction.amount}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
