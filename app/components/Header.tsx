"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CONSTANTS } from "@/lib/constants";

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

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header
      className="flex w-full max-w-[1920px] shrink-0 items-center justify-between bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
      style={{
        paddingInline: "min(3.125vw, 60px)",
        height: "min(4.167vw, 80px)",
      }}
    >
      <Link
        href="/"
        aria-label="Hotlob home"
        className="shrink-0"
      >
        <Image
          src="/images/logo.png"
          alt="Hotlob logo"
          width={96}
          height={79}
          priority
          className="h-auto w-auto"
          style={{ width: "min(5vw, 96px)", height: "min(4.115vw, 79px)" }}
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
                style={{ width: "min(1.25vw, 24px)", height: "min(1.25vw, 24px)" }}
              />
            </a>
          ))}
        </div>
        <a
          href={CONSTANTS.ORDER_URL}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center bg-[#EA4148] text-[clamp(11px,0.677vw,13px)] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#C71E25]"
          style={{
            width: "min(6.25vw, 120px)",
            height: "min(1.667vw, 32px)",
            borderRadius: "min(1.042vw, 20px)",
          }}
        >
          Order Online
        </a>
      </div>
    </header>
  );
}
