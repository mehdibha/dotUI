"use client";

import React from "react";
import { Label } from "@/lib/components/core/default/label";
import { Switch } from "@/lib/components/core/default/switch";
import { cn } from "@/lib/utils/classes";
import { PricingPlan } from "./pricing-plan";
import type { Plan } from "./types";

interface PricingProps {
  plans: Plan[];
  className?: string;
}

export const PricingComparaison = (props: PricingProps) => {
  const { plans, className } = props;
  const [billing, setBilling] = React.useState<"monthly" | "yearly">("monthly");

  return (
    <div className={className}>
      <div className="flex items-center justify-center space-x-4">
        <Label htmlFor="subscription" className="text-xl">
          Monthly
        </Label>
        <Switch
          checked={!(billing === "monthly")}
          onCheckedChange={(checked) => setBilling(checked ? "yearly" : "monthly")}
          id="subscription"
        />
        <Label htmlFor="subscription" className="text-xl">
          Yearly
        </Label>
      </div>
      <div
        className={cn("mt-16 grid grid-cols-3 items-center", {
          "mx-auto max-w-3xl grid-cols-2": plans.length === 2,
        })}
      >
        {plans.map((plan, index) => (
          <PricingPlan
            key={plan.name}
            {...plan}
            billing={billing}
            className={
              index === 0
                ? "rounded-l-3xl"
                : index === 1
                  ? "rounded-3xl"
                  : index === 2
                    ? "rounded-r-3xl"
                    : "rounded-3xl"
            }
          />
        ))}
      </div>
    </div>
  );
};
