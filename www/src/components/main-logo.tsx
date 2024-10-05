import Link from "next/link";
import { Avatar } from "@/registry/ui/default/core/avatar";
import { Badge } from "@/registry/ui/default/core/badge";
import { cn } from "@/registry/ui/default/lib/cn";
import { focusRing } from "@/registry/ui/default/lib/focus-styles";
import { siteConfig } from "@/config";

export const Logo = (props: { collapsed?: boolean }) => {
  return (
    <Link
      href="/"
      className={cn(
        focusRing(),
        "flex items-center space-x-2 rounded opacity-100 transition-[opacity,transform] duration-300 ease-out"
      )}
    >
      <Avatar
        src={siteConfig.global.logo}
        alt={siteConfig.global.name}
        loading="lazy"
        width={24}
        height={24}
        className="size-6 rounded-sm"
      />
      {!props.collapsed && (
        <>
          <div className="font-josephin mt-1 font-bold leading-normal tracking-tighter">
            {siteConfig.global.name}
          </div>
          <Badge size="sm" variant="neutral" className="border">
            beta
          </Badge>
        </>
      )}
    </Link>
  );
};
