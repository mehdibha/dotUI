"use client";

import { Checkbox } from "@/registry/ui/default/core/checkbox";
import { Link } from "@/registry/ui/default/core/link";

export default function Demo() {
  return (
    <Checkbox>
      I accept the{" "}
      <Link variant="accent" href="#">
        terms and conditions
      </Link>
    </Checkbox>
  );
}
