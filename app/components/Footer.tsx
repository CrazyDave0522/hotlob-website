import Image from "next/image";
import Link from "next/link";

const FOOTER_LINKS = [
  { label: "Privacy Policy", href: "/privacy", newTab: true },
  { label: "Terms & Conditions", href: "/terms", newTab: true },
  { label: "Contact Us", href: "mailto:hello@hotlob.com" },
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

export function Footer() {
  return (
    <footer
      className="mx-auto flex w-full max-w-[1920px] flex-col items-start bg-[#1F1F1C]"
      style={{
        padding: "min(1.042vw, 20px) min(13.542vw, 260px)",
        gap: "min(1.042vw, 20px)",
      }}
    >
      <div
        className="flex w-full flex-col items-center"
        style={{ gap: "min(1.042vw, 20px)" }}
      >
        <div
          className="flex w-full items-center justify-center"
          style={{ gap: "min(4.688vw, 90px)" }}
        >
          <div
            className="relative"
            style={{ width: "min(10vw, 192px)", height: "min(5.833vw, 112px)" }}
          >
            <Image
              src="/images/logo.png"
              alt="Hotlob logo"
              fill
              sizes="(max-width: 1920px) 10vw, 192px"
              className="object-contain"
            />
          </div>
          <div
            className="flex items-center"
            style={{ gap: "min(2.083vw, 40px)" }}
          >
            {FOOTER_LINKS.map((link) => {
              const isMailto = link.href.startsWith("mailto:");
              if (isMailto) {
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-[clamp(12px,0.729vw,14px)] font-normal text-white hover:text-[#EA4148]"
                  >
                    {link.label}
                  </a>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  target={link.newTab ? "_blank" : undefined}
                  rel={link.newTab ? "noreferrer" : undefined}
                  className="text-[clamp(12px,0.729vw,14px)] font-normal text-white hover:text-[#EA4148]"
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div
          className="flex w-full items-center justify-between border-t border-[#FFFFFF1A]"
          style={{ padding: "min(0.521vw, 10px) 0" }}
        >
          <p className="text-[clamp(12px,0.729vw,14px)] font-normal text-white">
            ©2020 by Ocean Food Group Pty Ltd. All Rights Reserved.
          </p>
          <div
            className="flex items-start"
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
        </div>
      </div>
    </footer>
  );
}
