import { InputOTP } from "@/lib/components/core/default/input-otp";

export default function InputOTPVariantsDemo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="space-y-1">
        <p>default</p>
        <InputOTP length={6} variant="default" />
      </div>
      <div>
        <p>error</p>
        <InputOTP length={6} variant="error" />
      </div>
      <div>
        <p>success</p>
        <InputOTP length={6} variant="success" />
      </div>
    </div>
  );
}
