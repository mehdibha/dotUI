"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useAnimate } from "framer-motion";
import { MenuIcon, SearchIcon } from "lucide-react";
import { SearchDialog } from "@/components/search-dialog";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/utils/classes";
import { siteConfig } from "@/config";

const config = siteConfig.header;

export const Header = () => {
  const { scrolled } = useScroll();
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [refLogo, animate] = useAnimate();
  const [refCTA] = useAnimate();

  React.useEffect(() => {
    void animate(
      refLogo.current,
      {
        x: scrolled ? -35 : -100,
        opacity: scrolled ? 1 : 0,
      },
      { duration: 0.3 }
    );
    void animate(
      refCTA.current,
      {
        x: scrolled ? 120 : 180,
        opacity: scrolled ? 1 : 0,
      },
      { duration: 0.3 }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrolled]);

  return (
    <header className="pointer-events-none sticky top-0 z-50 w-full duration-500 animate-in fade-in slide-in-from-top-2">
      <div className="container relative flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-8 ">
        <div
          className={cn("pointer-events-auto", {
            "pointer-events-none": scrolled,
          })}
        >
          <Link
            href="/"
            className={cn(
              "mr-8 flex items-center space-x-2 transition-all duration-300 hover:opacity-80",
              {
                "translate-x-[-10px] opacity-0 hover:opacity-0": scrolled,
              }
            )}
            suppressHydrationWarning
          >
            <Image
              src={siteConfig.global.logo}
              alt={siteConfig.global.name}
              loading="lazy"
              width={25}
              height={25}
            />
            <span className="inline-block font-bold">{siteConfig.global.name}</span>
          </Link>
        </div>
        <div
          className={cn(
            "pointer-events-auto absolute left-1/2 top-1/2 mr-8 hidden translate-x-[-50%] translate-y-[-50%] rounded-md bg-gray-300/0 px-3 backdrop-blur-md transition-all duration-300 lg:block",
            {
              "bg-card/90 shadow-sm": scrolled,
            }
          )}
        >
          <div className="overflow-hidden py-[6px]">
            <div
              suppressHydrationWarning
              className={cn("relative transition-all duration-300", {
                "ml-[38px] mr-[120px]": scrolled,
              })}
            >
              <motion.div
                ref={refLogo}
                className="absolute"
                initial={{ x: -90, y: 4, opacity: 0 }}
              >
                <Link href="/">
                  <Image
                    src={siteConfig.global.logo}
                    alt={siteConfig.global.name}
                    loading="lazy"
                    width={20}
                    height={20}
                  />
                </Link>
              </motion.div>
              <Nav items={config.nav.links} />
              <motion.div
                ref={refCTA}
                className="absolute right-0"
                initial={{ x: 0, y: -28, opacity: 0 }}
              >
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setSearchOpen(true);
                  }}
                >
                  <SearchIcon size={18} className="mr-2" />
                  <span>Search</span>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
        <div
          suppressHydrationWarning
          className={cn(
            "pointer-events-auto hidden items-center space-x-4 transition-all duration-300 lg:flex",
            {
              "pointer-events-none translate-x-[10px] opacity-0": scrolled,
            }
          )}
        >
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setSearchOpen(true);
              }}
            >
              <SearchIcon size={18} className="mr-2" />
              <span>Search</span>
            </Button>
          </div>
        </div>
        <MobileNav />
      </div>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
};

interface NavItem {
  label: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
}

interface NavProps {
  items: NavItem[];
  direction?: "column" | "row";
  onNavItemClick?: () => void;
}

const Nav = (props: NavProps) => {
  const { items, direction = "row", onNavItemClick } = props;
  const pathname = usePathname();

  return (
    <nav
      className={cn("flex items-center gap-0 sm:gap-2", {
        "flex-col gap-2": direction === "column",
      })}
    >
      {items?.map(
        (item, index) =>
          item.href && (
            <Link
              key={index}
              href={item.disabled ? "#" : item.href}
              className={cn(
                "w-full rounded px-4 py-1 text-center text-sm font-medium text-foreground/60 transition-all hover:text-foreground",
                {
                  "cursor-default text-foreground/30 hover:text-foreground/30":
                    item.disabled,
                  "bg-foreground/10 text-foreground": pathname.startsWith(item.href),
                }
              )}
              onClick={onNavItemClick}
            >
              {item.label}
            </Link>
          )
      )}
    </nav>
  );
};

const MobileNav = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="pointer-events-auto lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" color="neutral" size="icon">
            <MenuIcon />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className=" w-56 bg-card pt-12 ">
          <div className="flex flex-col space-y-8">
            <Link
              href="/"
              className="flex items-center justify-center space-x-2 transition-all hover:opacity-80"
              onClick={handleClose}
            >
              <Image
                src={siteConfig.global.logo}
                alt={siteConfig.global.name}
                loading="lazy"
                width={20}
                height={20}
              />
              <span>rCopy</span>
            </Link>
            <Nav
              items={config.nav.links}
              direction="column"
              onNavItemClick={handleClose}
            />
            {/* TODO: add searchdialog */}
            <Button variant="secondary" size="sm">
              Search
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
