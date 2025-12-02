"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
// Removed direct ORDER_URL fallback usage; keep constants import only if needed elsewhere.
import { useState, useEffect } from "react";
import { NavOrderOnlineButton } from "./NavOrderOnlineButton";

const NAV_ITEMS = [
  { label: "HOME", href: "/" },
  { label: "SEE OUR FOOD", href: "/see-our-food" },
  { label: "CATERING", href: "/catering" },
  { label: "OUR LOCATIONS", href: "/our-locations" },
  { label: "HOTLOB NEWS", href: "/news" },
];

const SOCIAL_LINKS = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/hotlob/",
    icon: "/images/icons/fb.svg",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/hotlobaustralia/",
    icon: "/images/icons/ins.svg",
  },
];

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Disable body scroll when the mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup: restore body scroll on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      {/* Mobile header - visible below 1024px */}
      <header className="mobile-header sticky top-0 z-50 flex lg:hidden w-full shrink-0 items-center justify-between bg-white px-5 shadow-[0_2px_4px_0_rgba(0,0,0,0.08)]">
        <Link href="/" aria-label="Hotlob home" className="shrink-0">
          <div className="logo-wrapper relative">
            <Image
              src="/images/logo.png"
              alt="Hotlob logo"
              fill
              priority
              className="logo-img object-contain"
              sizes="(max-width:750px) calc((140 / 750) * 100vw), 140px"
            />
          </div>
        </Link>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="button-click flex mobile-menu-button shrink-0 items-center justify-center"
          aria-label="Toggle mobile menu"
        >
          <Image
            src="/images/icons/navi-btn.svg"
            alt="Menu"
            width={50}
            height={50}
            className="menu-img h-full w-full"
          />
        </button>
      </header>

      {/* Desktop header - visible at 1024px and above */}
      <header
        className="sticky top-0 z-50 hidden lg:flex w-full max-w-[1920px] shrink-0 items-center justify-between bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
        style={{
          paddingInline: "min(3.125vw, 60px)",
          height: "min(4.167vw, 80px)",
        }}
      >
        <Link href="/" aria-label="Hotlob home" className="shrink-0">
          <Image
            src="/images/logo.png"
            alt="Hotlob logo"
            width={96}
            height={79}
            priority
            className="h-auto w-auto"
            style={{
              width: "min(5vw, 96px)",
              height: "min(4.115vw, 79px)",
            }}
          />
        </Link>

        <nav
          className="ml-auto mr-auto flex flex-1 items-center justify-center text-[clamp(14px,0.938vw,18px)] font-semibold"
          style={{ gap: "min(4.167vw, 80px)" }}
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`flex items-center justify-center gap-2.5 border-b-4 py-2.5 transition-colors hover:text-[#EA4148] ${
                isActive(item.href)
                  ? "rounded-[10px] border-b-[#EA4148] text-[#EA4148]"
                  : "border-b-transparent text-[#665F5B]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div
          className="flex items-center"
          style={{ gap: "min(1.875vw, 36px)" }}
        >
          <div
            className="flex items-center"
            style={{ gap: "min(1.042vw, 20px)" }}
          >
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                aria-label={link.name}
                className="transition-opacity hover:opacity-80"
              >
                <Image
                  src={link.icon}
                  alt={`${link.name} icon`}
                  width={24}
                  height={24}
                  className="h-auto w-auto"
                  style={{
                    width: "min(1.25vw, 24px)",
                    height: "min(1.25vw, 24px)",
                  }}
                />
              </a>
            ))}
          </div>
          <NavOrderOnlineButton />
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`mobile-menu-overlay fixed inset-0 z-40 lg:hidden ${
          isMobileMenuOpen ? "flex" : "hidden"
        } flex-col bg-black/90 overflow-y-auto`}
        style={{
          // paddingTop = responsive header height + responsive top margin for the menu items
          // 375px: 64 + 50 = 114; 750px: 120 + 100 = 220
          paddingTop: "clamp(114px, calc(220/750*100vw), 220px)",
          paddingBottom: "clamp(25px, calc(50/750*100vw), 50px)",
        }}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div
          className="mobile-menu-inner flex flex-col items-center"
          onClick={(e) => e.stopPropagation()}
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`button-click flex items-center justify-center gap-2.5 px-4 py-2.5 mobile-menu-item font-semibold leading-none transition-colors ${
                isActive(item.href)
                  ? "rounded-[10px] border-b-4 border-[#EA4148] text-[#EA4148]"
                  : "text-white hover:text-[#EA4148]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
