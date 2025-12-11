"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import StoreSelectionModal, { type StoreInfo } from "./StoreSelectionModal";
import { getStoresBasic } from "@/lib/getStores";

const FOOTER_LINKS = [
  { label: "Privacy Policy", href: "/privacy", newTab: true },
  { label: "Terms & Conditions", href: "/terms", newTab: true },
  { label: "Contact Us", action: "contact" },
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
  const [storeModalOpen, setStoreModalOpen] = useState(false);
  const [stores, setStores] = useState<StoreInfo[]>([]);

  useEffect(() => {
    const fetchStores = async () => {
      const storesData = await getStoresBasic({ includeExtendedInfo: true });
      setStores(storesData as StoreInfo[]);
    };
    fetchStores();
  }, []);

  const handleContactUsClick = () => {
    setStoreModalOpen(true);
  };

  const handleStoreSelect = (store: StoreInfo) => {
    if (store.email) {
      window.location.href = `mailto:${store.email}`;
    }
    setStoreModalOpen(false);
  };
  return (
    <footer className="footer-container">
      {/* Mobile layout: stacked vertically */}
      <div className="lg:hidden w-full flex flex-col items-center">
        {/* Logo */}
        <div className="footer-logo-wrapper">
          <Image
            src="/images/logo.png"
            alt="Hotlob logo"
            width={192}
            height={112}
            className="object-contain"
          />
        </div>

        {/* Footer Links */}
        <div className="footer-links">
          {FOOTER_LINKS.map((link) => {
            if ("action" in link && link.action === "contact") {
              return (
                <button
                  key="contact-us"
                  onClick={handleContactUsClick}
                  className="footer-link bg-none border-none cursor-pointer"
                >
                  {link.label}
                </button>
              );
            }
            const linkObj = link as { label: string; href: string; newTab?: boolean };
            return (
              <Link
                key={linkObj.href}
                href={linkObj.href}
                target={linkObj.newTab ? "_blank" : undefined}
                rel={linkObj.newTab ? "noreferrer" : undefined}
                className="footer-link"
              >
                {linkObj.label}
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className="footer-divider"></div>

        {/* Copyright */}
        <div className="footer-copyright">
          <p>©2020 by Ocean Food Group Pty Ltd.</p>
          <p>All Rights Reserved.</p>
        </div>

        {/* Social Icons */}
        <div className="footer-social">
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
                width={48}
                height={48}
                className="footer-social-icon"
              />
            </a>
          ))}
        </div>
      </div>

      {/* Desktop layout: horizontal structure */}
      <div className="hidden lg:flex w-full flex-col footer-gap-medium">
        {/* Top row: Logo + Links */}
        <div className="flex w-full items-center justify-center footer-gap-large">
          <div className="relative footer-logo-size-large">
            <Image
              src="/images/logo.png"
              alt="Hotlob logo"
              fill
              sizes="(max-width: 1920px) 10vw, 192px"
              className="object-contain"
            />
          </div>
          <div className="flex items-center nav-gap-small">
            {FOOTER_LINKS.map((link) => {
              if ("action" in link && link.action === "contact") {
                return (
                  <button
                    key="contact-us"
                    onClick={handleContactUsClick}
                    className="footer-link bg-none border-none cursor-pointer"
                  >
                    {link.label}
                  </button>
                );
              }
              const linkObj = link as { label: string; href: string; newTab?: boolean };
              return (
                <Link
                  key={linkObj.href}
                  href={linkObj.href}
                  target={linkObj.newTab ? "_blank" : undefined}
                  rel={linkObj.newTab ? "noreferrer" : undefined}
                  className="footer-link"
                >
                  {linkObj.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom row: Copyright + Social Icons */}
        <div className="flex w-full items-center justify-between border-t border-[#FFFFFF33] footer-bottom-padding">
          <p className="text-[clamp(12px,0.729vw,14px)] font-normal text-white">
            ©2020 by Ocean Food Group Pty Ltd. All Rights Reserved.
          </p>
          <div className="flex items-center footer-gap-medium">
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
                  className="h-auto w-auto social-icon-size"
                />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Store Selection Modal for Contact Us */}
      <StoreSelectionModal
        stores={stores}
        open={storeModalOpen}
        onClose={() => setStoreModalOpen(false)}
        onStoreSelect={handleStoreSelect}
      />
    </footer>
  );
}
