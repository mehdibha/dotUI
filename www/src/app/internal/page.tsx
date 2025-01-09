import { Loader as Loader4 } from "@/registry/core/loader-dot-spinner";
import { Loader as Loader3 } from "@/registry/core/loader-line-spinner";
import { Loader } from "@/registry/core/loader-ring";
import { Loader as Loader2 } from "@/registry/core/loader-tailspin";
import { Loader as Loader5 } from "@/registry/core/loader-wave";

export default function Page() {
  return (
    <div>
      <Loader />
      <Loader2 />
      <Loader3 />
      <Loader4 />
      <Loader5 />
    </div>
  );
}
