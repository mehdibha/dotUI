"use client";

import { Checkbox } from "@/components/dynamic-core/checkbox";
import { Link } from "@/components/dynamic-core/link";

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
