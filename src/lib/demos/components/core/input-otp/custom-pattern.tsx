

import { InputOTP } from "@/lib/components/core/default/input-otp";

export default function InputOTPDemo() {
  return <InputOTP length={6} pattern={"^[a-zA-Z0-9]+$"} />;
}
