"use client";

import { Checkbox } from "@/lib/components/core/default/checkbox/checkbox";
import { Link } from "@/lib/components/core/default/link";

export default function CheckboxDemo() {
  return (
    <Checkbox defaultSelected>
      I accept the <Link href="#">terms and conditions</Link>
    </Checkbox>
  );
}
