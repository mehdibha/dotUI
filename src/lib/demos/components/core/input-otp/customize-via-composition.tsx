import {
  InputOTPRoot,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/lib/components/core/default/input-otp";

export default function InputOTPDemo() {
  return (
    <div
      className="flex flex-col items-center
     space-y-4"
    >
      <InputOTPRoot length={6}>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSeparator />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPRoot>
    </div>
  );
}
