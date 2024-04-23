import { InputOTP } from "@/lib/components/core/default/input-otp";

export default function InputOTPSizesDemo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="space-y-1">
        <p>sm</p>
        <InputOTP length={6} size="sm" />
      </div>
      <div>
        <p>md</p>
        <InputOTP length={6} size="md" />
      </div>
      <div>
        <p>lg</p>
        <InputOTP length={6} size="lg" />
      </div>
    </div>
  );
}
