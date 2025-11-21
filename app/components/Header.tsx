"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
// Removed direct ORDER_URL fallback usage; keep constants import only if needed elsewhere.
import { useState } from "react";
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

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      {/* 移动端导航栏 - 1024px以下显示 */}
      <header className="sticky top-0 z-50 flex lg:hidden w-full h-[120px] shrink-0 items-center justify-between bg-white px-[30px] shadow-[0_4px_4px_0_rgba(0,0,0,0.10)] max-w-[750px]">
        <Link href="/" aria-label="Hotlob home" className="shrink-0">
          <Image
            src="/images/logo.png"
            alt="Hotlob logo"
            width={140}
            height={116}
            priority
            className="h-auto w-auto"
          />
        </Link>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex h-[50px] w-[50px] shrink-0 items-center justify-center"
          aria-label="Toggle mobile menu"
        >
          <Image
            src="/images/icons/navi-btn.svg"
            alt="Menu"
            width={50}
            height={50}
            className="h-full w-full"
          />
        </button>
      </header>

      {/* 桌面端导航栏 - 1024px及以上显示 */}
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

      {/* 移动端菜单蒙层 */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${
          isMobileMenuOpen ? "flex" : "hidden"
        } items-center justify-center bg-black/90`}
        style={{ top: "120px" }}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div
          className="flex flex-col items-center justify-center gap-[100px]"
          style={{ marginTop: "100px" }}
          onClick={(e) => e.stopPropagation()}
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center justify-center gap-2.5 px-4 py-2.5 text-[48px] font-semibold leading-none transition-colors ${
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
